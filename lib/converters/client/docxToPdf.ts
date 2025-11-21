import mammoth from 'mammoth';
import { convertHtmlToPdf } from './htmlToPdf';

export interface DocxToPdfResult {
  blob: Blob;
  html: string;
}

export async function convertDocxToPdf(file: File): Promise<DocxToPdfResult> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Convert DOCX to HTML using mammoth
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;
  
  // Convert HTML to PDF
  const filename = file.name.replace(/\.[^/.]+$/, '');
  const blob = await convertHtmlToPdf(html, filename);
  return { blob, html };
}


