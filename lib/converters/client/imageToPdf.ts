import jsPDF, { jsPDFOptions } from 'jspdf';
import { ImagePreviewItem } from '@/lib/types/conversion';

interface ImageInfo {
  dataUrl: string;
  width: number;
  height: number;
  format: ImagePreviewItem['format'];
  orientation: 'portrait' | 'landscape';
}

export interface ImageToPdfResult {
  blob: Blob;
  images: ImagePreviewItem[];
}

export async function convertImageToPdf(files: File[]): Promise<ImageToPdfResult> {
  if (!files.length) {
    throw new Error('No images provided');
  }

  const imageInfos: ImageInfo[] = [];
  const firstImage = await loadImage(files[0]);
  imageInfos.push(firstImage);
  const pdf = createPdfDocument(firstImage.orientation);
  addImageToPage(pdf, firstImage);

  for (let i = 1; i < files.length; i++) {
    const imageInfo = await loadImage(files[i]);
    imageInfos.push(imageInfo);
    pdf.addPage('a4', imageInfo.orientation === 'landscape' ? 'l' : 'p');
    addImageToPage(pdf, imageInfo);
  }

  const blob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
  const images: ImagePreviewItem[] = imageInfos.map((info, index) => ({
    id: `${Date.now()}-${index}`,
    src: info.dataUrl,
    name: `Page ${index + 1}`,
    format: info.format,
    width: info.width,
    height: info.height,
  }));

  return { blob, images };
}

function createPdfDocument(orientation: 'portrait' | 'landscape') {
  const options: jsPDFOptions = {
    orientation: orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: 'a4',
    compress: true,
  };
  return new jsPDF(options);
}

function addImageToPage(pdf: jsPDF, imageInfo: ImageInfo) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 5;

  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin * 2;

  const ratio = Math.min(
    availableWidth / imageInfo.width,
    availableHeight / imageInfo.height
  );

  const renderWidth = imageInfo.width * ratio;
  const renderHeight = imageInfo.height * ratio;

  const x = (pageWidth - renderWidth) / 2;
  const y = (pageHeight - renderHeight) / 2;

  pdf.addImage(imageInfo.dataUrl, imageInfo.format, x, y, renderWidth, renderHeight, undefined, 'FAST');
}

async function loadImage(file: File): Promise<ImageInfo> {
  const dataUrl = await fileToBase64(file);
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const format = getImageFormat(file);
      const orientation = img.width >= img.height ? 'landscape' : 'portrait';
      resolve({
        dataUrl,
        width: img.width,
        height: img.height,
        format,
        orientation,
      });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function getImageFormat(file: File): ImagePreviewItem['format'] {
  if (file.type.includes('png')) return 'PNG';
  if (file.type.includes('webp')) return 'WEBP';
  if (file.type.includes('gif')) return 'GIF';
  return 'JPEG';
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function previewItemToInfo(item: ImagePreviewItem): ImageInfo {
  return {
    dataUrl: item.src,
    width: item.width,
    height: item.height,
    format: item.format,
    orientation: item.width >= item.height ? 'landscape' : 'portrait',
  };
}

export async function buildPdfFromPreviewItems(items: ImagePreviewItem[]): Promise<Blob> {
  if (!items.length) {
    throw new Error('No images to build PDF');
  }

  const first = previewItemToInfo(items[0]);
  const pdf = createPdfDocument(first.orientation);
  addImageToPage(pdf, first);

  for (let i = 1; i < items.length; i++) {
    const info = previewItemToInfo(items[i]);
    pdf.addPage('a4', info.orientation === 'landscape' ? 'l' : 'p');
    addImageToPage(pdf, info);
  }

  return new Blob([pdf.output('blob')], { type: 'application/pdf' });
}

