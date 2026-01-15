/**
 * Simplified Chinese (简体中文) Translations
 */

import type { Translation } from './en';

export const zhCN: Translation = {
  // Header
  title: '智能图片调整器',
  subtitle: '高品质客户端图片缩放，保护隐私安全',

  // Upload Zone
  upload: {
    title: '上传图片',
    dragDrop: '拖放图片至此',
    or: '或',
    browse: '浏览文件',
    formats: '支持格式：JPG、PNG、WebP、ICO',
    multipleSupport: '（支持单个或多个文件）',
    localProcessing: '本地处理，图片不会上传到服务器',
    addMore: '添加更多',
    dropHere: '拖放文件至此加入列表',
  },

  // Control Panel
  controls: {
    dimensions: '尺寸',
    width: '宽度',
    height: '高度',
    maintainAspectRatio: '锁定长宽比',
    toggleAspectRatio: '切换长宽比锁定',
    history: '历史',
    format: '格式',
    quality: '品质',
    smallerFile: '文件较小',
    bestQuality: '最佳品质',
    download: '下载图片',
    processing: '处理中...',
    applySize: '套用此尺寸',
    deleteHistory: '删除此历史',
    reset: '重置',
    estimatedSize: '预估大小',
    calculating: '计算中...',
    reduction: '减少',
    calculateAllSizes: '试算所有大小',
    downloadSingle: '下载图片',
    downloadBatch: '打包下载',
    downloadAndCompress: '开始压缩并下载',
    approxTotal: '约共',
    pendingCalculation: '待计算',
  },

  // Image Preview
  preview: {
    original: '原始图片',
    result: '处理结果',
    processFirst: '调整设置并点击下载以处理图片',
  },

  // Batch Processing
  batch: {
    completed: '批量处理完成！',
    failed: '处理失败',
    remove: '移除',
    preview: '预览',
    pending: '等待中',
    processing: '处理中',
    done: '已完成',
    error: '错误',
    clearAll: '清空列表',
    filename: '文件名称',
    dimensions: '尺寸',
    format: '格式',
    originalSize: '原始大小',
    compressedSize: '压缩后',
    selected: '已选择',
    clickToEdit: '点击编辑设置',
  },

  // Footer
  footer: {
    copyright: '© 2026 Smart Resizer. 为创作者设计',
    privacyPolicy: '隐私权政策',
    createdBy: '作者：',
    privacyText: `
<div class="space-y-6 text-slate-600">
  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">核心承诺：零数据收集</h4>
    <p>感谢您使用 <strong>智能图片调整器</strong>。本工具采用 <strong>“本地优先（Local-First）”</strong> 的架构设计。我们非常重视您的隐私，我们的核心原则是：我们不会将您处理的任何内容上传至云端服务器。</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">1. 数据处理与存储方式</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>存储于您的设备</strong>：您在使用本工具时产生的所有数据，均完全存储于您的浏览器本地（LocalStorage、IndexedDB 或缓存）。</li>
      <li><strong>无法访问声明</strong>：开发团队无法查看、编辑或访问您的任何数据。</li>
      <li><strong>本地执行运算</strong>：本工具的所有运算逻辑都在您的浏览器中执行。即使断开网络连接，核心功能依然可用。</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">2. 托管服务与分析工具</h4>
    <p>本工具的代码托管于 Vercel 平台。为了优化用户体验，我们使用了 <strong>Vercel Analytics</strong> 进行性能追踪与流量分析：</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>匿名分析</strong>：收集匿名化的技术信息（如浏览器类型、设备类型、加载时间），不包含任何个人身份资料（PII）。</li>
      <li><strong>无图片访问</strong>：分析工具仅追踪网站使用行为，无法访问您处理的图片内容。</li>
      <li><strong>服务稳定性</strong>：标准的服务器访问记录仅用于维护连接稳定。</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">3. 数据安全与风险</h4>
    <p>由于数据仅存储在浏览器内，清空缓存或使用无痕模式可能会导致数据丢失。但其优点是消除了云端数据库泄露风险。</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">4. Cookie 与分析技术</h4>
    <p>我们使用必要技术来提升服务质量：</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>偏好设置</strong>：使用必要的本地存储记录您的界面偏好（如语系设置）。</li>
      <li><strong>匿名统计</strong>：通过 Vercel Analytics 进行匿名网站统计，提升产品性能。</li>
      <li><strong>非广告用途</strong>：我们不使用任何第三方广告跟踪 Cookie。</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">5. 联系我们</h4>
    <p>若您对本工具运作原理或安全性有任何疑问，请联系：<br/><strong>电子邮件：energy9527z@gmail.com</strong></p>
  </section>
</div>
    `,
  },

  // SEO
  seo: {
    description: "一個高效、纯净且重视隐私的图片智能调整工具，完全在浏览器端完成处理。",
    features: "图片缩放, 格式转换, SVG转PNG, 隐私保护"
  },

  // Errors
  errors: {
    uploadFirst: '请先上传图片',
    processingFailed: '图片处理失败',
    readFileFailed: '读取文件失败',
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
