'use client';

import { useState } from 'react';
import { ConversionType, conversionOptions } from '@/lib/utils/validation';
import {
  convertImageToPdf,
  buildPdfFromPreviewItems,
} from '@/lib/converters/client/imageToPdf';
import {
  convertPdfToImage,
  PdfToImageResult,
} from '@/lib/converters/client/pdfToImage';
import { convertHtmlToPdf } from '@/lib/converters/client/htmlToPdf';
import {
  convertDocxToPdf,
  DocxToPdfResult,
} from '@/lib/converters/client/docxToPdf';
import {
  convertPptToPdf,
  buildSummaryPdf,
} from '@/lib/converters/client/pptToPdf';
import {
  convertPdfToDocx,
  buildDocxFromText,
} from '@/lib/converters/client/pdfToDocx';
import { ConversionPreview } from '@/components/ConversionPreview';
import {
  PreviewState,
  ImagePreviewItem,
} from '@/lib/types/conversion';
import JSZip from 'jszip';
import { createDownloadLink } from '@/lib/utils/fileUtils';

interface ConverterProps {
  file: File;
  conversionType: ConversionType;
}

export function Converter({ file, conversionType }: ConverterProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');

  const option = conversionOptions.find((opt) => opt.id === conversionType);

  const handleConvert = async () => {
    setIsConverting(true);
    setError(null);
    setPreviewState(null);
    setDownloadReady(false);

    try {
      switch (conversionType) {
        case 'image-to-pdf': {
          const result = await convertImageToPdf([file]);
          setPreviewState({
            kind: 'image-sequence',
            images: result.images,
            downloadType: 'pdf',
          });
          setOutputFilename(file.name.replace(/\.[^/.]+$/, '') + '.pdf');
          break;
        }
        case 'pdf-to-image': {
          const result: PdfToImageResult = await convertPdfToImage(file, 'jpg');
          setPreviewState({
            kind: 'image-sequence',
            images: result.images,
            downloadType: result.images.length > 1 ? 'zip' : 'image',
          });
          setOutputFilename(
            file.name.replace(/\.[^/.]+$/, '') +
              (result.images.length > 1 ? '.zip' : result.images[0]?.format === 'PNG' ? '.png' : '.jpg')
          );
          break;
        }
        case 'html-to-pdf': {
          const html = await file.text();
          await convertHtmlToPdf(html, file.name); // validate once
          setPreviewState({ kind: 'html', html, downloadType: 'pdf' });
          setOutputFilename(file.name.replace(/\.[^/.]+$/, '') + '.pdf');
          break;
        }
        case 'docx-to-pdf': {
          const result: DocxToPdfResult = await convertDocxToPdf(file);
          setPreviewState({ kind: 'html', html: result.html, downloadType: 'pdf' });
          setOutputFilename(file.name.replace(/\.[^/.]+$/, '') + '.pdf');
          break;
        }
        case 'ppt-to-pdf': {
          const result = await convertPptToPdf(file);
          setPreviewState({
            kind: 'text',
            text: result.summary,
            downloadType: 'pdf',
            title: file.name,
          });
          setOutputFilename(file.name.replace(/\.[^/.]+$/, '') + '.pdf');
          break;
        }
        case 'pdf-to-docx': {
          const result = await convertPdfToDocx(file);
          setPreviewState({ kind: 'text', text: result.text, downloadType: 'docx' });
          setOutputFilename(file.name.replace(/\.[^/.]+$/, '') + '.docx');
          break;
        }
        default:
          throw new Error('Unsupported conversion type');
      }

      setDownloadReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    if (!previewState) return;
    setIsDownloading(true);
    setError(null);
    try {
      const { blob, extension } = await buildBlobFromPreview(previewState);
      const filename = ensureExtension(outputFilename, extension);
      createDownloadLink(blob, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to prepare download');
    } finally {
      setIsDownloading(false);
    }
  };

  const updateImages = (images: ImagePreviewItem[]) => {
    setPreviewState((prev) =>
      prev && prev.kind === 'image-sequence' ? { ...prev, images } : prev
    );
  };

  const updateHtml = (html: string) => {
    setPreviewState((prev) => (prev && prev.kind === 'html' ? { ...prev, html } : prev));
  };

  const updateText = (text: string) => {
    setPreviewState((prev) => (prev && prev.kind === 'text' ? { ...prev, text } : prev));
  };

  return (
    <div className="card p-6 space-y-4" style={{ backgroundColor: 'var(--neumorphic-bg)' }}>
      <div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
          {option?.label || 'Convert File'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {file.name}
        </p>
      </div>

      <button
        onClick={handleConvert}
        disabled={isConverting}
        className="btn w-full py-3 px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          boxShadow: '6px 6px 12px var(--neumorphic-shadow-dark), -6px -6px 12px var(--neumorphic-shadow-light)',
        }}
      >
        {isConverting ? 'Converting...' : 'Convert Now'}
      </button>

      {error && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}>
          {error}
        </div>
      )}

      {downloadReady && previewState && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Output file name
            </label>
            <input
              className="w-full mt-1 rounded-2xl px-4 py-2"
              style={{
                backgroundColor: 'var(--neumorphic-bg)',
                color: 'var(--text-color)',
                border: 'none',
                boxShadow: 'inset 4px 4px 8px var(--neumorphic-shadow-dark), inset -4px -4px 8px var(--neumorphic-shadow-light)',
              }}
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
            />
          </div>

          <ConversionPreview
            data={previewState}
            onImagesChange={updateImages}
            onHtmlChange={updateHtml}
            onTextChange={updateText}
          />

          <div className="space-y-2">
            <div className="success-banner">
              {isDownloading ? 'Preparing your file…' : 'Preview ready. Download when satisfied.'}
            </div>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="btn w-full py-3 px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--success-color)',
                color: 'white',
              }}
            >
              {isDownloading ? 'Generating…' : `Download ${outputFilename || 'file'}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

async function buildBlobFromPreview(previewState: PreviewState): Promise<{ blob: Blob; extension: string }> {
  if (previewState.kind === 'image-sequence') {
    if (!previewState.images.length) {
      throw new Error('No pages available to export');
    }

    if (previewState.downloadType === 'pdf') {
      const blob = await buildPdfFromPreviewItems(previewState.images);
      return { blob, extension: '.pdf' };
    }

    if (previewState.downloadType === 'image' && previewState.images.length === 1) {
      const single = previewState.images[0];
      const imageBlob = await dataUrlToBlob(single.src);
      const ext = single.format === 'PNG' ? '.png' : '.jpg';
      return { blob: imageBlob, extension: ext };
    }

    const zip = new JSZip();
    for (let i = 0; i < previewState.images.length; i++) {
      const page = previewState.images[i];
      const pageBlob = await dataUrlToBlob(page.src);
      const ext = page.format === 'PNG' ? 'png' : 'jpg';
      zip.file(`page-${i + 1}.${ext}`, pageBlob);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return { blob: zipBlob, extension: '.zip' };
  }

  if (previewState.kind === 'html') {
    const blob = await convertHtmlToPdf(previewState.html, 'preview');
    return { blob, extension: '.pdf' };
  }

  if (previewState.kind === 'text') {
    if (previewState.downloadType === 'docx') {
      const blob = buildDocxFromText(previewState.text);
      return { blob, extension: '.docx' };
    }

    const blob = buildSummaryPdf(previewState.text, previewState.title || 'Document');
    return { blob, extension: '.pdf' };
  }

  throw new Error('Unsupported preview type');
}

function ensureExtension(filename: string, extension: string) {
  if (!filename.toLowerCase().endsWith(extension.toLowerCase())) {
    return filename + extension;
  }
  return filename;
}

function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return fetch(dataUrl).then((res) => res.blob());
}

