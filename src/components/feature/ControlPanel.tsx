/**
 * ControlPanel - 控制面板元件
 * Feature Component - 包含所有調整控制項
 * 符合規格定義的使用者故事
 */

"use client";

import React, { useEffect, useRef } from "react";
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
  Trash2,
  Plus,
} from "lucide-react";
import type {
  ControlPanelProps,
  ImageFormat,
  FitMode,
  WatermarkPosition,
} from "@/src/types";
import { formatToShortName, formatFileSize } from "@/src/lib/utils";
import { useResizeHistory } from "@/src/hooks/useLocalStorage";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useDebounce } from "@/src/hooks/useDebounce";
import useAppStore from "@/src/store/use-app-store";

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

  // 浮水印相關
  const watermark = useAppStore((s) => s.watermark);
  const setWatermarkFile = useAppStore((s) => s.setWatermarkFile);
  const removeWatermark = useAppStore((s) => s.removeWatermark);
  const updateWatermarkConfig = useAppStore((s) => s.updateWatermarkConfig);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  // 決定目前操作的檔案
  const currentFile = isBatchMode
    ? batchFiles.find((f) => f.id === selectedFileId)?.file ||
      batchFiles[0]?.file
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
  }, [
    debouncedQuality,
    debouncedWidth,
    debouncedHeight,
    debouncedFormat,
    currentFile,
    selectedFileId,
    isBatchMode,
    estimateSizeAction,
  ]);

  // 計算壓縮減少百分比 (限制在 -99% 到 99% 之間)
  const originalSize = currentFile?.size || 0;
  const reduction =
    estimatedSize && originalSize
      ? Math.min(
          99,
          Math.max(-99, Math.round((1 - estimatedSize / originalSize) * 100)),
        )
      : null;

  // 計算批次模式下的總預估大小
  const batchTotalEstimatedSize = isBatchMode
    ? batchFiles.reduce((sum, f) => sum + (f.estimatedSize || 0), 0)
    : 0;
  const allBatchFilesEstimated =
    isBatchMode &&
    batchFiles.length > 0 &&
    batchFiles.every((f) => f.estimatedSize !== undefined && !f.isEstimating);
  const anyBatchFileEstimating =
    isBatchMode && batchFiles.some((f) => f.isEstimating);

  const fitModeOptions = [
    { id: "cover", label: t.controls.fitCover, icon: Scan },
    { id: "contain", label: t.controls.fitContain, icon: Minimize2 },
    { id: "fill", label: t.controls.fitFill, icon: StretchHorizontal },
  ];
  // Helper: 檢查目前尺寸是否符合特定比例 (容許 1px 誤差)
  const isAspectRatioActive = (targetRatio: number) => {
    if (!config.width || !config.height) return false;
    const current = config.width / config.height;
    return Math.abs(current - targetRatio) < 0.02;
  };
  const formats: ImageFormat[] = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/x-icon",
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
    <div className="flex h-full flex-col bg-white p-6 lg:col-span-4 lg:p-8">
      {/* --- Header --- */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-slate-800">
          <ImageIcon className="h-5 w-5 text-indigo-600" />
          {t.controls.dimensions}
        </h2>
        <button
          onClick={onReset}
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
        >
          <RotateCcw className="h-3 w-3" /> {t.controls.reset}
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* --- 主要控制區塊 --- */}
      <div className="mb-8 space-y-8">
        {/* 尺寸與比例 (Dimensions & Aspect Ratio) */}
        <div className="space-y-2">
          <label className="flex justify-between text-xs font-bold tracking-wider text-slate-500 uppercase">
            {t.controls.dimensions}
          </label>

          {/* 輸入框區塊 */}
          <div className="flex items-center gap-2">
            {/* Width Input */}
            <div className="group relative flex-1">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold text-slate-400 transition-colors select-none group-focus-within:text-indigo-500">
                W
              </span>
              <input
                type="number"
                min="1"
                value={config.width || ""}
                onChange={(e) =>
                  onConfigChange({ width: Number(e.target.value) })
                }
                className="w-full [appearance:textfield] rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-8 pl-8 font-mono text-sm text-slate-800 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[10px] text-slate-400 select-none">
                px
              </span>
            </div>

            {/* Lock Button */}
            <button
              onClick={() =>
                onConfigChange({
                  maintainAspectRatio: !config.maintainAspectRatio,
                })
              }
              className={`shrink-0 cursor-pointer rounded-lg p-2 transition-all ${
                config.maintainAspectRatio
                  ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                  : "text-slate-400 hover:bg-slate-100"
              }`}
              title={t.controls.toggleAspectRatio}
            >
              {config.maintainAspectRatio ? (
                <LinkIcon className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </button>

            {/* Height Input */}
            <div className="group relative flex-1">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold text-slate-400 transition-colors select-none group-focus-within:text-indigo-500">
                H
              </span>
              <input
                type="number"
                min="1"
                value={config.height || ""}
                onChange={(e) =>
                  onConfigChange({ height: Number(e.target.value) })
                }
                className="w-full [appearance:textfield] rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-8 pl-8 font-mono text-sm text-slate-800 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[10px] text-slate-400 select-none">
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
                  fitMode: "cover", // 恢復預設縮放模式
                });
              }}
              className={`flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                // 檢查是否為原始尺寸
                (() => {
                  const targetDimensions = isBatchMode
                    ? batchFiles[0]?.originalDimensions
                    : originalDimensions;
                  if (!targetDimensions) return false;
                  return (
                    config.width === targetDimensions.width &&
                    config.height === targetDimensions.height
                  );
                })()
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
              }`}
            >
              <ImageLucide className="h-3 w-3" />
              <span>{t.controls.aspectOriginal}</span>
            </button>

            {[
              { label: "16:9", ratio: 16 / 9, icon: RectangleHorizontal },
              { label: "4:3", ratio: 4 / 3, icon: RectangleHorizontal },
              { label: "1:1", ratio: 1, icon: Square },
              { label: "9:16", ratio: 9 / 16, icon: RectangleVertical },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  const newHeight = Math.round(config.width / item.ratio);
                  onConfigChange({
                    height: newHeight,
                    maintainAspectRatio: true,
                    aspectRatio: item.ratio,
                    fitMode: "cover",
                  }); // 切換比例時自動 cover
                }}
                className={`flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  isAspectRatioActive(item.ratio)
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
                }`}
              >
                <item.icon className="h-3 w-3 opacity-70" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 縮放模式 (Fit Mode) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
            {t.controls.fitMode}
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
            {fitModeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = config.fitMode === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() =>
                    onConfigChange({ fitMode: option.id as FitMode })
                  }
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                      : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                  } `}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${isActive ? "stroke-2" : ""}`}
                  />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 歷史紀錄 */}
        {history.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <Clock className="h-3 w-3" /> {t.controls.history}
            </div>
            <div className="flex flex-wrap gap-2">
              {history.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-xs text-slate-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
                >
                  <button
                    onClick={() =>
                      onConfigChange({ width: item.width, height: item.height })
                    }
                    className="font-mono tabular-nums"
                  >
                    {item.width}×{item.height}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistory(item.id);
                    }}
                    className="cursor-pointer text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr className="border-slate-100" />

      {/* 浮水印設定 */}
      <div className="space-y-2 py-8">
        <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
          {t.controls.watermarkOverlay}
        </label>

        {/* 隱藏的浮水印檔案輸入 */}
        <input
          ref={watermarkInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setWatermarkFile(file);
            if (e.target) e.target.value = "";
          }}
        />

        {!watermark.file ? (
          /* Dropzone 虛線按鈕 */
          <button
            onClick={() => watermarkInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/"))
                setWatermarkFile(file);
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-4 text-xs text-slate-400 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-500"
          >
            <Plus className="h-4 w-4" />
            {t.controls.watermarkUpload}
          </button>
        ) : (
          /* 已上傳的浮水印 - 縮圖 + 檔名 + 刪除 */
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2">
              {watermark.previewUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={watermark.previewUrl}
                  alt="watermark"
                  className="h-6 w-6 shrink-0 rounded bg-white/70 object-contain"
                />
              )}
              <span className="flex-1 truncate text-xs text-slate-700">
                {watermark.file.name}
              </span>
              <button
                onClick={removeWatermark}
                className="shrink-0 cursor-pointer rounded p-0.5 text-[#EF4444] transition-colors hover:bg-red-100 hover:text-red-700"
                title={t.controls.watermarkRemove}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 只有上傳浮水印檔案後才顯示定位 & 大小區塊 */}
        {watermark.file && (
          <div className="mt-2 space-y-3">
            {/* 快速定位九宮格 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {t.controls.watermarkQuickPosition}
                </span>
                <span className="text-[10px] text-gray-400">
                  {t.controls.watermarkAutoMargin}: {watermark.margin}px
                </span>
              </div>

              <div className="mx-auto grid h-18 w-18 grid-cols-3 gap-1">
                {(
                  [
                    ["top-left", t.controls.watermarkTopLeft],
                    ["top-center", t.controls.watermarkTopCenter],
                    ["top-right", t.controls.watermarkTopRight],
                    ["center-left", t.controls.watermarkCenterLeft],
                    ["center", t.controls.watermarkCenter],
                    ["center-right", t.controls.watermarkCenterRight],
                    ["bottom-left", t.controls.watermarkBottomLeft],
                    ["bottom-center", t.controls.watermarkBottomCenter],
                    ["bottom-right", t.controls.watermarkBottomRight],
                  ] as [WatermarkPosition, string][]
                ).map(([pos, label]) => (
                  <button
                    key={pos}
                    onClick={() =>
                      updateWatermarkConfig({
                        position: pos,
                        customPosition: null,
                      })
                    }
                    className={`cursor-pointer rounded transition-colors ${
                      watermark.position === pos && !watermark.customPosition
                        ? "bg-indigo-500 ring-1 ring-indigo-600"
                        : "bg-gray-100 hover:bg-indigo-100"
                    } ${pos === "center" ? "border border-gray-300" : ""}`}
                    title={label}
                  />
                ))}
              </div>
            </div>

            {/* 浮水印大小滑桿 */}
            <div className="flex items-center gap-2">
              <span className="w-15 shrink-0 text-xs text-gray-500">
                {t.controls.watermarkSize}
              </span>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={watermark.size}
                onChange={(e) =>
                  updateWatermarkConfig({ size: Number(e.target.value) })
                }
                className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
              />
              <span className="w-8 text-right font-mono text-[10px] text-gray-400">
                {Math.round(watermark.size * 100)}%
              </span>
            </div>

            {/* 浮水印透明度滑桿 */}
            <div className="flex items-center gap-2">
              <span className="w-15 shrink-0 text-xs text-gray-500">
                {t.controls.watermarkOpacity}
              </span>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.05"
                value={watermark.opacity}
                onChange={(e) =>
                  updateWatermarkConfig({ opacity: Number(e.target.value) })
                }
                className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
              />
              <span className="w-8 text-right font-mono text-[10px] text-gray-400">
                {Math.round(watermark.opacity * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <hr className="mb-8 border-slate-100" />

      {/* 格式與品質 (Format & Quality) */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
            {t.controls.format}
          </label>
          <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => onConfigChange({ format: fmt })}
                className={`cursor-pointer rounded-md py-2 text-xs font-medium transition-all ${
                  config.format === fmt
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                }`}
              >
                {formatToShortName(fmt)}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
              {t.controls.quality}
            </label>
            <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-xs text-indigo-700 tabular-nums">
              {Math.round(config.quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={config.quality}
            onChange={(e) =>
              onConfigChange({ quality: Number(e.target.value) })
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>{t.controls.smallerFile}</span>
            <span>{t.controls.bestQuality}</span>
          </div>
        </div>

        {/* 預估大小顯示區塊 (使用我們之前優化過的固定高度版本) */}
        {currentFile && !isBatchMode && (
          <div className="flex h-26 flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-200/50 transition-all">
            {/* ... 這裡放我們之前優化過的預估大小 UI ... */}
            <div className="flex h-6 items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Weight className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  {t.controls.estimatedSize}
                </span>
              </div>
              {!isEstimating &&
                estimatedSize !== null &&
                reduction !== null &&
                (reduction > 0 ? (
                  <div className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    <TrendingDown className="h-3 w-3" />
                    <span>SAVE {reduction}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>+{Math.abs(reduction)}%</span>
                  </div>
                ))}
            </div>
            <div className="flex w-full items-end justify-between">
              {isEstimating ? (
                <div className="w-full animate-pulse space-y-2">
                  <div className="h-7 w-24 rounded-md bg-slate-200"></div>
                  <div className="h-3 w-32 rounded-md bg-slate-100"></div>
                </div>
              ) : estimatedSize !== null ? (
                <div className="flex flex-col">
                  <span
                    className={`text-3xl leading-none font-bold tracking-tight tabular-nums ${reduction !== null && reduction <= 0 ? "text-orange-600" : "text-slate-800"}`}
                  >
                    {formatFileSize(estimatedSize)}
                  </span>
                  <span className="mt-1.5 text-xs font-medium text-slate-400 tabular-nums">
                    {t.batch.originalSize}:{" "}
                    <span className="line-through opacity-70">
                      {formatFileSize(originalSize)}
                    </span>
                  </span>
                </div>
              ) : (
                <span className="text-xl font-medium text-slate-300">—</span>
              )}
            </div>
          </div>
        )}

        {/* 批次試算按鈕 (保持不變) */}
        {isBatchMode && (
          <button
            onClick={handleCalculateAllSizes}
            disabled={anyBatchFileEstimating}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {anyBatchFileEstimating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.controls.calculating}
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                {t.controls.calculateAllSizes}
              </>
            )}
          </button>
        )}
      </div>

      {/* Action Buttons (保持不變) */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          onClick={handleDownload}
          disabled={isProcessing || !config.width || !config.height}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-medium text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t.controls.processing}
            </>
          ) : isBatchMode ? (
            allBatchFilesEstimated && batchTotalEstimatedSize > 0 ? (
              <>
                <Package className="h-5 w-5" />
                {t.controls.downloadBatch}{" "}
                <span className="text-sm text-indigo-200">
                  ({formatFileSize(batchTotalEstimatedSize)})
                </span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-indigo-200" />
                {t.controls.downloadAndCompress}
              </>
            )
          ) : (
            <>
              <Download className="h-5 w-5" />
              {t.controls.downloadSingle}{" "}
              {estimatedSize !== null && (
                <span className="text-sm text-indigo-200">
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
