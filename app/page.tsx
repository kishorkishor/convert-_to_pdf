'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { Converter } from '@/components/Converter';
import { ConversionCard } from '@/components/ConversionCard';
import { conversionOptions, ConversionType } from '@/lib/utils/validation';
import { getConversionOptionsForFile } from '@/lib/utils/validation';
import { formatFileSize } from '@/lib/utils/fileUtils';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedConversion, setSelectedConversion] = useState<ConversionType | null>(null);
  const [availableConversions, setAvailableConversions] = useState(conversionOptions);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const options = getConversionOptionsForFile(file);
    setAvailableConversions(options);
    // Always auto-select the first available conversion for the new file type
    if (options.length > 0) {
      setSelectedConversion(options[0].id);
    } else {
      setSelectedConversion(null);
    }
  };

  const handleConversionSelect = (conversionType: ConversionType) => {
    setSelectedConversion(conversionType);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedConversion(null);
    setAvailableConversions(conversionOptions);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Smaller */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
            KKT FILE CONVERTER
          </h1>
        </div>

        {/* File Upload Section - THE MAIN GREETING */}
        <div className="mb-8">
          {!selectedFile ? (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-color)' }}>
                Upload Files
              </h2>
              <FileUploader
                onFileSelect={handleFileSelect}
                maxSizeMB={50}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="card p-6" style={{ backgroundColor: 'var(--neumorphic-bg)' }}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color)' }}>
                      Selected File
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="text-base font-medium" style={{ color: 'var(--text-color)' }}>
                          {selectedFile.name}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="btn px-4 py-2 text-sm"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                  >
                    Remove
                  </button>
                </div>

                {availableConversions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Available conversions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableConversions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleConversionSelect(option.id)}
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            selectedConversion === option.id
                              ? 'ring-2 ring-[var(--primary-color)]'
                              : ''
                          }`}
                          style={{
                            backgroundColor:
                              selectedConversion === option.id
                                ? 'var(--primary-color)'
                                : 'var(--neumorphic-bg)',
                            color:
                              selectedConversion === option.id
                                ? 'white'
                                : 'var(--text-color)',
                            boxShadow:
                              selectedConversion === option.id
                                ? 'none'
                                : 'inset 4px 4px 8px var(--neumorphic-shadow-dark), inset -4px -4px 8px var(--neumorphic-shadow-light)',
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedConversion && (
                  <Converter file={selectedFile} conversionType={selectedConversion} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Conversion Cards Grid - Below Upload Area */}
        {!selectedFile && (
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: 'var(--text-color)' }}>
              Supported Conversions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversionOptions.map((option) => (
                <ConversionCard
                  key={option.id}
                  option={option}
                  onClick={() => handleConversionSelect(option.id)}
                  isSelected={selectedConversion === option.id}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


