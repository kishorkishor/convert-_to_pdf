'use client';

import { ConversionOption } from '@/lib/utils/validation';
import { NeumorphicIcon } from '@/components/NeumorphicIcon';

interface ConversionCardProps {
  option: ConversionOption;
  onClick: () => void;
  isSelected?: boolean;
}

export function ConversionCard({ option, onClick, isSelected }: ConversionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[var(--primary-color)]' : ''
      }`}
      style={{
        backgroundColor: 'var(--neumorphic-bg)',
        boxShadow: isSelected
          ? '8px 8px 16px var(--neumorphic-shadow-dark), -8px -8px 16px var(--neumorphic-shadow-light), 0 0 0 2px var(--primary-color)'
          : '8px 8px 16px var(--neumorphic-shadow-dark), -8px -8px 16px var(--neumorphic-shadow-light)',
      }}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="mb-2">
          <NeumorphicIcon icon={getIconType(option.id)} size={64} />
        </div>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
          {option.label}
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {option.description}
        </p>
        <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          {option.from.join(', ').toUpperCase()} → {option.to.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function getIconType(conversionType: string): 'image' | 'pdf' | 'pdf-to-image' | 'html' | 'docx' | 'ppt' | 'convert' {
  const iconMap: Record<string, 'image' | 'pdf' | 'pdf-to-image' | 'html' | 'docx' | 'ppt' | 'convert'> = {
    'image-to-pdf': 'image',
    'pdf-to-image': 'pdf-to-image',
    'html-to-pdf': 'html',
    'docx-to-pdf': 'docx',
    'ppt-to-pdf': 'ppt',
    'pdf-to-docx': 'pdf',
  };
  return iconMap[conversionType] || 'convert';
}


