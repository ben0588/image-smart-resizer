/**
 * ControlPanel - 控制面板元件
 * Feature Component - 包含所有調整控制項
 * 符合規格定義的使用者故事
 */

'use client';

import React from 'react';
import {
  ImageIcon,
  RotateCcw,
  Download,
  Link as LinkIcon,
  Unlock,
  Loader2,
  Clock,
  X,
} from 'lucide-react';
import type { ControlPanelProps, ImageFormat } from '@/src/types';
import { formatToShortName } from '@/src/lib/utils';
import { useResizeHistory } from '@/src/hooks/useLocalStorage';
import { useTranslation } from '@/src/hooks/useTranslation';

export default function   ControlPanel({
  config,
  isProcessing,
  error,
  onConfigChange,
  onReset,
  onDownload,
}: ControlPanelProps) {
  const { t } = useTranslation();
  const { history, addHistory, removeHistory } = useResizeHistory();

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
                value={config.width}
                onChange={(e) => onConfigChange({ width: Number(e.target.value) })}
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
                value={config.height}
                onChange={(e) => onConfigChange({ height: Number(e.target.value) })}
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
            {history.slice(0, 3).map((item) => (
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
      </div>

      {/* 行動按鈕 */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={handleDownload}
          disabled={isProcessing}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.controls.processing}
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              {t.controls.download}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
