/**
 * BatchListView - 批次圖片清單檢視元件
 * 專為桌面版設計的 Table/List View
 * 顯示詳細資訊：縮圖、檔名、尺寸、格式、原始/壓縮大小
 */

'use client';

import React, { useState, useRef } from 'react';
import { 
  Loader2, 
  Eye, 
  Plus, 
  Download,
  Trash2,
  Check,
  ArrowRight,
} from 'lucide-react';
import type { BatchFileItem } from '@/src/types';
import { useTranslation } from '@/src/hooks/useTranslation';
import { downloadImage } from '@/src/lib/engine/processor';
import { replaceExtension, formatFileSize, validateImageFile } from '@/src/lib/utils';
import { Modal } from '@/src/components/ui/Modal';
import useAppStore from '@/src/store/use-app-store';

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
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/svg+xml': 'SVG',
    'image/gif': 'GIF',
  };
  return map[type] || type.split('/')[1]?.toUpperCase() || 'Unknown';
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFiles = useAppStore((s) => s.addFiles);
  const config = useAppStore((s) => s.config);

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
    if (e.target) e.target.value = '';
  };

  return (
    <div className="lg:col-span-8 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-200 h-full overflow-hidden flex flex-col">
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
      <Modal isOpen={previewImage !== null} onClose={() => setPreviewImage(null)}>
        {previewImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        )}
      </Modal>

      {/* 標題列 */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.upload.addMore}
        </button>
      </div>

      {/* 表頭 */}
      <div className="hidden lg:grid grid-cols-12 gap-2 px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <div className="col-span-1"></div>
        <div className="col-span-4">{t.batch.filename}</div>
        <div className="col-span-2 text-center">{t.batch.dimensions}</div>
        <div className="col-span-1 text-center">{t.batch.format}</div>
        <div className="col-span-3 text-center">{t.batch.originalSize} → {t.batch.compressedSize}</div>
        <div className="col-span-1"></div>
      </div>

      {/* 檔案列表 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {files.map((item) => {
          const isSelected = selectedFileId === item.id;
          const isHovered = hoveredId === item.id;
          const originalSize = item.file.size;
          const estimatedSize = item.estimatedSize;
          const reduction = estimatedSize 
            ? Math.round((1 - estimatedSize / originalSize) * 100)
            : null;

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                grid grid-cols-12 gap-2 px-4 py-3 items-center cursor-pointer transition-all border-b border-slate-100
                ${isSelected 
                  ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-500' 
                  : 'hover:bg-slate-50'
                }
                ${item.status === 'completed' ? 'bg-green-50/50' : ''}
                ${item.status === 'error' ? 'bg-red-50/50' : ''}
              `}
            >
              {/* 縮圖 */}
              <div className="col-span-1 relative">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 狀態指示器 */}
                {item.status === 'processing' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
                {item.status === 'completed' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* 檔案名稱 */}
              <div className="col-span-4">
                <p className="text-sm font-medium text-slate-800 truncate" title={item.file.name}>
                  {item.file.name}
                </p>
                {isSelected && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 font-medium mt-0.5">
                    <Check className="w-3 h-3" /> {t.batch.selected}
                  </span>
                )}
                {item.status === 'error' && (
                  <p className="text-xs text-red-500 mt-0.5">{item.error || t.batch.failed}</p>
                )}
              </div>

              {/* 尺寸 */}
              <div className="col-span-2 text-center">
                {item.originalDimensions ? (
                  <span className="text-xs font-mono text-slate-600 tabular-nums">
                    {item.originalDimensions.width}×{item.originalDimensions.height}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </div>

              {/* 格式 */}
              <div className="col-span-1 text-center">
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {getFileFormat(item.file)}
                </span>
              </div>

              {/* 大小 (原始 → 壓縮後) */}
              <div className="col-span-3 text-center flex items-center justify-center gap-1.5">
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {formatFileSize(originalSize)}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                {item.isEstimating ? (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </span>
                ) : estimatedSize !== undefined ? (
                  <span className="text-xs font-mono font-semibold text-green-600 tabular-nums">
                    {formatFileSize(estimatedSize)}
                    {reduction !== null && reduction > 0 && (
                      <span className="ml-1 text-green-500">(-{reduction}%)</span>
                    )}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </div>

              {/* 操作按鈕 */}
              <div className="col-span-1 flex items-center justify-end gap-1">
                {(isHovered || isSelected) && !isProcessing && item.status === 'pending' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(item.previewUrl);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title={t.batch.preview}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title={t.batch.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* 已完成項目的下載按鈕 */}
                {item.status === 'completed' && item.resultBlob && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const filename = replaceExtension(
                        item.file.name,
                        config.format,
                        config.width,
                        config.height
                      );
                      downloadImage(item.resultBlob!, filename);
                    }}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                    title={t.controls.download}
                  >
                    <Download className="w-4 h-4" />
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
                          const filename = replaceExtension(item.file.name, 'image/png', v.width, v.height);
                          downloadImage(v.blob, filename);
                        }}
                        className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors cursor-pointer"
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
          className={`
            flex items-center justify-center gap-2 py-4 
            border-2 border-dashed rounded-lg m-4 
            transition-colors cursor-pointer
            ${isDragOver 
              ? 'border-indigo-400 bg-indigo-50 text-indigo-600' 
              : 'border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-500'
            }
          `}
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">{t.upload.dropHere}</span>
        </div>
      </div>
    </div>
  );
}
