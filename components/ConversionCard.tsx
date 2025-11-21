'use client';

import React from 'react';
import { ConversionOption } from '@/lib/utils/validation';
import { NeumorphicIcon } from '@/components/NeumorphicIcon';

interface ConversionCardProps {
  option: ConversionOption;
  onClick: () => void;
  isSelected?: boolean;
}

export function ConversionCard({ option, onClick, isSelected }: ConversionCardProps) {
  const hoverColor = getHoverColor(option.id);
  const selectedColor = getSelectedColor(option.id);
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card p-6 cursor-pointer transition-all duration-300 ease-out"
      style={{
        backgroundColor: isSelected 
          ? selectedColor
          : isHovered 
          ? hoverColor 
          : 'var(--neumorphic-bg)',
        transform: isSelected ? 'scale(1.02) translateY(-2px)' : isHovered ? 'translateY(-1px)' : 'scale(1)',
        boxShadow: isSelected
          ? `10px 10px 20px var(--neumorphic-shadow-dark), -10px -10px 20px var(--neumorphic-shadow-light), 0 0 30px ${selectedColor}, 0 0 0 2px ${getSelectedBorderColor(option.id)}`
          : isHovered
          ? `8px 8px 16px var(--neumorphic-shadow-dark), -8px -8px 16px var(--neumorphic-shadow-light), 0 0 20px ${hoverColor}`
          : '8px 8px 16px var(--neumorphic-shadow-dark), -8px -8px 16px var(--neumorphic-shadow-light)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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

function getHoverColor(conversionType: string): string {
  // Very subtle color tints for hover effect - using lighter opacity for subtlety
  const colors: Record<string, string> = {
    'image-to-pdf': 'rgba(66, 133, 244, 0.05)',      // Light blue
    'pdf-to-image': 'rgba(156, 39, 176, 0.05)',     // Light purple
    'html-to-pdf': 'rgba(76, 175, 80, 0.05)',      // Light green
    'docx-to-pdf': 'rgba(255, 152, 0, 0.05)',      // Light orange
    'ppt-to-pdf': 'rgba(233, 30, 99, 0.05)',       // Light pink
    'pdf-to-docx': 'rgba(0, 188, 212, 0.05)',      // Light cyan
  };
  
  return colors[conversionType] || 'rgba(158, 158, 158, 0.05)';
}

function getSelectedColor(conversionType: string): string {
  // More intense color for selected state
  const colors: Record<string, string> = {
    'image-to-pdf': 'rgba(66, 133, 244, 0.15)',      // Blue
    'pdf-to-image': 'rgba(156, 39, 176, 0.15)',     // Purple
    'html-to-pdf': 'rgba(76, 175, 80, 0.15)',      // Green
    'docx-to-pdf': 'rgba(255, 152, 0, 0.15)',      // Orange
    'ppt-to-pdf': 'rgba(233, 30, 99, 0.15)',       // Pink
    'pdf-to-docx': 'rgba(0, 188, 212, 0.15)',      // Cyan
  };
  
  return colors[conversionType] || 'rgba(66, 133, 244, 0.15)';
}

function getSelectedBorderColor(conversionType: string): string {
  // Border color matching the card's theme
  const colors: Record<string, string> = {
    'image-to-pdf': 'rgba(66, 133, 244, 0.6)',      // Blue
    'pdf-to-image': 'rgba(156, 39, 176, 0.6)',     // Purple
    'html-to-pdf': 'rgba(76, 175, 80, 0.6)',      // Green
    'docx-to-pdf': 'rgba(255, 152, 0, 0.6)',      // Orange
    'ppt-to-pdf': 'rgba(233, 30, 99, 0.6)',       // Pink
    'pdf-to-docx': 'rgba(0, 188, 212, 0.6)',      // Cyan
  };
  
  return colors[conversionType] || 'rgba(66, 133, 244, 0.6)';
}


