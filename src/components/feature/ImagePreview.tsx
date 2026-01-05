/**
 * ImagePreview - 圖片預覽元件
 * Feature Component - 顯示圖片預覽與資訊
 * 符合規格定義
 */

'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import type { ImagePreviewProps } from '@/src/types';
import { formatFileSize } from '@/src/lib/utils';
import { useTranslation } from '@/src/hooks/useTranslation';

export default function ImagePreview({
  src,
  originalDimensions,
  fileSize,
  isProcessing,
}: ImagePreviewProps) {
  const { t } = useTranslation();
  return (
    <div className="lg:col-span-8 bg-slate-100/50 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 relative overflow-hidden">
      {/* 棋盤格背景 (模擬透明) */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 shadow-2xl shadow-slate-300/50 rounded-lg overflow-hidden max-w-full max-h-full">
        {/* 處理中遮罩 */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="text-white flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">{t.controls.processing}</span>
            </div>
          </div>
        )}

        {/* 圖片資訊標籤 */}
        {originalDimensions && (
          <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10 font-mono tabular-nums">
            {originalDimensions.width} × {originalDimensions.height}
            {fileSize && ` • ${formatFileSize(fileSize)}`}
          </div>
        )}

        {/* 圖片 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Preview"
          className="max-w-full object-contain block"
          style={{maxHeight: '500px'}}
        />
      </div>
    </div>
  );
}
