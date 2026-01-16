/**
 * ImagePreview - 圖片預覽元件
 * Feature Component - 顯示圖片預覽與資訊
 * 符合規格定義
 */

'use client';

import React, { useState } from 'react';
import { Loader2, Scissors } from 'lucide-react';
import type { ImagePreviewProps, CropData } from '@/src/types';
import { formatFileSize } from '@/src/lib/utils';
import { useTranslation } from '@/src/hooks/useTranslation';
import useAppStore from '@/src/store/use-app-store';
import { CropModal } from '@/src/components/ui/CropModal';

export default function ImagePreview({
  src,
  originalSrc,
  originalDimensions,
  fileSize,
  isProcessing,
}: ImagePreviewProps) {
  const { t } = useTranslation();
  const [showCropModal, setShowCropModal] = useState(false);
  
  // 從 store 取得 fitMode 與設定
  const config = useAppStore((s) => s.config);
  const isBatchMode = useAppStore((s) => s.isBatchMode);
  const batchFiles = useAppStore((s) => s.batchFiles);
  const selectedFileId = useAppStore((s) => s.selectedFileId);
  const setCropForFile = useAppStore((s) => s.setCropForFile);
  const cropData = useAppStore((s) => s.cropData);
  const setCustomCrop = useAppStore((s) => s.setCustomCrop);
  
  // 取得當前選中的檔案（用於批次模式的裁切調整）
  const selectedFile = selectedFileId
    ? batchFiles.find((f) => f.id === selectedFileId)
    : null;

  // 處理裁切確認 - 接收完整的 CropData
  const handleCropConfirm = (newCropData: CropData) => {
    if (isBatchMode && selectedFileId) {
      // 批次模式：儲存到對應檔案
      setCropForFile(selectedFileId, newCropData);
    } else {
      // 單張模式：儲存到全域 cropData
      setCustomCrop(newCropData);
    }
    setShowCropModal(false);
  };

  // 是否顯示裁切按鈕（僅 Cover 模式下顯示）
  const showCropButton = config.fitMode === 'cover' && src;
  
  // 判斷是否已手動裁切（單張模式看 cropData，批次模式看 selectedFile.cropData）
  const hasCropData = isBatchMode 
    ? selectedFile?.cropData !== undefined 
    : cropData !== null;

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

        {/* 調整裁切按鈕 - 兩種狀態 */}
        {showCropButton && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
            {/* 主按鈕 */}
            <button
              onClick={() => setShowCropModal(true)}
              className={`
                text-xs px-3 py-1.5 rounded backdrop-blur-sm flex items-center gap-1.5 transition-all shadow-lg cursor-pointer
                ${hasCropData 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30' 
                  : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-sm'
                }
              `}
              title={hasCropData ? t.controls.cropModified : t.controls.aspectCrop}
            >
              <Scissors className={`w-3.5 h-3.5 ${hasCropData ? 'fill-white/30' : ''}`} />
              <span>{hasCropData ? t.controls.cropModified : t.controls.aspectCrop}</span>
            </button>
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

      {/* 裁切彈窗 */}
      {showCropModal && originalSrc && (
        <CropModal
          imageUrl={originalSrc}
          targetWidth={config.width}
          targetHeight={config.height}
          initialCropData={isBatchMode ? selectedFile?.cropData : (cropData ?? undefined)}
          onConfirm={handleCropConfirm}
          onCancel={() => setShowCropModal(false)}
        />
      )}
    </div>
  );
}
