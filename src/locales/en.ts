/**
 * English Translations
 */

export const en = {
  // Header
  title: 'Image Smart Resizer',
  subtitle: 'High-quality client-side image resizing with privacy protection',

  // Upload Zone
  upload: {
    title: 'Upload Image',
    dragDrop: 'Drag and drop image here',
    or: 'or',
    browse: 'Browse Files',
    formats: 'Supported formats: JPG, PNG, WebP',
    multipleSupport: '(Supports single or multiple files)',
    localProcessing: 'Local processing, images are not uploaded to server',
    addMore: 'Add more',
  },

  // Control Panel
  controls: {
    dimensions: 'Dimensions',
    width: 'Width',
    height: 'Height',
    maintainAspectRatio: 'Lock Aspect Ratio',
    toggleAspectRatio: 'Toggle aspect ratio lock',
    history: 'History',
    format: 'Format',
    quality: 'Quality',
    smallerFile: 'Smaller File',
    bestQuality: 'Best Quality',
    download: 'Download Image',
    processing: 'Processing...',
    applySize: 'Apply this size',
    deleteHistory: 'Delete this history',
    reset: 'Reset',
  },

  // Image Preview
  preview: {
    original: 'Original',
    result: 'Result',
    processFirst: 'Adjust settings and click download to process',
  },

  // Batch Processing
  batch: {
    completed: 'Batch processing completed!',
    failed: 'Processing failed',
    remove: 'Remove',
    preview: 'Preview',
    pending: 'Pending',
    processing: 'Processing',
    done: 'Done',
    error: 'Error',
  },

  // Footer
  footer: {
    copyright: '© 2025 Smart Resizer. Designed for creators',
  },

  // Errors
  errors: {
    uploadFirst: 'Please upload an image first',
    processingFailed: 'Image processing failed',
    readFileFailed: 'Failed to read file',
  },

  // Languages
  languages: {
    en: 'English',
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    ja: '日本語',
    ko: '한국어',
  },
} as const;

export type TranslationKeys = typeof en;
export type Translation = {
  [K in keyof TranslationKeys]: TranslationKeys[K] extends object
    ? { [P in keyof TranslationKeys[K]]: string }
    : string;
};
