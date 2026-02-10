/**
 * CustomSizeControls - 自訂尺寸控制元件
 * 從 ControlPanel 抽取出的自訂模式控制項
 * 包含：尺寸輸入、比例預設、縮放模式、歷史紀錄、浮水印
 */

"use client";

import React, { useRef } from "react";
import {
  ImageIcon,
  Link as LinkIcon,
  Unlock,
  Clock,
  X,
  RefreshCw,
  Weight,
  TrendingDown,
  AlertCircle,
  Scan,
  Minimize2,
  Image as ImageLucide,
  RectangleHorizontal,
  Square,
  RectangleVertical,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import type { ResizeConfig, FitMode, WatermarkPosition } from "@/src/types";
import { formatToShortName, formatFileSize } from "@/src/lib/utils";
import { useResizeHistory } from "@/src/hooks/useLocalStorage";
import { useTranslation } from "@/src/hooks/useTranslation";
import useAppStore from "@/src/store/use-app-store";
import type { ImageFormat } from "@/src/types";

interface CustomSizeControlsProps {
  config: ResizeConfig;
  error: string | null;
  onConfigChange: (partial: Partial<ResizeConfig>) => void;
  onReset: () => void;
}

export default function CustomSizeControls({
  config,
  error,
  onConfigChange,
  onReset,
}: CustomSizeControlsProps) {
  const { t } = useTranslation();
  const { history, removeHistory } = useResizeHistory();

  // 從 store 取得狀態
  const isBatchMode = useAppStore((s) => s.isBatchMode);
  const batchFiles = useAppStore((s) => s.batchFiles);
  const selectedFileId = useAppStore((s) => s.selectedFileId);
  const originalDimensions = useAppStore((s) => s.originalDimensions);
  const sourceFile = useAppStore((s) => s.sourceFile);
  const estimatedSize = useAppStore((s) => s.estimatedSize);
  const isEstimating = useAppStore((s) => s.isEstimating);
  const estimateAllSizesAction = useAppStore((s) => s.estimateAllSizes);

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

  // 計算壓縮減少百分比
  const originalSize = currentFile?.size || 0;
  const reduction =
    estimatedSize && originalSize
      ? Math.min(
          99,
          Math.max(-99, Math.round((1 - estimatedSize / originalSize) * 100)),
        )
      : null;

  // 批次相關
  const anyBatchFileEstimating =
    isBatchMode && batchFiles.some((f) => f.isEstimating);

  const fitModeOptions = [
    { id: "cover", label: t.controls.fitCover, icon: Scan },
    { id: "contain", label: t.controls.fitContain, icon: Minimize2 },
  ];

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

  return (
    <>
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
          <span className="h-3 w-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </span>{" "}
          {t.controls.reset}
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
        {/* 尺寸與比例 */}
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

          {/* 比例快速選擇 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                let targetWidth: number;
                let targetHeight: number;
                let targetAspectRatio: number;

                if (isBatchMode) {
                  const firstFile = batchFiles[0];
                  if (firstFile?.originalDimensions) {
                    targetWidth = firstFile.originalDimensions.width;
                    targetHeight = firstFile.originalDimensions.height;
                    targetAspectRatio = targetWidth / targetHeight;
                  } else {
                    return;
                  }
                } else {
                  if (originalDimensions) {
                    targetWidth = originalDimensions.width;
                    targetHeight = originalDimensions.height;
                    targetAspectRatio = targetWidth / targetHeight;
                  } else {
                    return;
                  }
                }

                onConfigChange({
                  width: targetWidth,
                  height: targetHeight,
                  maintainAspectRatio: true,
                  aspectRatio: targetAspectRatio,
                  fitMode: "cover",
                });
              }}
              className={`flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
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
                  });
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

        {/* 縮放模式 */}
        <div className="space-y-2">
          <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
            {t.controls.fitMode}
          </label>
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
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

        {watermark.file && (
          <div className="mt-2 space-y-3">
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

      {/* 格式與品質 */}
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

        {/* 預估大小顯示區塊 */}
        {currentFile && !isBatchMode && (
          <div className="flex h-26 flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-200/50 transition-all">
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

        {/* 批次試算按鈕 */}
        {isBatchMode && (
          <button
            onClick={() => estimateAllSizesAction()}
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
    </>
  );
}
