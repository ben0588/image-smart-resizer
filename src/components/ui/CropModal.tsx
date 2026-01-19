'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { X, Check, RotateCcw, ZoomOut, ZoomIn, RotateCcwSquare, RotateCwSquare } from 'lucide-react';
import { Button } from './Button';
import { useTranslation } from '@/src/hooks/useTranslation';
import { CropData } from '@/src/types';

interface CropModalProps {
  imageUrl: string;
  targetWidth: number;
  targetHeight: number;
  initialCropData?: CropData;  // 完整的裁切資料（用於恢復 UI 狀態）
  onConfirm: (cropData: CropData) => void;  // 返回完整的 CropData
  onCancel: () => void;
}

export function CropModal({
  imageUrl,
  targetWidth,
  targetHeight,
  initialCropData,
  onConfirm,
  onCancel,
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
    initialCropData?.cropPosition ?? defaultCrop
  );
  const [zoom, setZoom] = useState(initialCropData?.zoom ?? defaultZoom);
  const [rotation, setRotation] = useState(initialCropData?.rotation ?? defaultRotation);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // 當裁切完成時
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
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
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
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
        <div className="relative flex-1 bg-gray-950 overflow-hidden">
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
                width: '100%',
                height: '100%',
              },
              cropAreaStyle: {
                border: '1px solid rgba(255, 255, 255, 0.5)', 
                color: 'rgba(255, 255, 255, 0.5)', // 網格線顏色
              },
            }}
          />
          
        </div>

        <div className="flex items-center justify-between px-5 my-4 border-t border-slate-100">
          {/* 左側：縮放控制 (Zoom) */}
          <div className="flex items-center gap-3 flex-1 mr-8">
            <ZoomOut className="w-4 h-4 text-slate-400" />
            <input 
              type="range" 
              min={1} 
              max={3} 
              step={0.01} 
              value={zoom} 
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
            />
            <ZoomIn className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-500 min-w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* 右側：旋轉控制 (Rotate) - 方形按鈕組 */}
          <div className="flex items-center gap-2">
            {/* 分隔線 */}
            <div className="w-px h-8 bg-slate-200 mx-2" />

            {/* 向左轉 (-90度) */}
            <button 
              onClick={() => setRotation((prev) => prev - 90)}
              className="
                w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 
                hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 transition-all cursor-pointer
              "
              title={t.controls.rotateLeft}
            >
              <RotateCcwSquare className="w-4.5 h-4.5" />
            </button>

            {/* 向右轉 (+90度) */}
            <button 
              onClick={() => setRotation((prev) => prev + 90)}
              className="
                w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 
                hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 transition-all cursor-pointer
              "
              title={t.controls.rotateRight}
            >
              <RotateCwSquare className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex items-center justify-between  border-t border-gray-200 px-6 py-4 dark:border-gray-700">
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
