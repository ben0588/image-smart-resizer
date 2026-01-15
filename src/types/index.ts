/**
 * Type Definitions - Smart Resizer
 * 統一管理所有型別定義，確保 Type Safety
 * 符合專案規格定義 (Specification)
 */

// ============ 圖片相關型別 ============

/**
 * 支援的圖片輸出格式 (MIME Type)
 */
export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/x-icon';

/**
 * 圖片處理核心設定
 * 用於 Zustand Store 與 Pica 運算參數
 */
export interface ResizeConfig {
  width: number;                    // 目標寬度 (px)
  height: number;                   // 目標高度 (px)
  maintainAspectRatio: boolean;     // 是否鎖定長寬比
  aspectRatio: number;              // 原始圖片長寬比 (Width / Height)
  format: ImageFormat;              // 輸出格式
  quality: number;                  // 壓縮品質 0.1 ~ 1.0 (10-100)
}

/**
 * 歷史紀錄項目
 * 儲存於 LocalStorage ('smart-resizer-history')
 */
export interface HistoryItem {
  id: string;                       // UUID
  width: number;
  height: number;
  label?: string;                   // 例如 "IG Story", "OG Image" (未來擴充)
  lastUsedAt: number;               // Timestamp
}

/**
 * 圖片處理選項 (傳遞給 Pica)
 */
export interface ProcessOptions {
  width: number;
  height: number;
  format: ImageFormat;
  quality: number;
}

// ============ Store 相關型別 ============

/**
 * 批次處理檔案項目
 */
export interface BatchFileItem {
  id: string;                       // UUID
  file: File;                       // 原始檔案
  previewUrl: string;               // 預覽 URL
  status: 'pending' | 'processing' | 'completed' | 'error';
  resultBlob?: Blob;                // 單一處理結果
  // 若為 SVG 轉 PNG 多尺寸輸出時，會儲存多個變體
  resultVariants?: Array<{
    width: number;
    height: number;
    blob: Blob;
    filename?: string;
    url?: string;
  }>;
  error?: string;                   // 錯誤訊息
  // 新增：原始圖片尺寸
  originalDimensions?: {
    width: number;
    height: number;
  };
  // 新增：預估壓縮後大小
  estimatedSize?: number;
  // 新增：預估計算中
  isEstimating?: boolean;
}

/**
 * 預估大小資訊
 */
export interface EstimationInfo {
  originalSize: number;             // 原始檔案大小 (bytes)
  estimatedSize: number;            // 預估壓縮後大小 (bytes)
  reduction: number;                // 減少百分比 (0-100)
  isCalculating: boolean;           // 是否正在計算中
}

/**
 * 應用程式全域狀態 (Zustand Store)
 * 符合規格定義的 AppState，支援批次處理
 */
export interface AppState {
  // 原始檔案資料（向後相容單檔案模式）
  sourceFile: File | null;
  sourcePreviewUrl: string | null;  // URL.createObjectURL
  originalDimensions: { width: number; height: number } | null;

  // 批次處理檔案
  batchFiles: BatchFileItem[];
  isBatchMode: boolean;
  selectedFileId: string | null;    // 新增：當前選中的檔案 ID（清單模式）

  // 處理狀態
  isProcessing: boolean;
  resultBlob: Blob | null;
  resultPreviewUrl: string | null;

  // 預估大小狀態（新增）
  estimatedSize: number | null;
  isEstimating: boolean;

  // 設定值
  config: ResizeConfig;
  
  // 錯誤訊息
  error: string | null;

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
  src: string;
  originalDimensions: { width: number; height: number } | null;
  fileSize?: number;
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
