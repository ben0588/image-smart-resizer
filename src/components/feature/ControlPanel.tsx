/**
 * ControlPanel - 控制面板元件
 * Feature Component - 包含所有調整控制項
 * 符合規格定義的使用者故事
 */

'use client';

import React, { useEffect } from 'react';
import {
  ImageIcon,
  RotateCcw,
  Download,
  Link as LinkIcon,
  Unlock,
  Loader2,
  Clock,
  X,
  RefreshCw,
  Weight,
  TrendingDown,
  AlertCircle,
  Scan,
  Minimize2,
  StretchHorizontal,
  Image as ImageLucide,
  RectangleHorizontal,
  Square,
  RectangleVertical,
  Package,
  Sparkles,
} from 'lucide-react';
import type { ControlPanelProps, ImageFormat, FitMode } from '@/src/types';
import { formatToShortName, formatFileSize } from '@/src/lib/utils';
import { useResizeHistory } from '@/src/hooks/useLocalStorage';
import { useTranslation } from '@/src/hooks/useTranslation';
import { useDebounce } from '@/src/hooks/useDebounce';
import useAppStore from '@/src/store/use-app-store';

export default function ControlPanel({
  config,
  isProcessing,
  error,
  onConfigChange,
  onReset,
  onDownload,
}: ControlPanelProps) {
  const { t } = useTranslation();
  const { history, addHistory, removeHistory } = useResizeHistory();

  // 從 store 取得預估大小相關狀態
  const sourceFile = useAppStore((s) => s.sourceFile);
  const isBatchMode = useAppStore((s) => s.isBatchMode);
  const batchFiles = useAppStore((s) => s.batchFiles);
  const selectedFileId = useAppStore((s) => s.selectedFileId);
  const estimatedSize = useAppStore((s) => s.estimatedSize);
  const isEstimating = useAppStore((s) => s.isEstimating);
  const estimateSizeAction = useAppStore((s) => s.estimateSize);
  const estimateAllSizesAction = useAppStore((s) => s.estimateAllSizes);
  const originalDimensions = useAppStore((s) => s.originalDimensions);

  // 決定目前操作的檔案
  const currentFile = isBatchMode
    ? batchFiles.find((f) => f.id === selectedFileId)?.file || batchFiles[0]?.file
    : sourceFile;

  // 使用 debounce 監聽品質變化，延遲 400ms 後計算預估大小（僅單檔案模式）
  const debouncedQuality = useDebounce(config.quality, 400);
  const debouncedWidth = useDebounce(config.width, 400);
  const debouncedHeight = useDebounce(config.height, 400);
  const debouncedFormat = useDebounce(config.format, 400);

  // 當設定變化時，自動計算預估大小（僅單檔案模式）
  useEffect(() => {
    if (currentFile && !isBatchMode) {
      estimateSizeAction();
    }
  }, [debouncedQuality, debouncedWidth, debouncedHeight, debouncedFormat, currentFile, selectedFileId, isBatchMode, estimateSizeAction]);

  // 計算壓縮減少百分比 (限制在 -99% 到 99% 之間)
  const originalSize = currentFile?.size || 0;
  const reduction = estimatedSize && originalSize 
    ? Math.min(99, Math.max(-99, Math.round((1 - estimatedSize / originalSize) * 100)))
    : null;

  // 計算批次模式下的總預估大小
  const batchTotalEstimatedSize = isBatchMode
    ? batchFiles.reduce((sum, f) => sum + (f.estimatedSize || 0), 0)
    : 0;
  const allBatchFilesEstimated = isBatchMode && batchFiles.length > 0 
    && batchFiles.every((f) => f.estimatedSize !== undefined && !f.isEstimating);
  const anyBatchFileEstimating = isBatchMode && batchFiles.some((f) => f.isEstimating);

  const fitModeOptions = [
    { id: 'cover', label: t.controls.fitCover, icon: Scan },
    { id: 'contain', label: t.controls.fitContain, icon: Minimize2 },
    { id: 'fill', label: t.controls.fitFill, icon: StretchHorizontal },
  ];
  // Helper: 檢查目前尺寸是否符合特定比例 (容許 1px 誤差)
  const isAspectRatioActive = (targetRatio: number) => {
    if (!config.width || !config.height) return false;
    const current = config.width / config.height;
    return Math.abs(current - targetRatio) < 0.02;
  };
  const formats: ImageFormat[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/x-icon',
  ];

  // 處理下載並記錄歷史
  const handleDownload = () => {
    addHistory(config.width, config.height);
    onDownload();
  };

  // 處理試算所有大小
  const handleCalculateAllSizes = () => {
    estimateAllSizesAction();
  };

  return (
 <div className="lg:col-span-4 bg-white p-6 lg:p-8 flex flex-col h-full">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-600" />
          {t.controls.dimensions}
        </h2>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> {t.controls.reset}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* --- 主要控制區塊 --- */}
      <div className="space-y-8 mb-8">
        
        {/* 尺寸與比例 (Dimensions & Aspect Ratio) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
             {t.controls.dimensions}
          </label>
          
          {/* 輸入框 */}
     {/* 輸入框區塊 */}
<div className="flex items-center gap-2">
  
  {/* Width Input */}
  <div className="flex-1 relative group">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 select-none group-focus-within:text-indigo-500 transition-colors">
      W
    </span>
    <input
      type="number"
      min="1"
      value={config.width || ''}
      onChange={(e) => onConfigChange({ width: Number(e.target.value) })}
      className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none select-none">
      px
    </span>
  </div>

  {/* Lock Button */}
  <button
    onClick={() => onConfigChange({ maintainAspectRatio: !config.maintainAspectRatio })}
    className={`p-2 rounded-lg transition-all shrink-0 cursor-pointer ${
      config.maintainAspectRatio
        ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200'
        : 'text-slate-400 hover:bg-slate-100'
    }`}
    title={t.controls.toggleAspectRatio}
  >
    {config.maintainAspectRatio ? <LinkIcon className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
  </button>

  {/* Height Input */}
  <div className="flex-1 relative group">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 select-none group-focus-within:text-indigo-500 transition-colors">
      H
    </span>
    <input
      type="number"
      min="1"
      value={config.height || ''}
      onChange={(e) => onConfigChange({ height: Number(e.target.value) })}
      className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none select-none">
      px
    </span>
  </div>
</div>

          {/* 比例快速選擇 (Pills) */}
          <div className="flex flex-wrap gap-2">
             {/* 原始比例按鈕 */}
            <button
              onClick={() => {
                // 情境 A：單張圖片 - 恢復到原始尺寸
                // 情境 B：批次圖片 - 使用第一張圖片的尺寸
                let targetWidth: number;
                let targetHeight: number;
                let targetAspectRatio: number;

                if (isBatchMode) {
                  // 批次模式：使用第一張圖片的尺寸
                  const firstFile = batchFiles[0];
                  if (firstFile?.originalDimensions) {
                    targetWidth = firstFile.originalDimensions.width;
                    targetHeight = firstFile.originalDimensions.height;
                    targetAspectRatio = targetWidth / targetHeight;
                  } else {
                    // 沒有尺寸資訊，不做任何事
                    return;
                  }
                } else {
                  // 單張模式：恢復到原始尺寸
                  if (originalDimensions) {
                    targetWidth = originalDimensions.width;
                    targetHeight = originalDimensions.height;
                    targetAspectRatio = targetWidth / targetHeight;
                  } else {
                    // 沒有原始尺寸資訊，不做任何事
                    return;
                  }
                }

                onConfigChange({ 
                  width: targetWidth, 
                  height: targetHeight, 
                  maintainAspectRatio: true, 
                  aspectRatio: targetAspectRatio,
                  fitMode: 'cover', // 恢復預設縮放模式
                });
              }}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                 // 檢查是否為原始尺寸
                 (() => {
                   const targetDimensions = isBatchMode 
                     ? batchFiles[0]?.originalDimensions 
                     : originalDimensions;
                   if (!targetDimensions) return false;
                   return config.width === targetDimensions.width && config.height === targetDimensions.height;
                 })()
                 ? 'bg-indigo-600 text-white border-indigo-600' 
                 : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <ImageLucide className="w-3 h-3" />
              <span>{t.controls.aspectOriginal}</span>
            </button>
            
            {[
              { label: '16:9', ratio: 16/9, icon: RectangleHorizontal },
              { label: '4:3', ratio: 4/3, icon: RectangleHorizontal },
              { label: '1:1', ratio: 1, icon: Square },
              { label: '9:16', ratio: 9/16, icon: RectangleVertical },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                   const newHeight = Math.round(config.width / item.ratio);
                   onConfigChange({ height: newHeight, maintainAspectRatio: true, aspectRatio: item.ratio, fitMode: 'cover' }); // 切換比例時自動 cover
                }}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  isAspectRatioActive(item.ratio)
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <item.icon className="w-3 h-3 opacity-70" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 縮放模式 (Fit Mode) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.controls.fitMode}
          </label>
          <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-lg gap-1">
            {fitModeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = config.fitMode === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onConfigChange({ fitMode: option.id as FitMode })}
                  className={`
                    flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-2' : ''}`} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 歷史紀錄 */}
        {history.length > 0 && (
          <div className="space-y-2">
             <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Clock className="w-3 h-3" /> {t.controls.history}
             </div>
             <div className="flex flex-wrap gap-2">
                {history.slice(0, 6).map((item) => (
                  <div key={item.id} className="group flex items-center gap-1 text-xs px-2 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-md hover:border-indigo-200 hover:text-indigo-600 transition-all">
                    <button
                      onClick={() => onConfigChange({ width: item.width, height: item.height })}
                      className="tabular-nums font-mono"
                    >
                      {item.width}×{item.height}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeHistory(item.id); }}
                      className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        )}

      </div>
      
      <hr className="border-slate-100 mb-8" />

      {/* 格式與品質 (Format & Quality) */}
      <div className="space-y-6 flex-1">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.controls.format}
          </label>
          <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-lg gap-1">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => onConfigChange({ format: fmt })}
                className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  config.format === fmt
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {formatToShortName(fmt)}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider */}
        <div>
           <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.controls.quality}
            </label>
            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded tabular-nums">
              {Math.round(config.quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={config.quality}
            onChange={(e) => onConfigChange({ quality: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between mt-1 text-[10px] text-slate-400">
            <span>{t.controls.smallerFile}</span>
            <span>{t.controls.bestQuality}</span>
          </div>
        </div>

        {/* 預估大小顯示區塊 (使用我們之前優化過的固定高度版本) */}
        {currentFile && !isBatchMode && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm ring-1 ring-slate-200/50 h-26 flex flex-col justify-between transition-all">
             {/* ... 這裡放我們之前優化過的預估大小 UI ... */}
             <div className="flex items-center justify-between h-6">
                <div className="flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t.controls.estimatedSize}
                  </span>
                </div>
                {!isEstimating && estimatedSize !== null && reduction !== null && (
                  reduction > 0 ? (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <TrendingDown className="w-3 h-3" />
                      <span>SAVE {reduction}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                      <AlertCircle className="w-3 h-3" />
                      <span>+{Math.abs(reduction)}%</span>
                    </div>
                  )
                )}
             </div>
             <div className="flex items-end justify-between w-full">
                {isEstimating ? (
                   <div className="w-full space-y-2 animate-pulse">
                      <div className="h-7 bg-slate-200 rounded-md w-24"></div>
                      <div className="h-3 bg-slate-100 rounded-md w-32"></div>
                   </div>
                ) : estimatedSize !== null ? (
                   <div className="flex flex-col">
                      <span className={`text-3xl font-bold leading-none tracking-tight tabular-nums ${reduction !== null && reduction <= 0 ? 'text-orange-600' : 'text-slate-800'}`}>
                         {formatFileSize(estimatedSize)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium mt-1.5 tabular-nums">
                         {t.batch.originalSize}: <span className="line-through opacity-70">{formatFileSize(originalSize)}</span>
                      </span>
                   </div>
                ) : (
                   <span className="text-slate-300 font-medium text-xl">—</span>
                )}
             </div>
          </div>
        )}
        
        {/* 批次試算按鈕 (保持不變) */}
        {isBatchMode && (
          <button
            onClick={handleCalculateAllSizes}
            disabled={anyBatchFileEstimating}
            className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
             {anyBatchFileEstimating ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{t.controls.calculating}</>
             ) : (
                <><RefreshCw className="w-4 h-4" />{t.controls.calculateAllSizes}</>
             )}
          </button>
        )}
      </div>

      {/* Action Buttons (保持不變) */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={handleDownload}
          disabled={isProcessing || !config.width || !config.height}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
             <><Loader2 className="w-5 h-5 animate-spin" />{t.controls.processing}</>
          ) : isBatchMode ? (
             allBatchFilesEstimated && batchTotalEstimatedSize > 0 ? (
               <><Package className="w-5 h-5" />{t.controls.downloadBatch} <span className="text-indigo-200 text-sm">({formatFileSize(batchTotalEstimatedSize)})</span></>
             ) : (
               <><Sparkles className="w-5 h-5 text-indigo-200" />{t.controls.downloadAndCompress}</>
             )
          ) : (
             <><Download className="w-5 h-5" />{t.controls.downloadSingle} {estimatedSize !== null && <span className="text-indigo-200 text-sm">({formatFileSize(estimatedSize)})</span>}</>
          )}
        </button>
      </div>
    </div>
  );
}
