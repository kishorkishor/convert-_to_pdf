import jsPDF from 'jspdf';

export interface PptToPdfResult {
  blob: Blob;
  summary: string;
}

export async function convertPptToPdf(file: File): Promise<PptToPdfResult> {
  // Note: True PPT to PDF conversion requires LibreOffice or MS Office
  // This is a simplified version that creates a PDF document
  
  const summary = [
    'This PDF was generated from a PowerPoint file.',
    '',
    'Note: Full PowerPoint rendering requires:',
    '- LibreOffice or Microsoft Office',
    '- Server-side processing',
    '',
    'For complete conversion with formatting, animations,',
    'and graphics, please use professional tools like:',
    '- Adobe Acrobat',
    '- CloudConvert.com',
    '- Smallpdf.com',
    '- Microsoft PowerPoint (Save as PDF)',
  ].join('\n');

  const blob = buildSummaryPdf(summary, file.name, file);
  return {
    blob,
    summary,
  };
}

export function buildSummaryPdf(summary: string, title: string, file?: File): Blob {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFontSize(24);
  pdf.setTextColor(40, 40, 40);
  pdf.text('PowerPoint Presentation', pageWidth / 2, 40, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text(title, pageWidth / 2, 60, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);

  const lines = summary.split('\n');
  let yPosition = 100;
  lines.forEach((line) => {
    pdf.text(line, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  });

  if (file) {
    yPosition += 12;
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`File Size: ${(file.size / 1024).toFixed(2)} KB`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    pdf.text(`File Type: ${file.type || 'application/vnd.ms-powerpoint'}`, pageWidth / 2, yPosition, { align: 'center' });
  }

  return new Blob([pdf.output('blob')], { type: 'application/pdf' });
}

