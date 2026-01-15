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
} from 'lucide-react';
import type { ControlPanelProps, ImageFormat } from '@/src/types';
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

  // 計算壓縮減少百分比
  const originalSize = currentFile?.size || 0;
  const reduction = estimatedSize && originalSize 
    ? Math.round((1 - estimatedSize / originalSize) * 100)
    : null;

  // 計算批次模式下的總預估大小
  const batchTotalEstimatedSize = isBatchMode
    ? batchFiles.reduce((sum, f) => sum + (f.estimatedSize || 0), 0)
    : 0;
  const allBatchFilesEstimated = isBatchMode && batchFiles.length > 0 
    && batchFiles.every((f) => f.estimatedSize !== undefined && !f.isEstimating);
  const anyBatchFileEstimating = isBatchMode && batchFiles.some((f) => f.isEstimating);

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-600" />
          {t.controls.dimensions}
        </h2>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> {t.controls.reset}
        </button>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* 尺寸控制 */}
      <div className="space-y-4 mb-8">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {t.controls.dimensions}
        </label>
        <div className="flex items-end gap-3">
          {/* Width Input */}
          <div className="flex-1 group">
            <span className="text-xs text-slate-400 mb-1 block group-focus-within:text-indigo-600 transition-colors">
              {t.controls.width}
            </span>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={config.width || ''}
                onChange={(e) => onConfigChange({ width: e.target.value === '' ? 0 : Number(e.target.value) })}
                onFocus={(e) => e.target.select()}
                className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 tabular-nums focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                px
              </span>
            </div>
          </div>

          {/* Lock Button */}
          <button
            onClick={() => onConfigChange({ maintainAspectRatio: !config.maintainAspectRatio })}
            className={`mb-1 p-2 rounded-lg transition-all cursor-pointer ${
              config.maintainAspectRatio
                ? 'bg-indigo-50 text-indigo-600'
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
            title={t.controls.toggleAspectRatio}
          >
            {config.maintainAspectRatio ? (
              <LinkIcon className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
          </button>

          {/* Height Input */}
          <div className="flex-1 group">
            <span className="text-xs text-slate-400 mb-1 block group-focus-within:text-indigo-600 transition-colors">
              {t.controls.height}
            </span>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={config.height || ''}
                onChange={(e) => onConfigChange({ height: e.target.value === '' ? 0 : Number(e.target.value) })}
                onFocus={(e) => e.target.select()}
                className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 tabular-nums focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                px
              </span>
            </div>
          </div>
        </div>

        {/* History Tags */}
        {history.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 py-1 uppercase">
              <Clock className="w-3 h-3" /> {t.controls.history}:
            </span>
            {history.slice(0, 9).map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
              >
                <button
                  onClick={() => onConfigChange({ width: item.width, height: item.height })}
                  className="tabular-nums font-mono hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {item.width}×{item.height}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeHistory(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
                  title={t.controls.deleteHistory}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-slate-100 mb-8" />

      {/* 格式與品質 */}
      <div className="space-y-6 flex-1">
        {/* Format Selector */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
            {t.controls.format}
          </label>
          <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-lg gap-1">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => onConfigChange({ format: fmt })}
                className={`py-2 text-sm font-medium rounded-md transition-all shadow-sm cursor-pointer ${
                  config.format === fmt
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 shadow-none'
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

        {/* 預估大小顯示 - 僅單檔案模式 */}
        {currentFile && !isBatchMode && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm ring-1 ring-slate-200/50 h-26 flex flex-col justify-between transition-all">
            
            {/* --- Header --- */}
            <div className="flex items-center justify-between h-6">
              <div className="flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.controls.estimatedSize}
                </span>
              </div>

              {/* Badge */}
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

            {/* --- Content: 數值顯示區 vs 骨架屏 --- */}
            <div className="flex items-end justify-between">
              {isEstimating ? (
                /* Loading 狀態：顯示純淨的骨架屏，模擬數字與文字的位置 */
                <div className="w-full space-y-2 animate-pulse ">
                  <div className="h-7 bg-slate-200 rounded-md w-24"></div>
                  <div className="h-3 bg-slate-100 rounded-md w-32"></div>
                </div>
              ) : estimatedSize !== null ? (
                /* 正常顯示狀態 */
                <div className="flex flex-col">
                  <span className={`text-3xl font-bold leading-none tracking-tight tabular-nums ${reduction !== null && reduction <= 0 ? 'text-orange-600' : 'text-slate-800'}`}>
                    {formatFileSize(estimatedSize)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium mt-1.5 tabular-nums">
                    {t.batch.originalSize}: <span className="line-through opacity-70">{formatFileSize(originalSize)}</span>
                  </span>
                </div>
              ) : (
                /* 初始無數值狀態 */
                <span className="text-slate-300 font-medium text-xl">—</span>
              )}
            </div>
          </div>
        )}

        {/* 批次模式：試算所有大小按鈕 */}
        {isBatchMode && (
          <button
            onClick={handleCalculateAllSizes}
            disabled={anyBatchFileEstimating}
            className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {anyBatchFileEstimating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.controls.calculating}
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>{t.controls.calculateAllSizes}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 行動按鈕 */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={handleDownload}
          disabled={isProcessing || !config.width || !config.height}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.controls.processing}
            </>
          ) : isBatchMode ? (
            <>
              <Download className="w-5 h-5" />
              {allBatchFilesEstimated && batchTotalEstimatedSize > 0 ? (
                <>
                  {t.controls.downloadBatch}
                  <span className="text-indigo-200 text-sm">
                    ({t.controls.approxTotal} {formatFileSize(batchTotalEstimatedSize)})
                  </span>
                </>
              ) : (
                t.controls.downloadAndCompress
              )}
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              {t.controls.downloadSingle}
              {estimatedSize !== null && (
                <span className="text-indigo-200 text-sm">
                  ({formatFileSize(estimatedSize)})
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
