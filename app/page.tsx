/**
 * Smart Resizer - 主頁面
 * 圖片智慧調整工具 - 符合專案規格定義
 * 設計理念：高效、純淨、隱私
 */

'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { toast } from 'react-toastify';
import useAppStore from '@/src/store/use-app-store';
import { downloadImage, downloadBatchAsZip } from '@/src/lib/engine/processor';
import { replaceExtension } from '@/src/lib/utils';
import { useTranslation } from '@/src/hooks/useTranslation';
import UploadZone from '@/src/components/feature/UploadZone';
import ControlPanel from '@/src/components/feature/ControlPanel';
import ImagePreview from '@/src/components/feature/ImagePreview';
import { BatchPreview } from '@/src/components/feature/BatchPreview';
import { LanguageSelector } from '@/src/components/feature/LanguageSelector';

export default function SmartResizer() {
  const { t } = useTranslation();

  // Zustand Store
  const {
    sourceFile,
    sourcePreviewUrl,
    resultPreviewUrl,
    originalDimensions,
    batchFiles,
    isBatchMode,
    config,
    isProcessing,
    error,
    setSourceFile,
    updateConfig,
    processImage,
    processBatch,
    removeFile,
    reset,
  } = useAppStore();

  // 處理下載
  const handleDownload = async () => {
    // 批次模式
    if (isBatchMode) {
      await processBatch();
      
      const state = useAppStore.getState();
      const completedFiles = state.batchFiles.filter((f) => f.status === 'completed');

      if (completedFiles.length === 0) {
        toast.error('沒有成功處理的檔案');
        return;
      }

      // 收集所有要下載的檔案（含 SVG 變體）
      const allDownloads: Array<{ blob: Blob; filename: string }> = [];

      completedFiles.forEach((item) => {
        // 若有多個變體（SVG→PNG），加入所有變體
        if (item.resultVariants && item.resultVariants.length > 0) {
          item.resultVariants.forEach((variant) => {
            const filename = replaceExtension(
              item.file.name,
              'image/png',
              variant.width,
              variant.height
            );
            allDownloads.push({ blob: variant.blob, filename });
          });
        } else if (item.resultBlob) {
          // 單一處理結果
          const filename = replaceExtension(
            item.file.name,
            config.format,
            config.width,
            config.height
          );
          allDownloads.push({ blob: item.resultBlob, filename });
        }
      });

      // 超過 2 個檔案使用 ZIP 打包（避免瀏覽器跳出多次下載權限通知）
      if (allDownloads.length > 2) {
        await downloadBatchAsZip(allDownloads, 'resized-images.zip');
        toast.success(`已打包 ${allDownloads.length} 個檔案為 ZIP 下載`);
      } else {
        // 1-2 個檔案直接逐一下載
        allDownloads.forEach((file) => {
          downloadImage(file.blob, file.filename);
        });
        toast.success(t.batch.completed);
      }
      return;
    }

    // 單檔案模式
    if (!resultPreviewUrl) {
      await processImage();
    }

    const state = useAppStore.getState();
    if (state.resultBlob && sourceFile) {
      const newFilename = replaceExtension(
        sourceFile.name,
        config.format,
        config.width,
        config.height
      );
      downloadImage(state.resultBlob, newFilename);
      
      // 顯示成功提示
      toast.success(t.controls.download + ' ✓');
    }
  };

  // 判斷是否顯示編輯器
  const showEditor = sourceFile !== null || isBatchMode;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-20">
      {/* 語言選擇器 */}
      <LanguageSelector />
      
      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                {t.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                {t.subtitle}
              </p>
            </div>
          </div>
        </header>

        {/* 核心卡片區塊 */}
        <main className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-500">
          {/* 上傳區 */}
          {!showEditor && <UploadZone onFileSelect={setSourceFile} />}

          {/* 編輯器 */}
          {showEditor && (
            <div className="grid grid-cols-1 lg:grid-cols-12" style={{minHeight: '600px'}}>
              {/* Left: 圖片預覽 */}
              {isBatchMode ? (
                <BatchPreview
                  files={batchFiles}
                  isProcessing={isProcessing}
                  onRemove={removeFile}
                />
              ) : (
                sourcePreviewUrl && (
                  <ImagePreview
                    src={resultPreviewUrl || sourcePreviewUrl}
                    originalDimensions={originalDimensions}
                    fileSize={sourceFile?.size}
                    isProcessing={isProcessing}
                  />
                )
              )}

              {/* Right: 控制面板 */}
              <ControlPanel
                config={config}
                isProcessing={isProcessing}
                error={error}
                onConfigChange={updateConfig}
                onReset={reset}
                onDownload={handleDownload}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>{t.footer.copyright}</p>
        </footer>
      </div>
    </div>
  );
}
