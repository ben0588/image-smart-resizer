/**
 * App Store - Zustand State Management
 * 管理圖片上傳、調整、轉換等狀態
 * 符合專案規格定義的 AppState
 */

import { create } from 'zustand';
import type { AppState } from '@/src/types';
import {
  resizeImage,
  createPreviewURL,
  revokePreviewURL,
  convertSvgToPngSizes,
} from '@/src/lib/engine/processor';

const useAppStore = create<AppState>((set, get) => ({
  // === 狀態 ===
  sourceFile: null,
  sourcePreviewUrl: null,
  originalDimensions: null,

  batchFiles: [],
  isBatchMode: false,

  isProcessing: false,
  resultBlob: null,
  resultPreviewUrl: null,

  config: {
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    aspectRatio: 4 / 3,
    format: 'image/webp',
    quality: 0.85, // 85%
  },

  error: null,

  // === Actions ===

  /**
   * 設定原始檔案並讀取圖片資訊
   */
  setSourceFile: (file: File) => {
    const state = get();

    // 清理舊的預覽 URL
    if (state.sourcePreviewUrl) {
      revokePreviewURL(state.sourcePreviewUrl);
    }
    if (state.resultPreviewUrl) {
      revokePreviewURL(state.resultPreviewUrl);
    }

    // 建立預覽 URL
    const previewUrl = createPreviewURL(file);

    // 讀取圖片尺寸
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      set({
        originalDimensions: {
          width: img.naturalWidth,
          height: img.naturalHeight,
        },
        config: {
          ...state.config,
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio,
          // 保留 format 和 quality 設定，不重置
        },
      });
    };
    img.src = previewUrl;

    set({
      sourceFile: file,
      sourcePreviewUrl: previewUrl,
      resultBlob: null,
      resultPreviewUrl: null,
      error: null,
    });
  },

  /**
   * 更新設定 (支援部分更新)
   * 若 maintainAspectRatio 為 true，自動計算對應尺寸
   */
  updateConfig: (partial: Partial<AppState['config']>) => {
    const state = get();
    const newConfig = { ...state.config, ...partial };

    // 如果鎖定長寬比且修改了寬度或高度
    if (newConfig.maintainAspectRatio && newConfig.aspectRatio) {
      if (partial.width !== undefined && partial.height === undefined) {
        // 根據寬度計算高度
        newConfig.height = Math.round(partial.width / newConfig.aspectRatio);
      } else if (partial.height !== undefined && partial.width === undefined) {
        // 根據高度計算寬度
        newConfig.width = Math.round(partial.height * newConfig.aspectRatio);
      }
    }

    set({ config: newConfig });
  },

  /**
   * 執行圖片處理
   */
  processImage: async () => {
    const state = get();
    const { sourceFile, config } = state;

    if (!sourceFile) {
      set({ error: '請先上傳圖片' });
      return;
    }

    set({ isProcessing: true, error: null });

    try {
      // 清理舊的處理結果
      if (state.resultPreviewUrl) {
        revokePreviewURL(state.resultPreviewUrl);
      }

      // 執行圖片處理
      const blob = await resizeImage(sourceFile, {
        width: config.width,
        height: config.height,
        format: config.format,
        quality: config.quality,
      });

      // 建立預覽 URL
      const previewUrl = createPreviewURL(blob);

      set({
        resultBlob: blob,
        resultPreviewUrl: previewUrl,
        isProcessing: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '處理圖片時發生錯誤',
        isProcessing: false,
      });
    }
  },

  /**
   * 重置所有狀態（保留使用者選擇的格式和品質設定）
   */
  reset: () => {
    const state = get();

    // 清理預覽 URL
    if (state.sourcePreviewUrl) {
      revokePreviewURL(state.sourcePreviewUrl);
    }
    if (state.resultPreviewUrl) {
      revokePreviewURL(state.resultPreviewUrl);
    }

    // 清理批次檔案預覽
    state.batchFiles.forEach((item) => {
      revokePreviewURL(item.previewUrl);
    });

    // 保留使用者最後選擇的格式和品質
    const { format, quality } = state.config;

    set({
      sourceFile: null,
      sourcePreviewUrl: null,
      originalDimensions: null,
      batchFiles: [],
      isBatchMode: false,
      isProcessing: false,
      resultBlob: null,
      resultPreviewUrl: null,
      config: {
        width: 800,
        height: 600,
        maintainAspectRatio: true,
        aspectRatio: 4 / 3,
        format, // 保留上次選擇的格式
        quality, // 保留上次選擇的品質
      },
      error: null,
    });
  },

  // === 批次處理 Actions ===

  /**
   * 新增多個檔案到批次處理列表
   */
  addFiles: (files: File[]) => {
    const state = get();
    
    // 如果只有一個檔案且目前不在批次模式，使用單檔案模式
    if (files.length === 1 && !state.isBatchMode && state.batchFiles.length === 0) {
      get().setSourceFile(files[0]);
      return;
    }

    // 清理舊資料（僅在首次進入批次模式時）
    if (state.sourcePreviewUrl && !state.isBatchMode) {
      revokePreviewURL(state.sourcePreviewUrl);
    }

    // 建立批次檔案項目
    const newBatchFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: createPreviewURL(file),
      status: 'pending' as const,
    }));

    set({
      batchFiles: [...state.batchFiles, ...newBatchFiles],
      isBatchMode: true,
      sourceFile: null,
      sourcePreviewUrl: null,
    });
  },

  /**
   * 從批次列表移除檔案
   */
  removeFile: (id: string) => {
    const state = get();
    const item = state.batchFiles.find((f) => f.id === id);
    
    if (item) {
      revokePreviewURL(item.previewUrl);
    }

    const updatedFiles = state.batchFiles.filter((f) => f.id !== id);

    // 如果沒有檔案了，退出批次模式
    if (updatedFiles.length === 0) {
      set({ batchFiles: [], isBatchMode: false });
    } else {
      set({ batchFiles: updatedFiles });
    }
  },

  /**
   * 批次處理所有檔案
   */
  processBatch: async () => {
    const state = get();
    const { config, batchFiles } = state;

    if (batchFiles.length === 0) {
      set({ error: '沒有檔案需要處理' });
      return;
    }

    set({ isProcessing: true, error: null });

    try {
      // 逐一處理每個檔案
      for (let i = 0; i < batchFiles.length; i++) {
        const item = batchFiles[i];

        // 更新狀態為處理中
        set((state) => ({
          batchFiles: state.batchFiles.map((f) =>
            f.id === item.id ? { ...f, status: 'processing' as const } : f
          ),
        }));

        try {
          // 讀取圖片尺寸
          const img = new Image();
          const previewUrl = item.previewUrl;

          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('載入圖片失敗'));
            img.src = previewUrl;
          });

          // 若為 SVG，產生常見尺寸的 PNG 變體
          if (item.file.type === 'image/svg+xml') {
            const sizes = [48, 180, 192, 512];
            const variants = await convertSvgToPngSizes(item.file, sizes, 'image/png', 1);

            // 建立 object URLs 可供下載/預覽
            const variantsWithUrls = variants.map((v) => ({
              width: v.width,
              height: v.height,
              blob: v.blob,
              url: createPreviewURL(v.blob),
              filename: undefined,
            }));

            // 更新狀態為完成 (含多個變體)
            set((state) => ({
              batchFiles: state.batchFiles.map((f) =>
                f.id === item.id
                  ? { ...f, status: 'completed' as const, resultVariants: variantsWithUrls }
                  : f
              ),
            }));
          } else {
            // 使用設定的尺寸或原始尺寸
            const width = config.width || img.naturalWidth;
            const height = config.height || img.naturalHeight;

            // 處理圖片
            const blob = await resizeImage(item.file, {
              width,
              height,
              format: config.format,
              quality: config.quality,
            });

            // 更新狀態為完成
            set((state) => ({
              batchFiles: state.batchFiles.map((f) =>
                f.id === item.id
                  ? { ...f, status: 'completed' as const, resultBlob: blob }
                  : f
              ),
            }));
          }
        } catch (error) {
          // 更新狀態為錯誤
          set((state) => ({
            batchFiles: state.batchFiles.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    status: 'error' as const,
                    error: error instanceof Error ? error.message : '處理失敗',
                  }
                : f
            ),
          }));
        }
      }

      set({ isProcessing: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '批次處理時發生錯誤',
        isProcessing: false,
      });
    }
  },
}));

export default useAppStore;
