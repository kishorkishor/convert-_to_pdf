export interface PdfToDocxResult {
  blob: Blob;
  text: string;
}

export async function convertPdfToDocx(file: File): Promise<PdfToDocxResult> {
  const arrayBuffer = await file.arrayBuffer();
  const clonedBuffer = arrayBuffer.slice(0);

  const pdfjsLib = await loadPdfJs();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(clonedBuffer) });
  const pdf = await loadingTask.promise;

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += `\n\n--- Page ${pageNum} ---\n\n${pageText}`;
  }

  const blob = buildDocxFromText(fullText);
  return { blob, text: fullText };
}

export function buildDocxFromText(text: string): Blob {
  const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}
{\\colortbl;\\red0\\green0\\blue0;}
\\viewkind4\\uc1\\pard\\cf1\\f0\\fs22
${text.replace(/\n/g, '\\\\par\\n')}
}`;

  return new Blob([rtfContent], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

async function loadPdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF processing must run in the browser');
  }

  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }

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

