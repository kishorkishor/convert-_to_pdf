import { FileType, getFileType } from './fileUtils';

export type ConversionType =
  | 'image-to-pdf'
  | 'pdf-to-image'
  | 'html-to-pdf'
  | 'docx-to-pdf'
  | 'ppt-to-pdf'
  | 'pdf-to-ppt'
  | 'pdf-to-docx';

export interface ConversionOption {
  id: ConversionType;
  label: string;
  from: string[];
  to: string;
  description: string;
}

export const conversionOptions: ConversionOption[] = [
  {
    id: 'image-to-pdf',
    label: 'Image to PDF',
    from: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
    to: 'pdf',
    description: 'Convert images to PDF format',
  },
  {
    id: 'pdf-to-image',
    label: 'PDF to Image',
    from: ['pdf'],
    to: 'jpg',
    description: 'Convert PDF pages to images',
  },
  {
    id: 'html-to-pdf',
    label: 'HTML to PDF',
    from: ['html', 'htm'],
    to: 'pdf',
    description: 'Convert HTML files to PDF',
  },
  {
    id: 'docx-to-pdf',
    label: 'DOCX to PDF',
    from: ['docx', 'doc'],
    to: 'pdf',
    description: 'Convert Word documents to PDF',
  },
  {
    id: 'ppt-to-pdf',
    label: 'PPT to PDF',
    from: ['ppt', 'pptx'],
    to: 'pdf',
    description: 'Convert PowerPoint presentations to PDF',
  },
  {
    id: 'pdf-to-docx',
    label: 'PDF to DOCX',
    from: ['pdf'],
    to: 'docx',
    description: 'Convert PDF to Word document',
  },
];

export function isValidConversion(file: File, conversionType: ConversionType): boolean {
  const fileType = getFileType(file);
  const option = conversionOptions.find((opt) => opt.id === conversionType);

  if (!option) return false;

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return option.from.includes(extension) || option.from.some((ext) => file.type.includes(ext));
}

export function getConversionOptionsForFile(file: File): ConversionOption[] {
  const fileType = getFileType(file);
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  return conversionOptions.filter((option) => {
    return option.from.includes(extension) || option.from.some((ext) => file.type.includes(ext));
  });
}


