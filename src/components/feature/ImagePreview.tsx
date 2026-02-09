/**
 * ImagePreview - 圖片預覽元件
 * Feature Component - 顯示圖片預覽與資訊
 * 符合規格定義
 */

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Loader2, Scissors } from "lucide-react";
import type {
  ImagePreviewProps,
  CropData,
  WatermarkPosition,
} from "@/src/types";
import { formatFileSize } from "@/src/lib/utils";
import { useTranslation } from "@/src/hooks/useTranslation";
import useAppStore from "@/src/store/use-app-store";
import { CropModal } from "@/src/components/ui/CropModal";

/**
 * 根據九宮格位置與邊距，計算浮水印在容器中的 CSS 百分比位置
 */
function getWatermarkCSSPosition(
  position: WatermarkPosition,
  margin: number,
  containerWidth: number,
  containerHeight: number,
  wmWidth: number,
  wmHeight: number,
): { left: number; top: number } {
  let x = 0;
  let y = 0;

  if (position.includes("left")) {
    x = margin;
  } else if (position.includes("right")) {
    x = containerWidth - wmWidth - margin;
  } else {
    x = (containerWidth - wmWidth) / 2;
  }

  if (position.startsWith("top")) {
    y = margin;
  } else if (position.startsWith("bottom")) {
    y = containerHeight - wmHeight - margin;
  } else {
    y = (containerHeight - wmHeight) / 2;
  }

  // 轉為百分比
  const leftPct = containerWidth > 0 ? (x / containerWidth) * 100 : 0;
  const topPct = containerHeight > 0 ? (y / containerHeight) * 100 : 0;

  return { left: leftPct, top: topPct };
}

export default function ImagePreview({
  src,
  originalSrc,
  originalDimensions,
  fileSize,
  isProcessing,
}: ImagePreviewProps) {
  const { t } = useTranslation();
  const [showCropModal, setShowCropModal] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const wmRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // 從 store 取得 fitMode 與設定
  const config = useAppStore((s) => s.config);
  const isBatchMode = useAppStore((s) => s.isBatchMode);
  const batchFiles = useAppStore((s) => s.batchFiles);
  const selectedFileId = useAppStore((s) => s.selectedFileId);
  const setCropForFile = useAppStore((s) => s.setCropForFile);
  const cropData = useAppStore((s) => s.cropData);
  const setCustomCrop = useAppStore((s) => s.setCustomCrop);

  // 浮水印
  const watermark = useAppStore((s) => s.watermark);
  const updateWatermarkConfig = useAppStore((s) => s.updateWatermarkConfig);

  // 圖片容器尺寸 (用於浮水印拖曳計算)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // 監聽圖片載入以取得容器尺寸
  const updateContainerSize = useCallback(() => {
    if (imgRef.current) {
      setContainerSize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, [updateContainerSize, src]);

  // 取得當前選中的檔案（用於批次模式的裁切調整）
  const selectedFile = selectedFileId
    ? batchFiles.find((f) => f.id === selectedFileId)
    : null;

  // 處理裁切確認 - 接收完整的 CropData
  const handleCropConfirm = (newCropData: CropData) => {
    if (isBatchMode && selectedFileId) {
      setCropForFile(selectedFileId, newCropData);
    } else {
      setCustomCrop(newCropData);
    }
    setShowCropModal(false);
  };

  // 是否顯示裁切按鈕（僅 Cover 模式下顯示）
  const showCropButton = config.fitMode === "cover" && src;

  // 判斷是否已手動裁切
  const hasCropData = isBatchMode
    ? selectedFile?.cropData !== undefined
    : cropData !== null;

  // 浮水印拖曳邏輯
  const handleWatermarkMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = true;

      const wmEl = wmRef.current;
      if (!wmEl) return;

      const rect = wmEl.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!isDragging.current || !imageContainerRef.current) return;
        const containerRect = imageContainerRef.current.getBoundingClientRect();

        const newX = ev.clientX - containerRect.left - dragOffset.current.x;
        const newY = ev.clientY - containerRect.top - dragOffset.current.y;

        // 轉百分比
        const pctX = (newX / containerRect.width) * 100;
        const pctY = (newY / containerRect.height) * 100;

        // 限制在 0~100 範圍（允許部分超出邊界）
        const clampedX = Math.max(-5, Math.min(95, pctX));
        const clampedY = Math.max(-5, Math.min(95, pctY));

        updateWatermarkConfig({
          customPosition: { x: clampedX, y: clampedY },
        });
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [updateWatermarkConfig],
  );

  // 浮水印觸控拖曳
  const handleWatermarkTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      isDragging.current = true;

      const wmEl = wmRef.current;
      if (!wmEl) return;

      const touch = e.touches[0];
      const rect = wmEl.getBoundingClientRect();
      dragOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };

      const handleTouchMove = (ev: TouchEvent) => {
        if (!isDragging.current || !imageContainerRef.current) return;
        ev.preventDefault();
        const containerRect = imageContainerRef.current.getBoundingClientRect();
        const t = ev.touches[0];

        const newX = t.clientX - containerRect.left - dragOffset.current.x;
        const newY = t.clientY - containerRect.top - dragOffset.current.y;

        const pctX = Math.max(
          -5,
          Math.min(95, (newX / containerRect.width) * 100),
        );
        const pctY = Math.max(
          -5,
          Math.min(95, (newY / containerRect.height) * 100),
        );

        updateWatermarkConfig({
          customPosition: { x: pctX, y: pctY },
        });
      };

      const handleTouchEnd = () => {
        isDragging.current = false;
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    },
    [updateWatermarkConfig],
  );

  // 浮水印 resize handle（右下角拖曳調整大小）
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startSize = watermark.size;

      const handleMouseMove = (ev: MouseEvent) => {
        if (!imageContainerRef.current) return;
        const containerRect = imageContainerRef.current.getBoundingClientRect();
        const deltaX = ev.clientX - startX;
        const deltaPct = deltaX / containerRect.width;
        const newSize = Math.max(0.05, Math.min(0.5, startSize + deltaPct));
        updateWatermarkConfig({ size: newSize });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [watermark.size, updateWatermarkConfig],
  );

  // 浮水印 resize handle 觸控
  const handleResizeTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();

      const startX = e.touches[0].clientX;
      const startSize = watermark.size;

      const handleTouchMove = (ev: TouchEvent) => {
        ev.preventDefault();
        if (!imageContainerRef.current) return;
        const containerRect = imageContainerRef.current.getBoundingClientRect();
        const deltaX = ev.touches[0].clientX - startX;
        const deltaPct = deltaX / containerRect.width;
        const newSize = Math.max(0.05, Math.min(0.5, startSize + deltaPct));
        updateWatermarkConfig({ size: newSize });
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    },
    [watermark.size, updateWatermarkConfig],
  );

  // 計算浮水印在預覽中的位置與大小
  const wmSize = containerSize.width * watermark.size;
  const wmPreviewStyle = (() => {
    if (!watermark.file || !watermark.previewUrl || containerSize.width === 0)
      return null;

    if (watermark.customPosition) {
      return {
        left: `${watermark.customPosition.x}%`,
        top: `${watermark.customPosition.y}%`,
        width: `${watermark.size * 100}%`,
        opacity: 1 - watermark.opacity, // 透明度轉不透明度
      };
    }

    const { left, top } = getWatermarkCSSPosition(
      watermark.position,
      watermark.margin * (containerSize.width / config.width), // 按比例縮放邊距
      containerSize.width,
      containerSize.height,
      wmSize,
      wmSize, // 先用正方形估算，img 會自動保持比例
    );
    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${watermark.size * 100}%`,
      opacity: 1 - watermark.opacity, // 透明度轉不透明度
    };
  })();

  return (
    <div className="relative flex items-center justify-center overflow-hidden border-b border-slate-200 bg-slate-100/50 p-8 lg:col-span-8 lg:border-r lg:border-b-0">
      {/* 棋盤格背景 (模擬透明) */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div
        ref={imageContainerRef}
        className="relative z-10 max-h-full max-w-full overflow-hidden rounded-lg shadow-2xl shadow-slate-300/50"
      >
        {/* 處理中遮罩 */}
        {isProcessing && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-3 text-white">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm">{t.controls.processing}</span>
            </div>
          </div>
        )}

        {/* 圖片資訊標籤 */}
        {originalDimensions && (
          <div className="absolute top-4 left-4 z-10 rounded bg-black/70 px-2 py-1 font-mono text-xs text-white tabular-nums backdrop-blur-sm">
            {originalDimensions.width} × {originalDimensions.height}
            {fileSize && ` • ${formatFileSize(fileSize)}`}
          </div>
        )}

        {/* 調整裁切按鈕 - 兩種狀態 */}
        {showCropButton && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
            <button
              onClick={() => setShowCropModal(true)}
              className={`flex cursor-pointer items-center gap-1.5 rounded px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm transition-all ${
                hasCropData
                  ? "bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-700"
                  : "border border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-white"
              } `}
              title={
                hasCropData ? t.controls.cropModified : t.controls.aspectCrop
              }
            >
              <Scissors
                className={`h-3.5 w-3.5 ${hasCropData ? "fill-white/30" : ""}`}
              />
              <span>
                {hasCropData ? t.controls.cropModified : t.controls.aspectCrop}
              </span>
            </button>
          </div>
        )}

        {/* 圖片 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt="Preview"
          className="block max-w-full object-contain"
          style={{ maxHeight: "500px" }}
          onLoad={updateContainerSize}
        />

        {/* 浮水印疊加預覽 */}
        {watermark.file && watermark.previewUrl && wmPreviewStyle && (
          <div
            ref={wmRef}
            className="absolute cursor-grab select-none active:cursor-grabbing"
            style={{
              ...wmPreviewStyle,
              pointerEvents: "auto",
              zIndex: 15,
            }}
            onMouseDown={handleWatermarkMouseDown}
            onTouchStart={handleWatermarkTouchStart}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={watermark.previewUrl}
              alt="Watermark"
              className="pointer-events-none h-auto w-full"
              draggable={false}
            />
            {/* 右下角 Resize Handle */}
            <div
              className="absolute -right-1 -bottom-1 z-20 flex h-4 w-4 cursor-se-resize items-center justify-center rounded-full border-2 border-white bg-indigo-500 shadow-md transition-colors hover:bg-indigo-600"
              onMouseDown={handleResizeMouseDown}
              onTouchStart={handleResizeTouchStart}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M7 1L1 7M7 4L4 7"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 裁切彈窗 */}
      {showCropModal && originalSrc && (
        <CropModal
          imageUrl={originalSrc}
          targetWidth={config.width}
          targetHeight={config.height}
          initialCropData={
            isBatchMode ? selectedFile?.cropData : (cropData ?? undefined)
          }
          onConfirm={handleCropConfirm}
          onCancel={() => setShowCropModal(false)}
          watermark={watermark}
        />
      )}
    </div>
  );
}
