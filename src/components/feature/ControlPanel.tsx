/**
 * ControlPanel - 控制面板元件
 * Feature Component - 模式切換容器
 * 整合 CustomSizeControls 與 AppIconControls
 */

"use client";

import React, { useEffect } from "react";
import {
  ImageIcon,
  Download,
  Loader2,
  Package,
  Sparkles,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import type { ControlPanelProps } from "@/src/types";
import { formatFileSize } from "@/src/lib/utils";
import { useResizeHistory } from "@/src/hooks/useLocalStorage";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useDebounce } from "@/src/hooks/useDebounce";
import useAppStore from "@/src/store/use-app-store";
import CustomSizeControls from "./CustomSizeControls";
import AppIconControls from "./AppIconControls";

export default function ControlPanel({
  config,
  isProcessing,
  error,
  onConfigChange,
  onReset,
  onDownload,
}: ControlPanelProps) {
  const { t } = useTranslation();
  const { addHistory } = useResizeHistory();

  // 從 store 取得模式相關狀態
  const editorMode = useAppStore((s) => s.editorMode);
  const setEditorMode = useAppStore((s) => s.setEditorMode);
  const sourceFile = useAppStore((s) => s.sourceFile);
  const isBatchMode = useAppStore((s) => s.isBatchMode);
  const batchFiles = useAppStore((s) => s.batchFiles);
  const selectedFileId = useAppStore((s) => s.selectedFileId);
  const estimatedSize = useAppStore((s) => s.estimatedSize);
  const estimateSizeAction = useAppStore((s) => s.estimateSize);
  const appIconState = useAppStore((s) => s.appIconState);

  // 決定目前操作的檔案
  const currentFile = isBatchMode
    ? batchFiles.find((f) => f.id === selectedFileId)?.file ||
      batchFiles[0]?.file
    : sourceFile;

  // 使用 debounce 監聽品質變化（僅自訂模式 + 單檔案模式）
  const debouncedQuality = useDebounce(config.quality, 400);
  const debouncedWidth = useDebounce(config.width, 400);
  const debouncedHeight = useDebounce(config.height, 400);
  const debouncedFormat = useDebounce(config.format, 400);

  useEffect(() => {
    if (currentFile && !isBatchMode && editorMode === "custom") {
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
    editorMode,
    estimateSizeAction,
  ]);

  // 批次相關計算
  const batchTotalEstimatedSize = isBatchMode
    ? batchFiles.reduce((sum, f) => sum + (f.estimatedSize || 0), 0)
    : 0;
  const allBatchFilesEstimated =
    isBatchMode &&
    batchFiles.length > 0 &&
    batchFiles.every((f) => f.estimatedSize !== undefined && !f.isEstimating);

  // 處理下載並記錄歷史
  const handleDownload = () => {
    if (editorMode === "custom") {
      addHistory(config.width, config.height);
    }
    onDownload();
  };

  return (
    <div className="flex h-full flex-col bg-white p-6 lg:col-span-4 lg:p-8">
      {/* 模式切換器 */}
      <div className="mb-6">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setEditorMode("custom")}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-all ${
              editorMode === "custom"
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            {t.appIcon?.customMode || "自訂尺寸"}
          </button>
          <button
            onClick={() => setEditorMode("app-icon")}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-all ${
              editorMode === "app-icon"
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            {t.appIcon?.appIconMode || "App 圖示"}
          </button>
        </div>
      </div>

      {/* 根據模式渲染不同的控制項 */}
      {editorMode === "custom" ? (
        <CustomSizeControls
          config={config}
          error={error}
          onConfigChange={onConfigChange}
          onReset={onReset}
        />
      ) : (
        <>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <AppIconControls />
        </>
      )}

      {/* 下載按鈕 - 共用 */}
      <div className="mt-auto border-t border-slate-100 pt-4">
        <button
          onClick={handleDownload}
          disabled={
            isProcessing ||
            appIconState.isProcessing ||
            (editorMode === "custom" && !config.width) ||
            (editorMode === "custom" && !config.height) ||
            (editorMode === "app-icon" &&
              appIconState.selectedPlatforms.length === 0)
          }
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-medium text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing || appIconState.isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t.controls.processing}
            </>
          ) : editorMode === "app-icon" ? (
            <>
              <Package className="h-5 w-5" />
              {t.appIcon?.generateAndDownload || "產生並下載圖示"}
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
