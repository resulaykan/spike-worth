'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, X, Loader2, Check, Clipboard } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Envanter Fotoğrafı' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const uploadFile = useCallback(async (file: File | Blob) => {
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WebP).');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();

      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Yükleme başarısız oldu.');
      }

      onChange(json.url);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Görsel yüklenemedi.');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  // Clipboard Paste (Ctrl + V) Handler
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          e.preventDefault();
          uploadFile(blob);
          break;
        }
      }
    }
  }, [uploadFile]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-white/70">{label}</label>
        <span className="text-[10px] font-mono text-cyan-400 font-medium flex items-center gap-1">
          <Clipboard className="w-3 h-3" />
          Ctrl + V ile Yapıştır
        </span>
      </div>

      {value ? (
        // Preview State
        <div className="relative group border border-white/20 bg-[#090e17] p-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-16 h-16 bg-black/60 p-1 shrink-0 flex items-center justify-center border border-white/10 overflow-hidden">
              <img src={value} alt="Envanter" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">Görsel Yüklendi</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Hazır
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded transition-colors text-xs font-bold flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Kaldır</span>
          </button>
        </div>
      ) : (
        // Dropzone & Paste Area
        <div
          ref={dropzoneRef}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragOver 
              ? 'border-red-500 bg-red-500/10' 
              : 'border-white/15 bg-[#090e17] hover:border-white/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
          />

          {uploading ? (
            <div className="py-2 flex flex-col items-center justify-center space-y-1">
              <Loader2 className="w-6 h-6 animate-spin text-red-500" />
              <span className="text-xs font-mono text-white/70">Fotoğraf sunucuya yükleniyor...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                <UploadCloud className="w-5 h-5 text-red-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">
                  Fotoğraf Seç veya Buraya Sürükle
                </p>
                <p className="text-[10px] text-white/40">
                  veya Valorant ekran görüntüsünü doğrudan <strong className="text-cyan-400">Ctrl + V</strong> ile yapıştırın
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}
