export type PreviewKind = 'image-sequence' | 'html' | 'text';

export interface ImagePreviewItem {
  id: string;
  src: string; // data URL
  name: string;
  format: 'PNG' | 'JPEG' | 'WEBP' | 'GIF';
  width: number;
  height: number;
}

export interface HtmlPreviewState {
  kind: 'html';
  html: string;
  downloadType: 'pdf';
}

export interface TextPreviewState {
  kind: 'text';
  text: string;
  downloadType: 'docx' | 'pdf';
  title?: string;
}

export interface ImageSequencePreviewState {
  kind: 'image-sequence';
  images: ImagePreviewItem[];
  downloadType: 'pdf' | 'zip' | 'image';
}

export type PreviewState =
  | HtmlPreviewState
  | TextPreviewState
  | ImageSequencePreviewState;

