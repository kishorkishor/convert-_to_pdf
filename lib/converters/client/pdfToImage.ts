// Load PDF.js from CDN to avoid Node.js dependencies
async function loadPdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF to image conversion must run in the browser');
  }

  // Check if already loaded
  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }

  // Load from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function convertPdfToImage(file: File, format: 'jpg' | 'png' = 'jpg'): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib: any = await loadPdfJs();

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const images: Blob[] = [];

  for (let i = 1; i <= numPages; i++) {
    const imageBlob = await renderPdfPageToImage(arrayBuffer, i - 1, format, pdfjsLib);
    images.push(imageBlob);
  }

  return images;
}

async function renderPdfPageToImage(
  pdfData: ArrayBuffer,
  pageIndex: number,
  format: 'jpg' | 'png',
  pdfjsLib: any
): Promise<Blob> {
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageIndex + 1);

  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Failed to get canvas context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to blob'));
      }
    }, `image/${format}`, 0.95);
  });
}

