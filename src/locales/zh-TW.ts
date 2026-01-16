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
    formats: '支援格式：JPG、PNG、WebP、ICO',
    multipleSupport: '（支援單個或多個檔案）',
    localProcessing: '本地處理，圖片不會上傳到伺服器',
    addMore: '加入更多',
    dropHere: '拖放檔案至此加入列表',
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
    estimatedSize: '預估大小',
    calculating: '計算中...',
    reduction: '減少',
    calculateAllSizes: '試算所有大小',
    downloadSingle: '下載圖片',
    downloadBatch: '打包下載',
    downloadAndCompress: '開始壓縮並下載',
    approxTotal: '約共',
    pendingCalculation: '待計算',
    // 縮放模式
    fitMode: '縮放模式',
    fitCover: '裁切填滿',
    fitContain: '完整保留',
    fitFill: '強制拉伸',
    // 比例預設值
    aspectRatioPreset: '比例',
    aspectOriginal: '原始',
    aspectCrop: '調整裁切',
    cropModified: '已手動裁切',
    cropReset: '重置裁切',
    // 裁切彈窗
    cropAdjustTitle: '調整裁切範圍',
    cropAdjustDesc: '拖曳以調整裁切位置',
    zoomLevel: '縮放',
    rotation: '旋轉',
    rotate90: '旋轉 90°',
    resetCrop: '重置位置',
    applyCrop: '套用',
    cancel: '取消',
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
    clearAll: '清空列表',
    filename: '檔案名稱',
    dimensions: '尺寸',
    format: '格式',
    originalSize: '原始大小',
    compressedSize: '壓縮後',
    selected: '已選擇',
    clickToEdit: '點擊編輯設定',
  },

  // Footer
  footer: {
    copyright: '© 2026 Smart Resizer. 為創作者設計',
    privacyPolicy: '隱私權政策',
    createdBy: '作者：',
    privacyText: `
<div class="space-y-6 text-slate-600">
  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">核心承諾：零資料收集</h4>
    <p>感謝您使用 <strong>Image Smart Resizer</strong>（以下簡稱「本工具」）。本工具採用 <strong>「本地優先（Local-First）」</strong> 的架構設計。我們非常重視您的隱私，因此我們的核心原則是：我們不會將您輸入的任何內容上傳至雲端伺服器。</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">1. 資料處理與儲存方式</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>資料儲存於您的裝置</strong>：您在使用本工具時所產生、輸入或匯入的所有資料，均完全儲存於您的瀏覽器本地端（使用 LocalStorage、IndexedDB 或快取技術）。</li>
      <li><strong>無法存取聲明</strong>：開發團隊無法查看、編輯或存取您的任何資料。</li>
      <li><strong>運算在本地執行</strong>：本工具的所有運算邏輯皆在您的瀏覽器中執行。即使您斷開網路連線，核心功能依然可以運作。</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">2. 託管服務與分析工具</h4>
    <p>本工具的程式碼託管於 Vercel 平台。為了優化使用者體驗，我們使用了 <strong>Vercel Analytics</strong> 進行效能追蹤與流量分析：</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>匿名分析</strong>：收集匿名化的技術資訊（如瀏覽器類型、裝置類型、載入時間），不包含任何個人身分資料（PII）。</li>
      <li><strong>無圖片存取</strong>：分析工具僅追蹤網站使用行為，完全無法存取您處理的圖片內容。</li>
      <li><strong>服務穩定性</strong>：標準的伺服器存取紀錄僅用於維護連線穩定。</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">3. 資料安全與風險</h4>
    <p>由於資料僅儲存於您的瀏覽器內，若您清除瀏覽器快取或使用無痕模式，資料可能會遺失。但優點是消除了雲端資料庫被駭客導入導致內容外洩的風險。</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">4. Cookie 與分析技術</h4>
    <p>我們使用必要技術來提升服務品質：</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>偏好設定</strong>：使用必要的本地儲存來紀錄您的介面偏好（如語系設定）。</li>
      <li><strong>匿名統計</strong>：透過 Vercel Analytics 進行匿名網站統計，提升產品效能。</li>
      <li><strong>非廣告用途</strong>：我們不使用任何第三方廣告追蹤 Cookie。</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">5. 聯絡我們</h4>
    <p>若您對本工具的運作原理或安全性有任何疑問，歡迎聯繫我們：<br/><strong>電子郵件：energy9527z@gmail.com</strong></p>
  </section>
</div>
    `,
  },

  // SEO
  seo: {
    description: "一個高效、純淨且重視隱私的圖片智慧調整工具，完全在瀏覽器端完成處理。",
    features: "圖片縮放, 格式轉換, SVG轉PNG, 隱私保護"
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
