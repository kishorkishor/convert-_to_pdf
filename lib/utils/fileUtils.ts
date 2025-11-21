export type FileType = 'image' | 'pdf' | 'office' | 'html' | 'unknown';

export interface FileInfo {
  name: string;
  type: string;
  size: number;
  fileType: FileType;
}

export function getFileType(file: File): FileType {
  const mimeType = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // Image types
  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) {
    return 'image';
  }

  // PDF
  if (mimeType === 'application/pdf' || extension === 'pdf') {
    return 'pdf';
  }

  // Office documents
  if (
    mimeType.includes('presentation') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('document') ||
    ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'odt', 'ods', 'odp'].includes(extension)
  ) {
    return 'office';
  }

  // HTML
  if (mimeType === 'text/html' || extension === 'html' || extension === 'htm') {
    return 'html';
  }

  return 'unknown';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function validateFileSize(file: File, maxSizeMB: number = 50): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export function getFileInfo(file: File): FileInfo {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    fileType: getFileType(file),
  };
}

export function createDownloadLink(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


