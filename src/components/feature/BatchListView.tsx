/**
 * BatchListView - 批次圖片清單檢視元件
 * 專為桌面版設計的 Table/List View
 * 顯示詳細資訊：縮圖、檔名、尺寸、格式、原始/壓縮大小
 */

"use client";

import React, { useState, useRef } from "react";
import {
  Loader2,
  Eye,
  Plus,
  Download,
  Trash2,
  Check,
  ArrowRight,
  Scissors,
  X,
} from "lucide-react";
import type { BatchFileItem, CropData } from "@/src/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import {
  downloadImage,
  resizeImage,
  createPreviewURL,
  revokePreviewURL,
  loadWatermarkDataUrl,
} from "@/src/lib/engine/processor";
import {
  replaceExtension,
  formatFileSize,
  validateImageFile,
} from "@/src/lib/utils";
import { Modal } from "@/src/components/ui/Modal";
import { CropModal } from "@/src/components/ui/CropModal";
import useAppStore from "@/src/store/use-app-store";

interface BatchListViewProps {
  files: BatchFileItem[];
  isProcessing: boolean;
  selectedFileId: string | null;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}

/**
 * 取得檔案格式的簡短名稱
 */
function getFileFormat(file: File): string {
  const type = file.type;
  const map: Record<string, string> = {
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "image/webp": "WebP",
    "image/svg+xml": "SVG",
    "image/gif": "GIF",
  };
  return map[type] || type.split("/")[1]?.toUpperCase() || "Unknown";
}

export function BatchListView({
  files,
  isProcessing,
  selectedFileId,
  onRemove,
  onSelect,
}: BatchListViewProps) {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cropFileId, setCropFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFiles = useAppStore((s) => s.addFiles);
  const config = useAppStore((s) => s.config);
  const setCropForFile = useAppStore((s) => s.setCropForFile);
  const watermark = useAppStore((s) => s.watermark);

  // 取得要裁切的檔案
  const cropFile = cropFileId ? files.find((f) => f.id === cropFileId) : null;

  // 處理預覽圖片 - 執行 Pica 處理後顯示最終效果（含浮水印）
  const handlePreviewClick = async (item: BatchFileItem) => {
    setIsPreviewLoading(true);
    try {
      // 建構浮水印參數
      const watermarkOpt = watermark.file
        ? {
            imageData: await loadWatermarkDataUrl(watermark.file),
            position: watermark.position,
            size: watermark.size,
            margin: watermark.margin,
            opacity: 1 - watermark.opacity, // 透明度轉不透明度
            customPosition: watermark.customPosition,
          }
        : undefined;

      // 執行圖片處理
      const blob = await resizeImage(item.file, {
        width: config.width,
        height: config.height,
        format: config.format,
        quality: config.quality,
        fitMode: config.fitMode,
        customCrop: item.customCrop,
        rotation: item.cropData?.rotation ?? 0,
        watermark: watermarkOpt,
      });

      // 建立預覽 URL
      const previewUrl = createPreviewURL(blob);

      // 如果有舊的預覽 URL，先釋放
      if (previewImage) {
        revokePreviewURL(previewImage);
      }

      setPreviewImage(previewUrl);
    } catch (error) {
      console.error("預覽處理失敗:", error);
      // 如果處理失敗，fallback 到原始預覽
      setPreviewImage(item.previewUrl);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // 關閉預覽時清理 URL
  const handleClosePreview = () => {
    if (previewImage && !files.some((f) => f.previewUrl === previewImage)) {
      // 只有當 previewImage 不是原始 previewUrl 時才 revoke
      revokePreviewURL(previewImage);
    }
    setPreviewImage(null);
  };

  // 處理裁切確認 - 接收完整的 CropData
  const handleCropConfirm = (cropData: CropData) => {
    if (cropFileId) {
      setCropForFile(cropFileId, cropData);
    }
    setCropFileId(null);
  };

  // 處理拖放檔案
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const validFiles = droppedFiles.filter((file) => {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          alert(`${file.name}: ${validation.error}`);
          return false;
        }
        return true;
      });
      if (validFiles.length > 0) {
        addFiles(validFiles);
      }
    }
  };

  // 處理額外檔案選擇
  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      const validFiles = newFiles.filter((file) => {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          alert(`${file.name}: ${validation.error}`);
          return false;
        }
        return true;
      });
      if (validFiles.length > 0) {
        addFiles(validFiles);
      }
    }
    if (e.target) e.target.value = "";
  };

  return (
    <div className="flex h-full flex-col overflow-hidden border-b border-slate-200 bg-slate-50/50 lg:col-span-8 lg:border-r lg:border-b-0">
      {/* 隱藏的檔案輸入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        multiple
        onChange={handleAddMore}
        className="hidden"
      />

      {/* 圖片預覽 Modal */}
      <Modal isOpen={previewImage !== null} onClose={handleClosePreview}>
        {isPreviewLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : previewImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewImage}
            alt="Preview"
            className="h-auto max-h-[70vh] w-full object-contain"
          />
        ) : null}
      </Modal>

      {/* 標題列 */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-700">
          {files.length === 1
            ? t.batch.fileCountSingle.replace(
                "{count}",
                files.length.toString(),
              )
            : t.batch.fileCountPlural.replace(
                "{count}",
                files.length.toString(),
              )}
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          <Plus className="h-3.5 w-3.5" />
          {t.upload.addMore}
        </button>
      </div>

      {/* 表頭 */}
      <div className="hidden grid-cols-12 gap-2 border-b border-slate-200 bg-slate-100/80 px-4 py-2 text-xs font-semibold tracking-wider text-slate-500 uppercase lg:grid">
        <div className="col-span-1"></div>
        <div className="col-span-4">{t.batch.filename}</div>
        <div className="col-span-2 text-center">{t.batch.dimensions}</div>
        <div className="col-span-1 text-center">{t.batch.format}</div>
        <div className="col-span-3 text-center">
          {t.batch.originalSize} → {t.batch.compressedSize}
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* 檔案列表 */}
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        {files.map((item) => {
          const isSelected = selectedFileId === item.id;
          const isHovered = hoveredId === item.id;
          const originalSize = item.file.size;
          const estimatedSize = item.estimatedSize;
          const reduction = estimatedSize
            ? Math.min(
                99,
                Math.max(
                  -99,
                  Math.round((1 - estimatedSize / originalSize) * 100),
                ),
              )
            : null;

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`grid cursor-pointer grid-cols-12 items-center gap-2 border-b border-slate-100 px-4 py-3 transition-all ${
                isSelected
                  ? "bg-indigo-50 ring-2 ring-indigo-500 ring-inset"
                  : "hover:bg-slate-50"
              } ${item.status === "completed" ? "bg-green-50/50" : ""} ${item.status === "error" ? "bg-red-50/50" : ""} `}
            >
              {/* 縮圖 */}
              <div className="relative col-span-1">
                <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* 狀態指示器 */}
                {item.status === "processing" && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  </div>
                )}
                {item.status === "completed" && (
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* 檔案名稱 */}
              <div className="col-span-4">
                <p
                  className="truncate text-sm font-medium text-slate-800"
                  title={item.file.name}
                >
                  {item.file.name}
                </p>
                {isSelected && (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600">
                    <Check className="h-3 w-3" /> {t.batch.selected}
                  </span>
                )}
                {item.status === "error" && (
                  <p className="mt-0.5 text-xs text-red-500">
                    {item.error || t.batch.failed}
                  </p>
                )}
              </div>

              {/* 尺寸 */}
              <div className="col-span-2 text-center">
                {item.originalDimensions ? (
                  <span className="font-mono text-xs text-slate-600 tabular-nums">
                    {item.originalDimensions.width}×
                    {item.originalDimensions.height}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </div>

              {/* 格式 */}
              <div className="col-span-1 text-center">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                  {getFileFormat(item.file)}
                </span>
              </div>

              {/* 大小 (原始 → 壓縮後) */}
              <div className="col-span-3 flex items-center justify-center gap-1.5 text-center">
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {formatFileSize(originalSize)}
                </span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                {item.isEstimating ? (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </span>
                ) : estimatedSize !== undefined ? (
                  <span className="font-mono text-xs font-semibold text-green-600 tabular-nums">
                    {formatFileSize(estimatedSize)}
                    {reduction !== null && reduction > 0 && (
                      <span className="ml-1 text-green-500">
                        (-{reduction}%)
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </div>

              {/* 操作按鈕 */}
              <div className="col-span-1 flex items-center justify-end gap-1">
                {(isHovered || isSelected) &&
                  !isProcessing &&
                  (item.status === "pending" ||
                    item.status === "completed") && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewClick(item);
                        }}
                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                        title={t.batch.preview}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {/* 裁切調整按鈕（僅 Cover 模式 + pending 狀態） */}
                      {item.status === "pending" &&
                        config.fitMode === "cover" && (
                          <div className="flex items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCropFileId(item.id);
                              }}
                              className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
                                item.cropData
                                  ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                  : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                              title={
                                item.cropData
                                  ? t.controls.cropModified
                                  : t.controls.aspectCrop
                              }
                            >
                              <Scissors
                                className={`h-4 w-4 ${item.cropData ? "stroke-[2.5]" : ""}`}
                              />
                            </button>
                            {/* 重置裁切按鈕（僅在已裁切時顯示） */}
                            {item.cropData && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCropForFile(item.id, undefined);
                                }}
                                className="cursor-pointer rounded p-1 text-slate-400 transition-colors hover:text-red-500"
                                title={t.controls.cropReset}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      {item.status === "pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item.id);
                          }}
                          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          title={t.batch.remove}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}

                {/* 已完成項目的下載按鈕 */}
                {item.status === "completed" && item.resultBlob && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const filename = replaceExtension(
                        item.file.name,
                        config.format,
                        config.width,
                        config.height,
                      );
                      downloadImage(item.resultBlob!, filename);
                    }}
                    className="cursor-pointer rounded-lg p-1.5 text-green-600 transition-colors hover:bg-green-50"
                    title={t.controls.download}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}

                {/* SVG 多尺寸輸出 */}
                {item.resultVariants && item.resultVariants.length > 0 && (
                  <div className="flex gap-1">
                    {item.resultVariants.slice(0, 2).map((v) => (
                      <button
                        key={`${item.id}-${v.width}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const filename = replaceExtension(
                            item.file.name,
                            "image/png",
                            v.width,
                            v.height,
                          );
                          downloadImage(v.blob, filename);
                        }}
                        className="cursor-pointer rounded bg-green-100 px-1.5 py-0.5 text-[10px] text-green-700 transition-colors hover:bg-green-200"
                        title={`Download ${v.width}×${v.height}`}
                      >
                        {v.width}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 底部 Dropzone 區域 */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`m-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed py-4 transition-colors ${
            isDragOver
              ? "border-indigo-400 bg-indigo-50 text-indigo-600"
              : "border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-500"
          } `}
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">{t.upload.dropHere}</span>
        </div>
      </div>

      {/* 裁切彈窗 */}
      {cropFile && (
        <CropModal
          imageUrl={cropFile.previewUrl}
          targetWidth={config.width}
          targetHeight={config.height}
          initialCropData={cropFile.cropData}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFileId(null)}
          watermark={watermark}
        />
      )}
    </div>
  );
}
