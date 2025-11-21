import mammoth from 'mammoth';
import { convertHtmlToPdf } from './htmlToPdf';

export async function convertDocxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Convert DOCX to HTML using mammoth
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;
  
  // Convert HTML to PDF
  const filename = file.name.replace(/\.[^/.]+$/, '');
  return convertHtmlToPdf(html, filename);
}


