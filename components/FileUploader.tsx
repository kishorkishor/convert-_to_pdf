'use client';

import { useCallback, useState } from 'react';
import { getFileInfo, formatFileSize, validateFileSize } from '@/lib/utils/fileUtils';
import { NeumorphicIcon } from '@/components/NeumorphicIcon';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

export function FileUploader({ onFileSelect, acceptedTypes, maxSizeMB = 50 }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setError(null);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (!validateFileSize(file, maxSizeMB)) {
        setError(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }

      const info = getFileInfo(file);
      setFileInfo({ name: file.name, size: formatFileSize(file.size) });
      onFileSelect(file);
    },
    [onFileSelect, maxSizeMB]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);

      if (!validateFileSize(file, maxSizeMB)) {
        setError(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }

      const info = getFileInfo(file);
      setFileInfo({ name: file.name, size: formatFileSize(file.size) });
      onFileSelect(file);
    },
    [onFileSelect, maxSizeMB]
  );

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`transition-all ${
          isDragging ? 'scale-[1.02]' : ''
        }`}
        style={{
          backgroundColor: 'var(--neumorphic-bg)',
          borderRadius: 'var(--border-radius)',
          minHeight: '400px',
          padding: '3rem',
          boxShadow: isDragging
            ? 'inset 8px 8px 16px var(--neumorphic-shadow-dark), inset -8px -8px 16px var(--neumorphic-shadow-light), 0 0 0 2px var(--primary-color)'
            : 'inset 8px 8px 16px var(--neumorphic-shadow-dark), inset -8px -8px 16px var(--neumorphic-shadow-light)',
          border: isDragging ? '2px dashed var(--primary-color)' : '2px dashed transparent',
        }}
      >
        <input
          type="file"
          onChange={handleFileInput}
          accept={acceptedTypes}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center h-full min-h-[340px] gap-6"
        >
          <div 
            className="mb-4 transition-transform"
            style={{ 
              transform: isDragging ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <NeumorphicIcon icon="upload" size={120} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl md:text-3xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
              {fileInfo ? fileInfo.name : 'Drag & drop your file here'}
            </p>
            {fileInfo ? (
              <div className="space-y-1">
                <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                  Size: {fileInfo.size}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Supported formats: {acceptedTypes || 'All formats'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  or click to browse
                </p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Supported formats: {acceptedTypes || 'PDF, Images, DOCX, PPT, HTML'}
                </p>
              </div>
            )}
          </div>
        </label>
      </div>
      {error && (
        <p className="mt-4 text-base text-center font-medium" style={{ color: 'var(--accent-color)' }}>
          {error}
        </p>
      )}
    </div>
  );
}


