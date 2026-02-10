/**
 * Type Definitions - Smart Resizer
 * 統一管理所有型別定義，確保 Type Safety
 * 符合專案規格定義 (Specification)
 */

// ============ 圖片相關型別 ============

/**
 * 支援的圖片輸出格式 (MIME Type)
 */
export type ImageFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/x-icon";

/**
 * 縮放模式
 * - cover: 裁切填滿（置中裁切，填滿目標尺寸）
 * - contain: 完整保留（等比縮放，可能有留白）
 * - fill: 強制拉伸（變形填滿）
 */
export type FitMode = "cover" | "contain" | "fill";

/**
 * 比例預設值
 */
export type AspectRatioPreset = "original" | "16:9" | "4:3" | "1:1" | "9:16";

/**
 * 浮水印位置預設 (九宮格)
 */
export type WatermarkPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * 浮水印設定
 */
export interface WatermarkConfig {
  file: File | null; // 浮水印圖片檔案
  previewUrl: string | null; // 預覽 URL
  position: WatermarkPosition; // 九宮格預設位置
  size: number; // 浮水印相對大小 (0.05 ~ 0.5, 相對於圖片寬度的比例)
  margin: number; // 邊距 (px)
  opacity: number; // 透明度 (0 = 完全不透明, 0.9 = 幾乎全透明)
  // 自訂拖曳位置（百分比，覆蓋 position）
  customPosition: {
    x: number; // 0~100 百分比
    y: number; // 0~100 百分比
  } | null;
}

/**
 * 自訂裁切參數 (react-easy-crop 輸出格式)
 */
export interface CropArea {
  x: number; // 裁切區域左上角 X 座標 (相對於圖片)
  y: number; // 裁切區域左上角 Y 座標 (相對於圖片)
  width: number; // 裁切區域寬度
  height: number; // 裁切區域高度
}

/**
 * 完整裁切資料（用於恢復裁切狀態）
 * 包含 react-easy-crop 需要的所有參數
 */
export interface CropData {
  cropArea: CropArea; // 最終裁切區域（像素）
  cropPosition: {
    // 裁切框位置（用於恢復 UI 狀態）
    x: number;
    y: number;
  };
  zoom: number; // 縮放比例 (1-3)
  aspect: number; // 長寬比
  rotation: number; // 旋轉角度 (0, 90, 180, 270 或任意角度)
}

/**
 * 圖片處理核心設定
 * 用於 Zustand Store 與 Pica 運算參數
 */
export interface ResizeConfig {
  width: number; // 目標寬度 (px)
  height: number; // 目標高度 (px)
  maintainAspectRatio: boolean; // 是否鎖定長寬比
  aspectRatio: number; // 原始圖片長寬比 (Width / Height)
  format: ImageFormat; // 輸出格式
  quality: number; // 壓縮品質 0.1 ~ 1.0 (10-100)
  fitMode: FitMode; // 縮放模式
}

/**
 * 歷史紀錄項目
 * 儲存於 LocalStorage ('smart-resizer-history')
 */
export interface HistoryItem {
  id: string; // UUID
  width: number;
  height: number;
  label?: string; // 例如 "IG Story", "OG Image" (未來擴充)
  lastUsedAt: number; // Timestamp
}

/**
 * 圖片處理選項 (傳遞給 Pica)
 */
export interface ProcessOptions {
  width: number;
  height: number;
  format: ImageFormat;
  quality: number;
  fitMode?: FitMode; // 縮放模式 (cover/contain/fill)
  customCrop?: CropArea; // 自訂裁切區域
  rotation?: number; // 旋轉角度 (0-360)
  watermark?: {
    // 浮水印設定
    imageData: string; // 浮水印圖片 base64 / data URL
    position: WatermarkPosition;
    size: number; // 相對大小比例
    margin: number; // 邊距 px
    opacity: number; // 透明度
    customPosition: { x: number; y: number } | null;
  };
}

// ============ Store 相關型別 ============

/**
 * 批次處理檔案項目
 */
export interface BatchFileItem {
  id: string; // UUID
  file: File; // 原始檔案
  previewUrl: string; // 預覽 URL
  status: "pending" | "processing" | "completed" | "error";
  resultBlob?: Blob; // 單一處理結果
  // 若為 SVG 轉 PNG 多尺寸輸出時，會儲存多個變體
  resultVariants?: Array<{
    width: number;
    height: number;
    blob: Blob;
    filename?: string;
    url?: string;
  }>;
  error?: string; // 錯誤訊息
  // 原始圖片尺寸
  originalDimensions?: {
    width: number;
    height: number;
  };
  // 預估壓縮後大小
  estimatedSize?: number;
  // 預估計算中
  isEstimating?: boolean;
  // 自訂裁切資料（完整的裁切狀態，用於恢復 UI）
  cropData?: CropData;
  // 自訂裁切區域（覆蓋全域 Cover 設定）- 保留以便向後相容
  customCrop?: CropArea;
}

/**
 * 預估大小資訊
 */
export interface EstimationInfo {
  originalSize: number; // 原始檔案大小 (bytes)
  estimatedSize: number; // 預估壓縮後大小 (bytes)
  reduction: number; // 減少百分比 (0-100)
  isCalculating: boolean; // 是否正在計算中
}

/**
 * 應用程式全域狀態 (Zustand Store)
 * 符合規格定義的 AppState，支援批次處理
 */
export interface AppState {
  // 原始檔案資料（向後相容單檔案模式）
  sourceFile: File | null;
  sourcePreviewUrl: string | null; // URL.createObjectURL
  originalDimensions: { width: number; height: number } | null;

  // 批次處理檔案
  batchFiles: BatchFileItem[];
  isBatchMode: boolean;
  selectedFileId: string | null; // 新增：當前選中的檔案 ID（清單模式）

  // 處理狀態
  isProcessing: boolean;
  resultBlob: Blob | null;
  resultPreviewUrl: string | null;

  // 預估大小狀態（新增）
  estimatedSize: number | null;
  isEstimating: boolean;

  // 單張模式的自訂裁切區域
  customCrop: CropArea | null;
  // 單張模式的完整裁切資料（用於恢復 UI 狀態）
  cropData: CropData | null;

  // 浮水印設定
  watermark: WatermarkConfig;

  // 設定值
  config: ResizeConfig;

  // 錯誤訊息
  error: string | null;

  // Canvas 權限 Modal 狀態
  showCanvasPermissionModal: boolean;

  // 編輯器模式
  editorMode: EditorMode;

  // App 圖示模式狀態
  appIconState: AppIconState;

  // Actions - 單檔案模式
  setSourceFile: (file: File) => void;
  updateConfig: (partial: Partial<ResizeConfig>) => void;
  processImage: () => Promise<void>;
  reset: () => void;

  // Actions - 預估大小
  estimateSize: () => Promise<void>;
  estimateAllSizes: () => Promise<void>;

  // Actions - 選擇檔案（清單模式）
  selectFile: (id: string | null) => void;

  // Actions - 批次模式
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  processBatch: () => Promise<void>;

  // Actions - 裁切功能
  setCropForFile: (id: string, cropData: CropData | undefined) => void;
  setCustomCrop: (cropData: CropData | null) => void;

  // Actions - 浮水印
  setWatermarkFile: (file: File) => void;
  removeWatermark: () => void;
  updateWatermarkConfig: (
    partial: Partial<Omit<WatermarkConfig, "file" | "previewUrl">>,
  ) => void;

  // Actions - Canvas 權限 Modal
  setShowCanvasPermissionModal: (show: boolean) => void;

  // Actions - 編輯器模式
  setEditorMode: (mode: EditorMode) => void;
  toggleAppIconPlatform: (platform: AppIconPlatform) => void;
  processAppIcons: () => Promise<void>;
  resetAppIconResults: () => void;
}

// ============ 元件 Props 型別 ============

/**
 * UploadZone 元件 Props
 */
export interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

/**
 * ControlPanel 元件 Props
 */
export interface ControlPanelProps {
  config: ResizeConfig;
  isProcessing: boolean;
  error: string | null;
  onConfigChange: (partial: Partial<ResizeConfig>) => void;
  onReset: () => void;
  onDownload: () => void;
}

/**
 * ImagePreview 元件 Props
 */
export interface ImagePreviewProps {
  src: string; // 當前預覽圖片 (可能是處理過的)
  originalSrc: string; // 原始圖片 (用於裁切)
  originalDimensions: { width: number; height: number } | null;
  fileSize?: number;
  isProcessing: boolean;
}

// ============ App Icon 圖示模式型別 ============

/**
 * 編輯器模式
 * - custom: 自訂尺寸模式（預設）
 * - app-icon: App 圖示模式
 */
export type EditorMode = "custom" | "app-icon";

/**
 * App 圖示平台類別 ID
 */
export type AppIconPlatform = "ios" | "android" | "web";

/**
 * App 圖示單一尺寸規格
 */
export interface AppIconSize {
  label: string; // 用途名稱，如 "App Store 主圖標"（UI 顯示用）
  filename: string; // 輸出檔名（含副檔名），遵循各平台命名規範
  descKey: string; // 對應 locale 翻譯的 key（在 appIcon 區塊內）
  width: number;
  height: number;
  format: "image/png" | "image/x-icon"; // 輸出格式（不包含 SVG）
  description?: string; // 備註說明（當翻譯缺失時的 fallback）
}

/**
 * App 圖示平台設定
 */
export interface AppIconPlatformConfig {
  id: AppIconPlatform;
  label: string; // 顯示名稱
  description: string; // 簡短描述
  folder: string; // 輸出資料夾名稱
  sizes: AppIconSize[];
}

/**
 * App 圖示模式的狀態
 */
export interface AppIconState {
  selectedPlatforms: AppIconPlatform[]; // 目前勾選的平台
  /** 各尺寸處理結果（key = `${platform}-${width}x${height}`） */
  results: Record<
    string,
    {
      blob: Blob;
      url: string;
    }
  >;
  isProcessing: boolean;
}

// ============ 工具函式型別 ============

/**
 * 尺寸計算結果
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * 檔案驗證結果
 */
export interface FileValidation {
  valid: boolean;
  error?: string;
}
