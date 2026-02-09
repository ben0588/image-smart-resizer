"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import {
  X,
  Check,
  RotateCcw,
  ZoomOut,
  ZoomIn,
  RotateCcwSquare,
  RotateCwSquare,
} from "lucide-react";
import { Button } from "./Button";
import { useTranslation } from "@/src/hooks/useTranslation";
import { CropData, WatermarkConfig, WatermarkPosition } from "@/src/types";

/**
 * 根據九宮格位置計算浮水印在裁切區域中的 CSS 定位
 */
function getWatermarkCropPosition(
  position: WatermarkPosition,
): React.CSSProperties {
  const style: React.CSSProperties = {};

  if (position.includes("left")) {
    style.left = "4%";
  } else if (position.includes("right")) {
    style.right = "4%";
  } else {
    style.left = "50%";
    style.transform = "translateX(-50%)";
  }

  if (position.startsWith("top")) {
    style.top = "4%";
  } else if (position.startsWith("bottom")) {
    style.bottom = "4%";
  } else {
    style.top = "50%";
    style.transform = (style.transform || "") + " translateY(-50%)";
  }

  return style;
}

interface CropModalProps {
  imageUrl: string;
  targetWidth: number;
  targetHeight: number;
  initialCropData?: CropData; // 完整的裁切資料（用於恢復 UI 狀態）
  onConfirm: (cropData: CropData) => void; // 返回完整的 CropData
  onCancel: () => void;
  watermark?: WatermarkConfig; // 浮水印設定（可選）
}

export function CropModal({
  imageUrl,
  targetWidth,
  targetHeight,
  initialCropData,
  onConfirm,
  onCancel,
  watermark,
}: CropModalProps) {
  const { t } = useTranslation();

  // 計算目標長寬比
  const aspect = targetWidth / targetHeight;

  // 預設值（用於重置功能）
  const defaultCrop: Point = { x: 0, y: 0 };
  const defaultZoom = 1;
  const defaultRotation = 0;

  // 用來強制重新渲染 Cropper 的 Key
  const [resetKey, setResetKey] = useState(0);

  // Cropper 狀態 - 如果有 initialCropData 則恢復上次的設定
  const [crop, setCrop] = useState<Point>(
    initialCropData?.cropPosition ?? defaultCrop,
  );
  const [zoom, setZoom] = useState(initialCropData?.zoom ?? defaultZoom);
  const [rotation, setRotation] = useState(
    initialCropData?.rotation ?? defaultRotation,
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // 當裁切完成時
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  // 重置裁切 - 恢復成初始狀態
  const handleReset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);

    // 讓 react-easy-crop 認為這是第一次載入，並執行自動置中與適應運算
    setResetKey((prev) => prev + 1);
  }, []);

  // 確認裁切 - 返回完整的 CropData
  const handleConfirm = useCallback(() => {
    if (croppedAreaPixels) {
      onConfirm({
        cropArea: {
          x: croppedAreaPixels.x,
          y: croppedAreaPixels.y,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height,
        },
        cropPosition: crop,
        zoom,
        aspect,
        rotation,
      });
    }
  }, [croppedAreaPixels, crop, zoom, aspect, rotation, onConfirm]);

  // ESC 鍵監聽
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="relative flex h-[90vh] w-[90vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 標題列 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.controls.cropAdjustTitle}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.controls.cropAdjustDesc} ({targetWidth} × {targetHeight})
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onCancel}
            className="rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 裁切區域 */}
        <div className="relative flex-1 overflow-hidden bg-gray-950">
          <Cropper
            key={resetKey}
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            minZoom={1}
            maxZoom={3}
            showGrid={true} // 開啟網格模式
            objectFit="contain"
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
              },
              cropAreaStyle: {
                border: "1px solid rgba(255, 255, 255, 0.5)",
                color: "rgba(255, 255, 255, 0.5)", // 網格線顏色
              },
            }}
          />

          {/* 浮水印疊加預覽（僅顯示，不可互動） */}
          {watermark?.file && watermark.previewUrl && (
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{ overflow: "hidden" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={watermark.previewUrl}
                alt="Watermark preview"
                className="absolute"
                draggable={false}
                style={{
                  width: `${watermark.size * 100}%`,
                  opacity: 1 - watermark.opacity,
                  ...(watermark.customPosition
                    ? {
                        left: `${watermark.customPosition.x}%`,
                        top: `${watermark.customPosition.y}%`,
                      }
                    : getWatermarkCropPosition(watermark.position)),
                }}
              />
            </div>
          )}
        </div>

        <div className="my-4 flex items-center justify-between border-t border-slate-100 px-5">
          {/* 左側：縮放控制 (Zoom) */}
          <div className="mr-8 flex flex-1 items-center gap-3">
            <ZoomOut className="h-4 w-4 text-slate-400" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 transition-all hover:accent-indigo-500"
            />
            <ZoomIn className="h-4 w-4 text-slate-400" />
            <span className="min-w-12 text-right font-mono text-xs text-slate-500">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* 右側：旋轉控制 (Rotate) - 方形按鈕組 */}
          <div className="flex items-center gap-2">
            {/* 分隔線 */}
            <div className="mx-2 h-8 w-px bg-slate-200" />

            {/* 向左轉 (-90度) */}
            <button
              onClick={() => setRotation((prev) => prev - 90)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-600 active:scale-95"
              title={t.controls.rotateLeft}
            >
              <RotateCcwSquare className="h-4.5 w-4.5" />
            </button>

            {/* 向右轉 (+90度) */}
            <button
              onClick={() => setRotation((prev) => prev + 90)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-600 active:scale-95"
              title={t.controls.rotateRight}
            >
              <RotateCwSquare className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t.controls.resetCrop}
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onCancel}>
              {t.controls.cancel}
            </Button>
            <Button onClick={handleConfirm} className="gap-2">
              <Check className="h-4 w-4" />
              {t.controls.applyCrop}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
