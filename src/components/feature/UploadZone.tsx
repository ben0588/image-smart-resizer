/**
 * UploadZone - 圖片上傳區元件
 * Feature Component - 包含業務邏輯
 */

'use client';

import React, { useRef } from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';
import type { UploadZoneProps } from '@/src/types';
import { validateImageFile } from '@/src/lib/utils';
import useAppStore from '@/src/store/use-app-store';
import { useTranslation } from '@/src/hooks/useTranslation';

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFilesToStore = useAppStore((s) => s.addFiles);

  // 處理檔案選擇（支援多檔案）
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // 驗證所有檔案
      const validFiles = files.filter((file) => {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          alert(`${file.name}: ${validation.error}`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 1) {
        onFileSelect(validFiles[0]);
      } else if (validFiles.length > 1) {
        // 多檔案直接加入 store 的批次清單
        addFilesToStore(validFiles as File[]);
      }
    }
  };

  // 處理拖放（支援多檔案）
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const validFiles = files.filter((file) => {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          alert(`${file.name}: ${validation.error}`);
          return false;
        }
        return true;
      });
      if (validFiles.length === 1) {
        onFileSelect(validFiles[0]);
      } else if (validFiles.length > 1) {
        addFilesToStore(validFiles as File[]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8" style={{height: '500px'}}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-full max-w-xl h-80 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 
                   flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                   hover:border-indigo-500 hover:bg-indigo-50/30 hover:shadow-lg group relative overflow-hidden"
      >
        {/* 裝飾背景圓 */}
        <div className="absolute w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -top-10 -right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative z-10 p-5 bg-white rounded-full shadow-sm mb-5 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
          <UploadCloud className="w-10 h-10 text-indigo-600" />
        </div>

        <h3 className="relative z-10 text-xl font-semibold text-slate-700 mb-2">
          {t.upload.dragDrop}
        </h3>
        <p className="relative z-10 text-slate-500 mb-4">
          {t.upload.or}{' '}
          <span className="text-indigo-600 font-medium border-b border-indigo-200 pb-0.5 group-hover:border-indigo-600 transition-colors">
            {t.upload.browse}
          </span>
        </p>
        <p className="relative z-10 text-xs text-slate-400 mb-4">
          {t.upload.multipleSupport}
        </p>

        <div className="relative z-10 flex gap-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <span className="bg-white px-2 py-1 rounded border border-slate-200">
            JPG
          </span>
          <span className="bg-white px-2 py-1 rounded border border-slate-200">
            PNG
          </span>
          <span className="bg-white px-2 py-1 rounded border border-slate-200">
            WebP
          </span>
        </div>
      </div>
      <p className="mt-6 text-sm text-slate-400 flex items-center gap-2">
        <Sparkles className="w-3 h-3" />
        {t.upload.localProcessing}
      </p>
    </div>
  );
}
