'use client';

import { useState } from 'react';
import { ConversionType, conversionOptions } from '@/lib/utils/validation';
import { convertImageToPdf } from '@/lib/converters/client/imageToPdf';
import { convertPdfToImage } from '@/lib/converters/client/pdfToImage';
import { convertHtmlFileToPdf } from '@/lib/converters/client/htmlToPdf';
import { convertDocxToPdf } from '@/lib/converters/client/docxToPdf';
import { createDownloadLink } from '@/lib/utils/fileUtils';
import JSZip from 'jszip';

interface ConverterProps {
  file: File;
  conversionType: ConversionType;
}

export function Converter({ file, conversionType }: ConverterProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');

  const handleConvert = async () => {
    setIsConverting(true);
    setError(null);
    setDownloadReady(false);

    try {
      let blob: Blob | Blob[];
      let filename = '';

      switch (conversionType) {
        case 'image-to-pdf':
          blob = await convertImageToPdf([file]);
          filename = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
          break;

        case 'pdf-to-image':
          const images = await convertPdfToImage(file, 'jpg');
          if (images.length === 1) {
            blob = images[0];
            filename = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
          } else {
            // Create zip file for multiple images
            const zip = new JSZip();
            images.forEach((img, index) => {
              zip.file(`page-${index + 1}.jpg`, img);
            });
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            blob = zipBlob;
            filename = file.name.replace(/\.[^/.]+$/, '') + '.zip';
          }
          break;

        case 'html-to-pdf':
          blob = await convertHtmlFileToPdf(file);
          filename = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
          break;

        case 'docx-to-pdf':
          blob = await convertDocxToPdf(file);
          filename = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
          break;

        case 'ppt-to-pdf':
          // For PPT, we'll need to use server-side conversion
          setError('PPT to PDF conversion requires server-side processing. Please use the API endpoint.');
          setIsConverting(false);
          return;

        default:
          throw new Error('Unsupported conversion type');
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadFilename(filename);
      setDownloadReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const option = conversionOptions.find((opt) => opt.id === conversionType);

  return (
    <div className="card p-6" style={{ backgroundColor: 'var(--neumorphic-bg)' }}>
      <div className="space-y-4">
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
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'white',
            }}
          >
            {error}
          </div>
        )}

        {downloadReady && !error && (
          <div className="space-y-2">
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--success-color)',
                color: 'white',
              }}
            >
              Conversion complete! Ready to download.
            </div>
            <button
              onClick={handleDownload}
              className="btn w-full py-3 px-6 font-semibold"
              style={{
                backgroundColor: 'var(--success-color)',
                color: 'white',
              }}
            >
              Download {downloadFilename}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


