/**
 * BatchPreview - 批次圖片預覽元件
 * 響應式設計：
 * - Desktop (>= 2 張圖片): Table/List View (BatchListView)
 * - Mobile: Card/Grid View
 * 設計理念：Gestalt Proximity + Visual Anchor
 */

'use client';

import React, { useState, useRef } from 'react';
import { Loader2, X, Eye, Plus, Download } from 'lucide-react';
import type { BatchFileItem } from '@/src/types';
import { useTranslation } from '@/src/hooks/useTranslation';
import { downloadImage } from '@/src/lib/engine/processor';
import { replaceExtension, validateImageFile } from '@/src/lib/utils';
import { Modal } from '@/src/components/ui/Modal';
import useAppStore from '@/src/store/use-app-store';
import { BatchListView } from './BatchListView';

interface BatchPreviewProps {
  files: BatchFileItem[];
  isProcessing: boolean;
  onRemove: (id: string) => void;
}

export function BatchPreview({ files, isProcessing, onRemove }: BatchPreviewProps) {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFiles = useAppStore((s) => s.addFiles);
  const selectedFileId = useAppStore((s) => s.selectedFileId);
  const selectFile = useAppStore((s) => s.selectFile);

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
    if (e.target) e.target.value = '';
  };

  // 2 張或以上圖片時，桌面版使用清單模式
  // 使用 CSS 來處理響應式，這裡返回兩種 View
  if (files.length >= 2) {
    return (
      <>
        {/* 桌面版：清單模式 */}
        <div className="hidden lg:block lg:col-span-8 h-full">
          <BatchListView
            files={files}
            isProcessing={isProcessing}
            selectedFileId={selectedFileId}
            onRemove={onRemove}
            onSelect={selectFile}
          />
        </div>

        {/* 手機版：卡片模式 */}
        <div className="lg:hidden col-span-full">
          <MobileCardView
            files={files}
            isProcessing={isProcessing}
            onRemove={onRemove}
            onSelect={selectFile}
            selectedFileId={selectedFileId}
            fileInputRef={fileInputRef}
            handleAddMore={handleAddMore}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            t={t}
          />
        </div>
      </>
    );
  }

  // 單張圖片或預設：使用原本的卡片模式
  return (
    <MobileCardView
      files={files}
      isProcessing={isProcessing}
      onRemove={onRemove}
      onSelect={selectFile}
      selectedFileId={selectedFileId}
      fileInputRef={fileInputRef}
      handleAddMore={handleAddMore}
      previewImage={previewImage}
      setPreviewImage={setPreviewImage}
      t={t}
    />
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
  setPreviewImage: (url: string | null) => void;
  t: ReturnType<typeof useTranslation>['t'];
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
  setPreviewImage,
  t,
}: MobileCardViewProps) {
  return (
    <div className="lg:col-span-8 bg-slate-100/50 border-b lg:border-b-0 lg:border-r border-slate-200 h-full overflow-y-auto scrollbar-hide">
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

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* 圖片卡片 */}
          {files.map((item) => {
            const isSelected = selectedFileId === item.id;
            
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`group relative aspect-video rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-indigo-500'
                    : item.status === 'completed'
                    ? 'ring-2 ring-green-500'
                    : item.status === 'error'
                    ? 'ring-2 ring-red-500'
                    : 'ring-2 ring-transparent hover:ring-indigo-500'
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
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded shadow">
                    {t.batch.selected}
                  </div>
                )}

                {/* Hover 遮罩 - 個別控制 */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!isProcessing && item.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      className="p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full transition-colors cursor-pointer"
                      title={t.batch.remove}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(item.previewUrl);
                    }}
                    className="p-2 bg-white/90 hover:bg-indigo-500 hover:text-white rounded-full transition-colors cursor-pointer"
                    title={t.batch.preview}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* 狀態指示器 */}
                {item.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                      <span className="text-xs text-white">{t.batch.processing}</span>
                    </div>
                  </div>
                )}

                {item.status === 'completed' && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                    ✓ {t.batch.done}
                  </div>
                )}

                {/* 若有多尺寸輸出，顯示下載按鈕群 */}
                {item.resultVariants && item.resultVariants.length > 0 && (
                  <div className="absolute bottom-2 right-2 flex flex-col gap-1">
                    {item.resultVariants.map((v) => (
                      <button
                        key={`${item.id}-${v.width}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const filename = replaceExtension(item.file.name, 'image/png', v.width, v.height);
                          downloadImage(v.blob, filename);
                        }}
                        className="bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 shadow"
                        title={`Download ${v.width}×${v.height}`}
                      >
                        <Download className="w-3 h-3" /> {v.width}
                      </button>
                    ))}
                  </div>
                )}

                {item.status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <div className="text-xs text-red-700 bg-white px-3 py-1.5 rounded shadow-lg">
                      {item.error || t.batch.failed}
                    </div>
                  </div>
                )}

                {/* 尺寸資訊 */}
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm font-mono tabular-nums">
                  {item.file.name.split('.')[0]}
                </span>
              </div>
            );
          })}

          {/* 加入更多按鈕 */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors bg-slate-50/50 cursor-pointer aspect-video"
          >
            <Plus className="w-8 h-8 mb-1" />
            <span className="text-xs font-medium">{t.upload.addMore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
