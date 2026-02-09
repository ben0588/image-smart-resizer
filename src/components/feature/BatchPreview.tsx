/**
 * BatchPreview - 批次圖片預覽元件
 * 響應式設計：
 * - Desktop (>= 2 張圖片): Table/List View (BatchListView)
 * - Mobile: Card/Grid View
 * 設計理念：Gestalt Proximity + Visual Anchor
 */

"use client";

import React, { useState, useRef } from "react";
import { Loader2, X, Eye, Plus, Download, Scissors } from "lucide-react";
import type { BatchFileItem, CropData } from "@/src/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import {
  downloadImage,
  resizeImage,
  createPreviewURL,
  revokePreviewURL,
  loadWatermarkDataUrl,
} from "@/src/lib/engine/processor";
import { replaceExtension, validateImageFile } from "@/src/lib/utils";
import { Modal } from "@/src/components/ui/Modal";
import { CropModal } from "@/src/components/ui/CropModal";
import useAppStore from "@/src/store/use-app-store";
import { BatchListView } from "./BatchListView";

interface BatchPreviewProps {
  files: BatchFileItem[];
  isProcessing: boolean;
  onRemove: (id: string) => void;
}

export function BatchPreview({
  files,
  isProcessing,
  onRemove,
}: BatchPreviewProps) {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [cropFileId, setCropFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFiles = useAppStore((s) => s.addFiles);
  const config = useAppStore((s) => s.config);
  const selectedFileId = useAppStore((s) => s.selectedFileId);
  const selectFile = useAppStore((s) => s.selectFile);
  const setCropForFile = useAppStore((s) => s.setCropForFile);
  const watermark = useAppStore((s) => s.watermark);

  // 取得要裁切的檔案
  const cropFile = cropFileId ? files.find((f) => f.id === cropFileId) : null;

  // 處理預覽圖片 - 執行 Pica 處理後顯示最終效果（含浮水印）
  const handlePreviewClick = async (item: BatchFileItem) => {
    setIsPreviewLoading(true);
    // 先設一個暫態以顯示 loading modal
    setPreviewImage("loading");
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

      const previewUrl = createPreviewURL(blob);
      setPreviewImage(previewUrl);
    } catch (error) {
      console.error("預覽處理失敗:", error);
      setPreviewImage(item.previewUrl);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // 關閉預覽時清理 URL
  const handleClosePreview = () => {
    if (
      previewImage &&
      previewImage !== "loading" &&
      !files.some((f) => f.previewUrl === previewImage)
    ) {
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
    // 重置 input 以允許重複選擇相同檔案
    if (e.target) e.target.value = "";
  };

  // 2 張或以上圖片時，桌面版使用清單模式
  // 使用 CSS 來處理響應式，這裡返回兩種 View
  if (files.length >= 2) {
    return (
      <>
        {/* 桌面版：清單模式 */}
        <div className="hidden h-full lg:col-span-8 lg:block">
          <BatchListView
            files={files}
            isProcessing={isProcessing}
            selectedFileId={selectedFileId}
            onRemove={onRemove}
            onSelect={selectFile}
          />
        </div>

        {/* 手機版：卡片模式 */}
        <div className="col-span-full lg:hidden">
          <MobileCardView
            files={files}
            isProcessing={isProcessing}
            onRemove={onRemove}
            onSelect={selectFile}
            selectedFileId={selectedFileId}
            fileInputRef={fileInputRef}
            handleAddMore={handleAddMore}
            previewImage={previewImage}
            isPreviewLoading={isPreviewLoading}
            onPreviewClick={handlePreviewClick}
            onClosePreview={handleClosePreview}
            onCropClick={setCropFileId}
            onCropReset={(id) => setCropForFile(id, undefined)}
            fitMode={config.fitMode}
            t={t}
          />
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
      </>
    );
  }

  // 單張圖片或預設：使用原本的卡片模式
  return (
    <>
      <MobileCardView
        files={files}
        isProcessing={isProcessing}
        onRemove={onRemove}
        onSelect={selectFile}
        selectedFileId={selectedFileId}
        fileInputRef={fileInputRef}
        handleAddMore={handleAddMore}
        previewImage={previewImage}
        isPreviewLoading={isPreviewLoading}
        onPreviewClick={handlePreviewClick}
        onClosePreview={handleClosePreview}
        onCropClick={setCropFileId}
        onCropReset={(id) => setCropForFile(id, undefined)}
        fitMode={config.fitMode}
        t={t}
      />

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
    </>
  );
}

// 抽取原本的卡片模式為獨立元件
interface MobileCardViewProps {
  files: BatchFileItem[];
  isProcessing: boolean;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  selectedFileId: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleAddMore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
  isPreviewLoading: boolean;
  onPreviewClick: (item: BatchFileItem) => void;
  onClosePreview: () => void;
  onCropClick: (id: string) => void;
  onCropReset: (id: string) => void;
  fitMode: string;
  t: ReturnType<typeof useTranslation>["t"];
}

function MobileCardView({
  files,
  isProcessing,
  onRemove,
  onSelect,
  selectedFileId,
  fileInputRef,
  handleAddMore,
  previewImage,
  isPreviewLoading,
  onPreviewClick,
  onClosePreview,
  onCropClick,
  onCropReset,
  fitMode,
  t,
}: MobileCardViewProps) {
  return (
    <div className="scrollbar-hide h-full overflow-y-auto border-b border-slate-200 bg-slate-100/50 lg:col-span-8 lg:border-r lg:border-b-0">
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
      <Modal isOpen={previewImage !== null} onClose={onClosePreview}>
        {isPreviewLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : previewImage && previewImage !== "loading" ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewImage}
            alt="Preview"
            className="h-auto max-h-[70vh] w-full object-contain"
          />
        ) : null}
      </Modal>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {/* 圖片卡片 */}
          {files.map((item) => {
            const isSelected = selectedFileId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`group relative aspect-video cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${
                  isSelected
                    ? "ring-2 ring-indigo-500"
                    : item.status === "completed"
                      ? "ring-2 ring-green-500"
                      : item.status === "error"
                        ? "ring-2 ring-red-500"
                        : "ring-2 ring-transparent hover:ring-indigo-500"
                }`}
              >
                {/* 圖片 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="h-full w-full object-cover"
                />

                {/* 選中指示器 */}
                {isSelected && (
                  <div className="absolute top-2 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] text-white shadow">
                    {t.batch.selected}
                  </div>
                )}

                {/* Hover 遮罩 - 個別控制 */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  {!isProcessing && item.status === "pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      className="cursor-pointer rounded-full bg-white/90 p-2 transition-colors hover:bg-red-500 hover:text-white"
                      title={t.batch.remove}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {/* 裁切按鈕 */}
                  {!isProcessing &&
                    item.status === "pending" &&
                    fitMode === "cover" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCropClick(item.id);
                          }}
                          className={`cursor-pointer rounded-full p-2 transition-colors ${
                            item.cropData
                              ? "bg-indigo-500 text-white hover:bg-indigo-600"
                              : "bg-white/90 hover:bg-blue-500 hover:text-white"
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
                        {/* 重置裁切按鈕 */}
                        {item.cropData && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCropReset(item.id);
                            }}
                            className="cursor-pointer rounded-full bg-white/90 p-1.5 text-slate-500 transition-colors hover:bg-red-500 hover:text-white"
                            title={t.controls.cropReset}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewClick(item);
                    }}
                    className="cursor-pointer rounded-full bg-white/90 p-2 transition-colors hover:bg-indigo-500 hover:text-white"
                    title={t.batch.preview}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                {/* 狀態指示器 */}
                {item.status === "processing" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                      <span className="text-xs text-white">
                        {t.batch.processing}
                      </span>
                    </div>
                  </div>
                )}

                {item.status === "completed" && (
                  <div className="absolute top-2 right-2 rounded bg-green-500 px-2 py-1 text-xs text-white shadow-lg">
                    ✓ {t.batch.done}
                  </div>
                )}

                {/* 若有多尺寸輸出，顯示下載按鈕群 */}
                {item.resultVariants && item.resultVariants.length > 0 && (
                  <div className="absolute right-2 bottom-2 flex flex-col gap-1">
                    {item.resultVariants.map((v) => (
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
                        className="flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-[10px] text-white shadow"
                        title={`Download ${v.width}×${v.height}`}
                      >
                        <Download className="h-3 w-3" /> {v.width}
                      </button>
                    ))}
                  </div>
                )}

                {item.status === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                    <div className="rounded bg-white px-3 py-1.5 text-xs text-red-700 shadow-lg">
                      {item.error || t.batch.failed}
                    </div>
                  </div>
                )}

                {/* 尺寸資訊 */}
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white tabular-nums backdrop-blur-sm">
                  {item.file.name.split(".")[0]}
                </span>
              </div>
            );
          })}

          {/* 加入更多按鈕 */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-500"
          >
            <Plus className="mb-1 h-8 w-8" />
            <span className="text-xs font-medium">{t.upload.addMore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
