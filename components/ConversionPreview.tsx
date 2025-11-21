'use client';

import { useRef } from 'react';
import {
  PreviewState,
  ImagePreviewItem,
} from '@/lib/types/conversion';

interface ConversionPreviewProps {
  data: PreviewState;
  onImagesChange?: (items: ImagePreviewItem[]) => void;
  onHtmlChange?: (html: string) => void;
  onTextChange?: (text: string) => void;
}

export function ConversionPreview({
  data,
  onImagesChange,
  onHtmlChange,
  onTextChange,
}: ConversionPreviewProps) {
  if (data.kind === 'image-sequence') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
            Preview & Reorder Pages
          </h4>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Drag buttons to reorder or remove pages
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.images.map((img, index) => (
            <div key={img.id} className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div className="relative rounded-2xl overflow-hidden mb-3" style={{ boxShadow: 'inset 4px 4px 8px var(--neumorphic-shadow-dark), inset -4px -4px 8px var(--neumorphic-shadow-light)' }}>
                <img src={img.src} alt={img.name} className="w-full h-48 object-contain bg-black/20" />
                <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}>
                  {img.name}
                </span>
              </div>
              <div className="flex gap-2 justify-between">
                <button
                  className="flex-1 btn text-sm py-2"
                  onClick={() => moveImage(data.images, index, -1, onImagesChange)}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  className="flex-1 btn text-sm py-2"
                  onClick={() => moveImage(data.images, index, 1, onImagesChange)}
                  disabled={index === data.images.length - 1}
                >
                  ↓
                </button>
                <button
                  className="flex-1 btn text-sm py-2"
                  style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                  onClick={() => removeImage(data.images, index, onImagesChange)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.kind === 'html') {
    return <HtmlEditor html={data.html} onChange={onHtmlChange} />;
  }

  if (data.kind === 'text') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Edit content before download
        </label>
        <textarea
          className="w-full h-48 rounded-2xl p-4"
          style={{
            backgroundColor: 'var(--neumorphic-bg)',
            color: 'var(--text-color)',
            boxShadow: 'inset 6px 6px 12px var(--neumorphic-shadow-dark), inset -6px -6px 12px var(--neumorphic-shadow-light)',
            border: 'none',
          }}
          value={data.text}
          onChange={(e) => onTextChange?.(e.target.value)}
        />
      </div>
    );
  }

  return null;
}

function moveImage(
  items: ImagePreviewItem[],
  index: number,
  direction: 1 | -1,
  cb?: (items: ImagePreviewItem[]) => void
) {
  if (!cb) return;
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= items.length) return;
  const updated = [...items];
  const [removed] = updated.splice(index, 1);
  updated.splice(newIndex, 0, removed);
  cb(updated);
}

function removeImage(
  items: ImagePreviewItem[],
  index: number,
  cb?: (items: ImagePreviewItem[]) => void
) {
  if (!cb) return;
  const updated = items.filter((_, idx) => idx !== index);
  cb(updated);
}

function HtmlEditor({
  html,
  onChange,
}: {
  html: string;
  onChange?: (html: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleCommand = (command: string) => {
    document.execCommand(command);
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {['bold', 'italic', 'underline'].map((cmd) => (
          <button
            key={cmd}
            className="btn px-3 py-1 text-sm"
            onClick={(e) => {
              e.preventDefault();
              handleCommand(cmd);
            }}
          >
            {cmd.charAt(0).toUpperCase() + cmd.slice(1)}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="rounded-2xl p-4 min-h-[200px]"
        contentEditable
        suppressContentEditableWarning
        style={{
          backgroundColor: 'var(--neumorphic-bg)',
          color: 'var(--text-color)',
          boxShadow: 'inset 6px 6px 12px var(--neumorphic-shadow-dark), inset -6px -6px 12px var(--neumorphic-shadow-light)',
          border: 'none',
        }}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

