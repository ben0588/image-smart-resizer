/**
 * App Store - Zustand State Management
 * 管理圖片上傳、調整、轉換等狀態
 * 符合專案規格定義的 AppState
 */

import { create } from "zustand";
import type { AppState, AppIconPlatform } from "@/src/types";
import {
  resizeImage,
  createPreviewURL,
  revokePreviewURL,
  convertSvgToPngSizes,
  checkCanvasPermission,
  loadWatermarkDataUrl,
} from "@/src/lib/engine/processor";
import { APP_ICON_PLATFORMS } from "@/src/lib/app-icon-presets";

const useAppStore = create<AppState>((set, get) => ({
  // === 狀態 ===
  sourceFile: null,
  sourcePreviewUrl: null,
  originalDimensions: null,

  batchFiles: [],
  isBatchMode: false,
  selectedFileId: null,

  isProcessing: false,
  resultBlob: null,
  resultPreviewUrl: null,

  // 預估大小狀態
  estimatedSize: null,
  isEstimating: false,

  config: {
    width: 1200,
    height: 630,
    maintainAspectRatio: true,
    aspectRatio: 4 / 3,
    format: "image/webp",
    quality: 0.85, // 85%
    fitMode: "cover", // 預設為裁切填滿
  },

  // 單張模式的自訂裁切區域
  customCrop: null as import("@/src/types").CropArea | null,
  // 單張模式的完整裁切資料（用於恢復 UI 狀態）
  cropData: null as import("@/src/types").CropData | null,

  // 浮水印設定
  watermark: {
    file: null,
    previewUrl: null,
    position: "bottom-right" as import("@/src/types").WatermarkPosition,
    size: 0.15,
    margin: 20,
    opacity: 0, // 透明度 0% = 完全不透明
    customPosition: null,
  } as import("@/src/types").WatermarkConfig,

  error: null,

  // Canvas 權限 Modal 狀態
  showCanvasPermissionModal: false,

  // 編輯器模式
  editorMode: "custom",

  // App 圖示模式狀態
  appIconState: {
    selectedPlatforms: ["ios", "android", "web"] as AppIconPlatform[],
    results: {},
    isProcessing: false,
  },

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
   * 當設定變更時，重置批次檔案的處理狀態（允許重新下載）
   */
  updateConfig: (partial: Partial<AppState["config"]>) => {
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

    // 當設定變更時，重置批次檔案的處理狀態（讓使用者可以重新下載）
    const resetBatchFiles = state.batchFiles.map((f) => ({
      ...f,
      status: "pending" as const,
      resultBlob: undefined,
      resultVariants: undefined,
      estimatedSize: undefined,
      isEstimating: false,
      error: undefined,
      // 如果尺寸變更，清除自訂裁切
      customCrop:
        partial.width !== undefined || partial.height !== undefined
          ? undefined
          : f.customCrop,
      cropData:
        partial.width !== undefined || partial.height !== undefined
          ? undefined
          : f.cropData,
    }));

    // 如果尺寸變更，也清除單張模式的 customCrop 和 cropData
    const shouldResetCrop =
      partial.width !== undefined || partial.height !== undefined;

    set({
      config: newConfig,
      batchFiles: state.isBatchMode ? resetBatchFiles : state.batchFiles,
      // 也清除單檔案模式的處理結果
      resultBlob: null,
      resultPreviewUrl: state.resultPreviewUrl
        ? (revokePreviewURL(state.resultPreviewUrl), null)
        : null,
      // 尺寸變更時清除 customCrop 和 cropData
      customCrop: shouldResetCrop ? null : state.customCrop,
      cropData: shouldResetCrop ? null : state.cropData,
    });
  },

  /**
   * 執行圖片處理
   */
  processImage: async () => {
    const state = get();
    const { sourceFile, config } = state;

    if (!sourceFile) {
      set({ error: "請先上傳圖片" });
      return;
    }

    // 驗證尺寸
    if (
      !config.width ||
      !config.height ||
      config.width <= 0 ||
      config.height <= 0
    ) {
      set({ error: "請輸入有效的圖片尺寸", isProcessing: false });
      return;
    }

    // 檢查 Canvas 權限（防止 Brave 等瀏覽器的指紋保護）
    if (!checkCanvasPermission()) {
      set({
        showCanvasPermissionModal: true,
        isProcessing: false,
      });
      return;
    }

    set({ isProcessing: true, error: null });

    try {
      // 清理舊的處理結果
      if (state.resultPreviewUrl) {
        revokePreviewURL(state.resultPreviewUrl);
      }

      // 執行圖片處理（含浮水印）
      const watermarkOpt = state.watermark.file
        ? {
            imageData: await loadWatermarkDataUrl(state.watermark.file),
            position: state.watermark.position,
            size: state.watermark.size,
            margin: state.watermark.margin,
            opacity: 1 - state.watermark.opacity, // 透明度轉不透明度
            customPosition: state.watermark.customPosition,
          }
        : undefined;

      const blob = await resizeImage(sourceFile, {
        width: config.width,
        height: config.height,
        format: config.format,
        quality: config.quality,
        fitMode: config.fitMode,
        customCrop: state.customCrop ?? undefined,
        rotation: state.cropData?.rotation ?? 0,
        watermark: watermarkOpt,
      });

      // 建立預覽 URL
      const previewUrl = createPreviewURL(blob);

      set({
        resultBlob: blob,
        resultPreviewUrl: previewUrl,
        isProcessing: false,
      });
    } catch (error) {
      const isPermissionError =
        error instanceof Error && error.message === "CANVAS_PERMISSION_DENIED";
      set({
        error: isPermissionError
          ? null
          : error instanceof Error
            ? error.message
            : "處理圖片時發生錯誤",
        showCanvasPermissionModal: isPermissionError
          ? true
          : get().showCanvasPermissionModal,
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
    if (state.watermark.previewUrl) {
      revokePreviewURL(state.watermark.previewUrl);
    }

    // 清理批次檔案預覽
    state.batchFiles.forEach((item) => {
      revokePreviewURL(item.previewUrl);
    });

    // 保留使用者最後選擇的格式和品質
    const { format, quality, fitMode } = state.config;

    set({
      sourceFile: null,
      sourcePreviewUrl: null,
      originalDimensions: null,
      batchFiles: [],
      isBatchMode: false,
      isProcessing: false,
      resultBlob: null,
      resultPreviewUrl: null,
      customCrop: null, // 重置單張模式裁切
      cropData: null, // 重置完整裁切資料
      watermark: {
        file: null,
        previewUrl: null,
        position: "bottom-right",
        size: 0.15,
        margin: 20,
        opacity: 0,
        customPosition: null,
      },
      config: {
        width: 800,
        height: 600,
        maintainAspectRatio: true,
        aspectRatio: 4 / 3,
        format, // 保留上次選擇的格式
        quality, // 保留上次選擇的品質
        fitMode, // 保留上次選擇的縮放模式
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
    if (
      files.length === 1 &&
      !state.isBatchMode &&
      state.batchFiles.length === 0
    ) {
      get().setSourceFile(files[0]);
      return;
    }

    // 清理舊資料（僅在首次進入批次模式時）
    if (state.sourcePreviewUrl && !state.isBatchMode) {
      revokePreviewURL(state.sourcePreviewUrl);
    }

    // 建立批次檔案項目
    const newBatchFiles = files.map((file, index) => {
      const previewUrl = createPreviewURL(file);
      const id = Math.random().toString(36).substr(2, 9);
      const isFirstFileInBatch = index === 0 && state.batchFiles.length === 0;

      // 異步讀取圖片尺寸
      const img = new Image();
      img.onload = () => {
        set((s) => ({
          batchFiles: s.batchFiles.map((f) =>
            f.id === id
              ? {
                  ...f,
                  originalDimensions: {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  },
                }
              : f,
          ),
        }));

        // 如果是批次中的第一張圖片，將其尺寸設為 config 預設值
        if (isFirstFileInBatch) {
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const currentConfig = get().config;
          set({
            config: {
              ...currentConfig,
              width: img.naturalWidth,
              height: img.naturalHeight,
              aspectRatio,
              maintainAspectRatio: true,
            },
          });
        }
      };
      img.src = previewUrl;

      return {
        id,
        file,
        previewUrl,
        status: "pending" as const,
      };
    });

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
      set({ error: "沒有檔案需要處理" });
      return;
    }

    // 驗證尺寸
    if (
      !config.width ||
      !config.height ||
      config.width <= 0 ||
      config.height <= 0
    ) {
      set({ error: "請輸入有效的圖片尺寸", isProcessing: false });
      return;
    }

    // 檢查 Canvas 權限（防止 Brave 等瀏覽器的指紋保護）
    if (!checkCanvasPermission()) {
      set({
        showCanvasPermissionModal: true,
        isProcessing: false,
      });
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
            f.id === item.id ? { ...f, status: "processing" as const } : f,
          ),
        }));

        try {
          // 讀取圖片尺寸
          const img = new Image();
          const previewUrl = item.previewUrl;

          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("載入圖片失敗"));
            img.src = previewUrl;
          });

          // 若為 SVG，產生常見尺寸的 PNG 變體
          if (item.file.type === "image/svg+xml") {
            const sizes = [48, 180, 192, 512];
            const variants = await convertSvgToPngSizes(
              item.file,
              sizes,
              "image/png",
              1,
            );

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
                  ? {
                      ...f,
                      status: "completed" as const,
                      resultVariants: variantsWithUrls,
                    }
                  : f,
              ),
            }));
          } else {
            // 使用設定的尺寸或原始尺寸
            const width = config.width || img.naturalWidth;
            const height = config.height || img.naturalHeight;

            // 建構浮水印參數
            const currentWatermark = get().watermark;
            const watermarkOpt = currentWatermark.file
              ? {
                  imageData: await loadWatermarkDataUrl(currentWatermark.file),
                  position: currentWatermark.position,
                  size: currentWatermark.size,
                  margin: currentWatermark.margin,
                  opacity: 1 - currentWatermark.opacity, // 透明度轉不透明度
                  customPosition: currentWatermark.customPosition,
                }
              : undefined;

            // 處理圖片
            const blob = await resizeImage(item.file, {
              width,
              height,
              format: config.format,
              quality: config.quality,
              fitMode: config.fitMode,
              customCrop: item.customCrop,
              rotation: item.cropData?.rotation ?? 0,
              watermark: watermarkOpt,
            });

            // 更新狀態為完成，同時記錄壓縮後大小
            set((state) => ({
              batchFiles: state.batchFiles.map((f) =>
                f.id === item.id
                  ? {
                      ...f,
                      status: "completed" as const,
                      resultBlob: blob,
                      estimatedSize: blob.size,
                    }
                  : f,
              ),
            }));
          }
        } catch (error) {
          const isPermissionError =
            error instanceof Error &&
            error.message === "CANVAS_PERMISSION_DENIED";

          if (isPermissionError) {
            set({ showCanvasPermissionModal: true, isProcessing: false });
            return; // 終止後續處理
          }

          // 更新狀態為錯誤
          set((state) => ({
            batchFiles: state.batchFiles.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    status: "error" as const,
                    error: error instanceof Error ? error.message : "處理失敗",
                  }
                : f,
            ),
          }));
        }
      }

      set({ isProcessing: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "批次處理時發生錯誤",
        isProcessing: false,
      });
    }
  },

  /**
   * 預估壓縮後大小（使用 canvas.toBlob 快速預估）
   * 此方法不觸發下載，僅用於顯示預估大小
   */
  estimateSize: async () => {
    const state = get();
    const { sourceFile, config, isBatchMode, batchFiles, selectedFileId } =
      state;

    // 檢查 Canvas 權限（防止 Brave 等瀏覽器的指紋保護）
    if (!checkCanvasPermission()) {
      set({
        showCanvasPermissionModal: true,
        isEstimating: false,
      });
      return;
    }

    // 決定要預估的檔案
    let targetFile: File | null = null;

    if (isBatchMode) {
      // 批次模式：預估選中的檔案，或第一個檔案
      const targetId = selectedFileId || batchFiles[0]?.id;
      const targetItem = batchFiles.find((f) => f.id === targetId);
      targetFile = targetItem?.file || null;
    } else {
      // 單檔案模式
      targetFile = sourceFile;
    }

    if (!targetFile) {
      set({ estimatedSize: null, isEstimating: false });
      return;
    }

    // 驗證尺寸，防止 0x0 錯誤
    if (
      !config.width ||
      !config.height ||
      config.width <= 0 ||
      config.height <= 0
    ) {
      set({ estimatedSize: null, isEstimating: false });
      return;
    }

    set({ isEstimating: true });

    try {
      // 建構浮水印參數
      const watermarkOpt = state.watermark.file
        ? {
            imageData: await loadWatermarkDataUrl(state.watermark.file),
            position: state.watermark.position,
            size: state.watermark.size,
            margin: state.watermark.margin,
            opacity: 1 - state.watermark.opacity, // 透明度轉不透明度
            customPosition: state.watermark.customPosition,
          }
        : undefined;

      // 使用 resizeImage 進行實際壓縮以取得精確大小
      const blob = await resizeImage(targetFile, {
        width: config.width,
        height: config.height,
        format: config.format,
        quality: config.quality,
        fitMode: config.fitMode,
        customCrop: state.customCrop ?? undefined,
        rotation: state.cropData?.rotation ?? 0,
        watermark: watermarkOpt,
      });

      set({
        estimatedSize: blob.size,
        isEstimating: false,
      });

      // 如果是批次模式，也更新對應檔案的預估大小
      if (isBatchMode && selectedFileId) {
        set((state) => ({
          batchFiles: state.batchFiles.map((f) =>
            f.id === selectedFileId
              ? { ...f, estimatedSize: blob.size, isEstimating: false }
              : f,
          ),
        }));
      }
    } catch (error) {
      const isPermissionError =
        error instanceof Error && error.message === "CANVAS_PERMISSION_DENIED";
      if (isPermissionError) {
        set({ showCanvasPermissionModal: true });
      } else {
        console.error("預估大小失敗:", error);
      }
      set({ estimatedSize: null, isEstimating: false });
    }
  },

  /**
   * 預估所有批次檔案的壓縮後大小
   * 用於多圖模式的「試算所有大小」功能
   */
  estimateAllSizes: async () => {
    const { config, batchFiles } = get();

    // 驗證尺寸
    if (
      !config.width ||
      !config.height ||
      config.width <= 0 ||
      config.height <= 0
    ) {
      return;
    }

    // 檢查 Canvas 權限（防止 Brave 等瀏覽器的指紋保護）

    if (batchFiles.length === 0) return;

    // 先保存要處理的檔案 ID 列表（避免閉包問題）
    const fileIds = batchFiles.map((f) => f.id);

    // 標記所有檔案為計算中
    set((state) => ({
      batchFiles: state.batchFiles.map((f) => ({
        ...f,
        isEstimating: true,
        estimatedSize: undefined,
      })),
    }));

    // 逐一計算每個檔案的預估大小
    for (const fileId of fileIds) {
      // 每次迭代時重新取得最新狀態
      const currentState = get();
      const item = currentState.batchFiles.find((f) => f.id === fileId);

      // 如果檔案已被移除，跳過
      if (!item) continue;

      try {
        // 建構浮水印參數
        const wmState = get().watermark;
        const watermarkOpt = wmState.file
          ? {
              imageData: await loadWatermarkDataUrl(wmState.file),
              position: wmState.position,
              size: wmState.size,
              margin: wmState.margin,
              opacity: wmState.opacity,
              customPosition: wmState.customPosition,
            }
          : undefined;

        const blob = await resizeImage(item.file, {
          width: currentState.config.width,
          height: currentState.config.height,
          format: currentState.config.format,
          quality: currentState.config.quality,
          fitMode: currentState.config.fitMode,
          customCrop: item.customCrop,
          rotation: item.cropData?.rotation ?? 0,
          watermark: watermarkOpt,
        });

        set((state) => ({
          batchFiles: state.batchFiles.map((f) =>
            f.id === fileId
              ? { ...f, estimatedSize: blob.size, isEstimating: false }
              : f,
          ),
        }));
      } catch (error) {
        const isPermissionError =
          error instanceof Error &&
          error.message === "CANVAS_PERMISSION_DENIED";
        if (isPermissionError) {
          set({ showCanvasPermissionModal: true });
          // 標記剩下所有為非計算中
          set((state) => ({
            batchFiles: state.batchFiles.map((f) => ({
              ...f,
              isEstimating: false,
            })),
          }));
          return; // 終止處理
        }

        console.error(`預估檔案 ${item.file.name} 大小失敗:`, error);
        set((state) => ({
          batchFiles: state.batchFiles.map((f) =>
            f.id === fileId
              ? { ...f, estimatedSize: undefined, isEstimating: false }
              : f,
          ),
        }));
      }
    }
  },

  /**
   * 選擇檔案（清單模式使用）
   */
  selectFile: (id: string | null) => {
    const state = get();

    if (id === null) {
      set({ selectedFileId: null });
      return;
    }

    const targetItem = state.batchFiles.find((f) => f.id === id);
    if (!targetItem) return;

    // 讀取選中圖片的尺寸
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      // 使用 get() 取最新的 config，避免閉包捕獲到過時的狀態
      const currentConfig = get().config;

      set({
        selectedFileId: id,
        config: {
          ...currentConfig,
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio,
        },
      });
    };
    img.src = targetItem.previewUrl;

    set({ selectedFileId: id });
  },

  /**
   * 設定批次檔案的自訂裁切資料
   * 儲存完整的 cropData 用於恢復 UI，並提取 cropArea 用於實際裁切
   */
  setCropForFile: (
    id: string,
    cropData: import("@/src/types").CropData | undefined,
  ) => {
    set((state) => ({
      batchFiles: state.batchFiles.map((f) =>
        f.id === id
          ? {
              ...f,
              cropData,
              customCrop: cropData?.cropArea,
              status: "pending" as const,
              resultBlob: undefined,
            }
          : f,
      ),
    }));
  },

  /**
   * 設定單張模式的自訂裁切資料
   * 設定後自動觸發 processImage 來即時更新預覽
   */
  setCustomCrop: (cropData: import("@/src/types").CropData | null) => {
    const state = get();

    // 清除舊的預覽
    if (state.resultPreviewUrl) {
      revokePreviewURL(state.resultPreviewUrl);
    }

    set({
      cropData,
      customCrop: cropData?.cropArea ?? null,
      resultBlob: null,
      resultPreviewUrl: null,
    });

    // 如果有設定裁切且有來源檔案，自動執行處理以更新預覽
    if (cropData && state.sourceFile) {
      // 延遲一個 tick 確保狀態已更新
      setTimeout(() => {
        get().processImage();
      }, 0);
    }
  },

  /**
   * 設定浮水印圖片檔案
   */
  setWatermarkFile: (file: File) => {
    const state = get();
    // 清理舊的浮水印預覽 URL
    if (state.watermark.previewUrl) {
      revokePreviewURL(state.watermark.previewUrl);
    }
    // 清除舊的處理結果（可能含舊浮水印或無浮水印），確保下載時重新處理
    if (state.resultPreviewUrl) {
      revokePreviewURL(state.resultPreviewUrl);
    }
    const previewUrl = createPreviewURL(file);
    set({
      watermark: {
        ...state.watermark,
        file,
        previewUrl,
        // 重置位置為預設
        position: "bottom-right",
        customPosition: null,
      },
      resultBlob: null,
      resultPreviewUrl: null,
    });
  },

  /**
   * 移除浮水印
   * 同時清除已處理的預覽圖（因為包含了舊浮水印），讓預覽回到原圖
   */
  removeWatermark: () => {
    const state = get();
    if (state.watermark.previewUrl) {
      revokePreviewURL(state.watermark.previewUrl);
    }
    // 清除含有舊浮水印的處理結果預覽
    if (state.resultPreviewUrl) {
      revokePreviewURL(state.resultPreviewUrl);
    }
    set({
      watermark: {
        file: null,
        previewUrl: null,
        position: "bottom-right",
        size: 0.15,
        margin: 20,
        opacity: 0,
        customPosition: null,
      },
      resultBlob: null,
      resultPreviewUrl: null,
    });
  },

  /**
   * 更新浮水印設定（不含 file/previewUrl）
   * 同時清除已處理的預覽結果，避免舊的嵌入浮水印還在左側預覽顯示
   */
  updateWatermarkConfig: (partial) => {
    const state = get();
    // 若已有處理結果（含舊浮水印），清除它
    if (state.resultPreviewUrl) {
      revokePreviewURL(state.resultPreviewUrl);
    }
    set({
      watermark: {
        ...state.watermark,
        ...partial,
      },
      resultBlob: null,
      resultPreviewUrl: null,
    });
  },

  /**
   * 設定 Canvas 權限 Modal 顯示狀態
   */
  setShowCanvasPermissionModal: (show: boolean) => {
    set({ showCanvasPermissionModal: show });
  },

  /**
   * 切換編輯器模式（自訂尺寸 / App 圖示）
   */
  setEditorMode: (mode) => {
    set({ editorMode: mode });
  },

  /**
   * 切換 App 圖示平台的勾選狀態
   */
  toggleAppIconPlatform: (platform: AppIconPlatform) => {
    const state = get();
    const current = state.appIconState.selectedPlatforms;
    const newPlatforms = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];

    set({
      appIconState: {
        ...state.appIconState,
        selectedPlatforms: newPlatforms,
        // 切換平台時，清除已有結果
        results: {},
      },
    });
  },

  /**
   * 處理 App 圖示模式 - 批次產生所有勾選平台的所有尺寸
   */
  processAppIcons: async () => {
    const state = get();
    const { sourceFile, appIconState } = state;

    if (!sourceFile) {
      set({ error: "請先上傳圖片" });
      return;
    }

    if (appIconState.selectedPlatforms.length === 0) {
      set({ error: "請至少選擇一個平台" });
      return;
    }

    // 檢查 Canvas 權限
    if (!checkCanvasPermission()) {
      set({ showCanvasPermissionModal: true });
      return;
    }

    set({
      appIconState: { ...appIconState, isProcessing: true, results: {} },
      error: null,
    });

    try {
      const results: Record<string, { blob: Blob; url: string }> = {};

      // 遍歷所有勾選的平台
      for (const platformId of appIconState.selectedPlatforms) {
        const platformConfig = APP_ICON_PLATFORMS.find(
          (p) => p.id === platformId,
        );
        if (!platformConfig) continue;

        // 遍歷平台內所有尺寸
        for (const sizeSpec of platformConfig.sizes) {
          const key = `${platformId}-${sizeSpec.width}x${sizeSpec.height}-${sizeSpec.format}`;

          try {
            const blob = await resizeImage(sourceFile, {
              width: sizeSpec.width,
              height: sizeSpec.height,
              format: sizeSpec.format,
              quality: 1, // App Icon 最高品質
              fitMode: "cover",
            });

            const url = createPreviewURL(blob);
            results[key] = { blob, url };
          } catch (err) {
            console.error(
              `處理 ${platformId} ${sizeSpec.label} 失敗:`,
              err,
            );
          }
        }
      }

      set({
        appIconState: {
          ...get().appIconState,
          results,
          isProcessing: false,
        },
      });
    } catch (error) {
      const isPermissionError =
        error instanceof Error && error.message === "CANVAS_PERMISSION_DENIED";
      set({
        error: isPermissionError
          ? null
          : error instanceof Error
            ? error.message
            : "App Icon 處理時發生錯誤",
        showCanvasPermissionModal: isPermissionError,
        appIconState: { ...get().appIconState, isProcessing: false },
      });
    }
  },

  /**
   * 重置 App 圖示結果
   */
  resetAppIconResults: () => {
    const state = get();
    // 清理所有產生的 URL
    Object.values(state.appIconState.results).forEach((r) => {
      revokePreviewURL(r.url);
    });
    set({
      appIconState: {
        ...state.appIconState,
        results: {},
      },
    });
  },
}));

export default useAppStore;
