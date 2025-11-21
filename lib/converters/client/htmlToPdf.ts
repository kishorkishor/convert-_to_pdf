export async function convertHtmlToPdf(htmlContent: string, filename: string = 'document'): Promise<Blob> {
  // Dynamic import to avoid SSR issues
  const html2pdf = (await import('html2pdf.js')).default;
  
  // Create a temporary div to hold the HTML content
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  try {
    const opt = {
      margin: 1,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
    return pdfBlob as Blob;
  } finally {
    document.body.removeChild(element);
  }
}

export async function convertHtmlFileToPdf(file: File): Promise<Blob> {
  const htmlContent = await file.text();
  const filename = file.name.replace(/\.[^/.]+$/, '');
  return convertHtmlToPdf(htmlContent, filename);
}

