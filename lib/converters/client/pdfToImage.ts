import { ImagePreviewItem } from '@/lib/types/conversion';

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

export interface PdfToImageResult {
  blobs: Blob[];
  images: ImagePreviewItem[];
}

export async function convertPdfToImage(file: File, format: 'jpg' | 'png' = 'jpg'): Promise<PdfToImageResult> {
  const arrayBuffer = await file.arrayBuffer();
  // Convert to Uint8Array to avoid detachment issues
  const data = new Uint8Array(arrayBuffer);
  const pdfjsLib: any = await loadPdfJs();

  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const blobs: Blob[] = [];
  const images: ImagePreviewItem[] = [];

  for (let i = 1; i <= numPages; i++) {
    const { blob, width, height } = await renderPdfPageToImage(data, i - 1, format, pdfjsLib);
    blobs.push(blob);
    const dataUrl = await blobToDataUrl(blob);
    images.push({
      id: `${Date.now()}-${i}`,
      src: dataUrl,
      name: `Page ${i}`,
      format: format === 'png' ? 'PNG' : 'JPEG',
      width,
      height,
    });
  }

  return { blobs, images };
}

async function renderPdfPageToImage(
  pdfData: Uint8Array,
  pageIndex: number,
  format: 'jpg' | 'png',
  pdfjsLib: any
): Promise<{ blob: Blob; width: number; height: number }> {
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
        resolve({ blob, width: viewport.width, height: viewport.height });
      } else {
        reject(new Error('Failed to convert canvas to blob'));
      }
    }, `image/${format}`, 0.95);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

