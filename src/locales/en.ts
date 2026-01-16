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
    formats: 'Supported formats: JPG, PNG, WebP, ICO',
    multipleSupport: '(Supports single or multiple files)',
    localProcessing: 'Local processing, images are not uploaded to server',
    addMore: 'Add more',
    dropHere: 'Drop files here to add to list',
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
    estimatedSize: 'Estimated Size',
    calculating: 'Calculating...',
    reduction: 'reduction',
    calculateAllSizes: 'Calculate All Sizes',
    downloadSingle: 'Download Image',
    downloadBatch: 'Download All',
    downloadAndCompress: 'Compress & Download',
    approxTotal: 'Total',
    pendingCalculation: 'Pending',
    // Fit Mode
    fitMode: 'Fit Mode',
    fitCover: 'Cover',
    fitContain: 'Contain',
    fitFill: 'Fill',
    // Aspect Ratio Presets
    aspectRatioPreset: 'Ratio',
    aspectOriginal: 'Original',
    aspectCrop: 'Adjust Crop',
    cropModified: 'Cropped',
    cropReset: 'Reset Crop',
    // Crop Modal
    cropAdjustTitle: 'Adjust Crop',
    cropAdjustDesc: 'Drag to adjust crop position',
    zoomLevel: 'Zoom',
    rotation: 'Rotation',
    rotate90: 'Rotate 90°',
    resetCrop: 'Reset Position',
    applyCrop: 'Apply',
    cancel: 'Cancel',
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
    clearAll: 'Clear All',
    filename: 'Filename',
    dimensions: 'Dimensions',
    format: 'Format',
    originalSize: 'Original',
    compressedSize: 'Compressed',
    selected: 'Selected',
    clickToEdit: 'Click to edit settings',
  },

  // Footer
  footer: {
    copyright: '© 2026 Smart Resizer. Designed for creators',
    privacyPolicy: 'Privacy Policy',
    createdBy: 'Created by',
    privacyText: `
<div class="space-y-6 text-slate-600">
  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">Core Commitment: Zero Data Collection</h4>
    <p>Thank you for using <strong>Image Smart Resizer</strong>. This tool is designed with a <strong>"Local-First"</strong> approach. We value your privacy, so our core principle is: we never upload your content to any cloud server.</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">1. Data Processing and Storage</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Stored on Your Device</strong>: All data processed or imported is stored entirely in your browser's local storage (LocalStorage, IndexedDB, or cache).</li>
      <li><strong>No Access Statement</strong>: Our development team cannot view, edit, or access any of your data.</li>
      <li><strong>Local Execution</strong>: All processing logic runs in your browser. Functional without an internet connection.</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">2. Hosting and Analytics</h4>
    <p>The code is hosted on Vercel. To improve user experience, we use <strong>Vercel Analytics</strong> for performance and traffic analysis:</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>Anonymous Analytics</strong>: We collect anonymized technical info (browser type, device, performance) with no Personally Identifiable Information (PII).</li>
      <li><strong>No Image Access</strong>: Analytics only track site usage patterns and cannot access your image data.</li>
      <li><strong>Service Stability</strong>: Standard server logs are used solely for connectivity and maintenance.</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">3. Data Security and Risks</h4>
    <p>Since data is only stored in your browser, it may be lost if you clear your cache or use private browsing. This eliminates the risk of cloud-based data breaches.</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">4. Cookies and Technologies</h4>
    <p>We use essential technologies for quality of service:</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>Preferences</strong>: Necessary local storage to record settings like language.</li>
      <li><strong>Anonymous Stats</strong>: Vercel Analytics for anonymous statistics to improve performance.</li>
      <li><strong>No Advertising</strong>: We do not use third-party advertising tracking cookies.</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">5. Contact Us</h4>
    <p>If you have questions about how this works, please contact us:<br/><strong>Email: energy9527z@gmail.com</strong></p>
  </section>
</div>
    `,
  },

  // SEO
  seo: {
    description: "An efficient, clean, and privacy-focused smart image resizing tool that processes everything in the browser.",
    features: "Image Resizing, Format Conversion, SVG to PNG, Privacy Protection"
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
