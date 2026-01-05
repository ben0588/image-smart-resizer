/**
 * Traditional Chinese (繁體中文) Translations
 */

import type { Translation } from './en';

export const zhTW: Translation = {
  // Header
  title: '智慧圖片調整器',
  subtitle: '高品質客戶端圖片縮放，保護隱私安全',

  // Upload Zone
  upload: {
    title: '上傳圖片',
    dragDrop: '拖放圖片至此',
    or: '或',
    browse: '瀏覽檔案',
    formats: '支援格式：JPG、PNG、WebP',
    multipleSupport: '（支援單個或多個檔案）',
    localProcessing: '本地處理，圖片不會上傳到伺服器',
    addMore: '加入更多',
  },

  // Control Panel
  controls: {
    dimensions: '尺寸',
    width: '寬度',
    height: '高度',
    maintainAspectRatio: '鎖定長寬比',
    toggleAspectRatio: '切換長寬比鎖定',
    history: '歷史',
    format: '格式',
    quality: '品質',
    smallerFile: '檔案較小',
    bestQuality: '最佳品質',
    download: '下載圖片',
    processing: '處理中...',
    applySize: '套用此尺寸',
    deleteHistory: '刪除此歷史',
    reset: '重置',
  },

  // Image Preview
  preview: {
    original: '原始圖片',
    result: '處理結果',
    processFirst: '調整設定並點擊下載以處理圖片',
  },

  // Batch Processing
  batch: {
    completed: '批次處理完成！',
    failed: '處理失敗',
    remove: '移除',
    preview: '預覽',
    pending: '等待中',
    processing: '處理中',
    done: '已完成',
    error: '錯誤',
  },

  // Footer
  footer: {
    copyright: '© 2025 Smart Resizer. 為創作者設計',
  },

  // Errors
  errors: {
    uploadFirst: '請先上傳圖片',
    processingFailed: '圖片處理失敗',
    readFileFailed: '讀取檔案失敗',
  },

  // Languages
  languages: {
    en: 'English',
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    ja: '日本語',
    ko: '한국어',
  },
};
