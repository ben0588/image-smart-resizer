/**
 * Simplified Chinese (简体中文) Translations
 */

import type { Translation } from "./en";

export const zhCN: Translation = {
  // Header
  title: "智能图片调整器",
  subtitle: "高品质客户端图片缩放，保护隐私安全",

  // Upload Zone
  upload: {
    title: "上传图片",
    dragDrop: "拖放图片至此",
    or: "或",
    browse: "浏览文件",
    formats: "支持格式：JPG、PNG、WebP、ICO",
    multipleSupport: "（支持单个或多个文件）",
    localProcessing: "本地处理，图片不会上传到服务器",
    addMore: "添加更多",
    dropHere: "拖放文件至此加入列表",
  },

  // Control Panel
  controls: {
    dimensions: "尺寸",
    width: "宽度",
    height: "高度",
    maintainAspectRatio: "锁定长宽比",
    toggleAspectRatio: "切换长宽比锁定",
    history: "历史",
    format: "输出格式",
    quality: "压缩质量",
    smallerFile: "文件较小",
    bestQuality: "最佳品质",
    download: "下载图片",
    close: "关闭",
    rotateLeft: "向左旋转 90°",
    rotateRight: "向右旋转 90°",
    processing: "处理中...",
    applySize: "套用此尺寸",
    deleteHistory: "删除此历史",
    reset: "重置",
    estimatedSize: "预估大小",
    calculating: "计算中...",
    reduction: "减少",
    calculateAllSizes: "试算所有大小",
    downloadSingle: "下载图片",
    downloadBatch: "打包下载",
    downloadAndCompress: "开始压缩并下载",
    downloadStarted: "开始下载图片",
    approxTotal: "约共",
    pendingCalculation: "待计算",
    // 缩放模式
    fitMode: "缩放模式",
    fitCover: "裁切填满",
    fitContain: "完整保留",
    fitFill: "强制拉伸",
    // 比例预设值
    aspectRatioPreset: "比例",
    aspectOriginal: "原始",
    aspectCrop: "调整裁切",
    cropModified: "已手动裁切",
    cropReset: "重置裁切",
    // 裁切弹窗
    cropAdjustTitle: "调整裁切范围",
    cropAdjustDesc: "拖曳以调整裁切位置",
    zoomLevel: "缩放",
    rotation: "旋转",
    rotate90: "旋转 90°",
    resetCrop: "重置位置",
    applyCrop: "应用",
    cancel: "取消",
    // 水印
    watermarkOverlay: "水印叠加",
    watermarkUpload: "上传或拖放水印图片",
    watermarkRemove: "移除水印",
    watermarkQuickPosition: "快速定位",
    watermarkAutoMargin: "自动边距",
    watermarkSize: "大小",
    watermarkOpacity: "透明度",
    watermarkTopLeft: "左上",
    watermarkTopCenter: "中上",
    watermarkTopRight: "右上",
    watermarkCenterLeft: "左中",
    watermarkCenter: "居中",
    watermarkCenterRight: "右中",
    watermarkBottomLeft: "左下",
    watermarkBottomCenter: "中下",
    watermarkBottomRight: "右下",
  },

  // Image Preview
  preview: {
    original: "原始图片",
    result: "处理结果",
    processFirst: "调整设置并点击下载以处理图片",
  },

  // Batch Processing
  batch: {
    completed: "批量处理完成！",
    failed: "处理失败",
    remove: "移除",
    preview: "预览",
    pending: "等待中",
    processing: "处理中",
    done: "已完成",
    error: "错误",
    clearAll: "清空列表",
    filename: "文件名称",
    dimensions: "尺寸",
    format: "格式",
    originalSize: "原始大小",
    compressedSize: "压缩后",
    selected: "已选择",
    clickToEdit: "点击编辑设置",
    noFilesProcessed: "没有成功处理的文件",
    zipSuccess: "已打包 {count} 个文件为 ZIP 下载",
    fileCountSingle: "{count} 个文件",
    fileCountPlural: "{count} 个文件",
  },

  // Footer
  footer: {
    copyright: "© 2026 Smart Resizer. 为创作者设计",
    privacyPolicy: "隐私权政策",
    createdBy: "作者：",
    done: "完成",
    effectiveDate: "生效日期：2026-01-06",
    footerQuestions: "有任何问题？欢迎通过 GitHub 或 Email 联系我们。",
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
    title: "免费在线图片缩放与格式转换工具 (无需上传) | Image Smart Resizer",
    description:
      "免费且重视隐私的在线批量图片缩放工具。采用 Pica 高品质算法，支持 JPG、PNG、WebP、ICO 互转及 SVG 转 PNG (Favicon 制作)。所有处理完全在浏览器本地完成，无需上传服务器，确保您的数据绝对安全。",
    features:
      "在线图片缩放, 批量缩图, 图片格式转换, 照片分辨率调整, 图片压缩工具, SVG 转 PNG, 制作 Favicon, 图片裁剪, 图片旋转, WebP 转 JPG, Pica 算法, 高品质缩图, 隐私保护, 无需上传, 客户端处理",
  },

  // Errors
  errors: {
    uploadFirst: "请先上传图片",
    processingFailed: "图片处理失败",
    readFileFailed: "读取文件失败",
  },

  // Canvas Permission
  canvasPermission: {
    title: "浏览器限制了图片处理",
    description1:
      "为了保护您的隐私，我们在<strong>本地端</strong>运算图片而不上传服务器。",
    description2: "但您的浏览器判定该行为具有风险，请暂时允许本站的权限。",
    chooseBrowser: "如何解决？请选择您的浏览器：",
    braveTitle: "Brave 浏览器 (最常见)",
    braveStep1:
      '点击地址栏右侧的 <span class="font-bold text-orange-600">狮子头图标</span>。',
    braveStep2: "关闭上方的开关 (Shields DOWN)。",
    braveStep3:
      "或者：点击 Advanced View，将 &quot;Block fingerprinting&quot; 改为 Disabled。",
    firefoxTitle: "Firefox 火狐",
    firefoxStep1:
      '点击地址栏左侧的 <span class="font-bold text-purple-600">盾牌图标</span>。',
    firefoxStep2: "关闭“增强型追踪保护”。",
    firefoxStep3:
      "如果不想完全关闭，请至设置取消勾选“指纹追踪器 (Fingerprinters)”。",
    safariTitle: "Safari",
    safariStep1: "打开“偏好设置” (Settings)。",
    safariStep2: "切换到“隐私” (Privacy) 分页。",
    safariStep3: "取消勾选“防止跨网站追踪”。",
    chromeEdgeTitle: "Chrome / Edge / 其他",
    chromeEdgeDesc:
      "Chrome 通常不会阻挡。如果您看到此信息，通常是因为安装了隐私扩展程序（例如 <strong>Privacy Badger</strong>, <strong>CanvasBlocker</strong>）。",
    chromeEdgeAction: "请尝试暂停这些扩展程序后重试。",
    cancel: "取消",
    retry: "我已设置完成，重试",
  },

  // Languages
  languages: {
    en: "English",
    "zh-TW": "繁體中文",
    "zh-CN": "简体中文",
    ja: "日本語",
    ko: "한국어",
  },

  // App Icon
  appIcon: {
    customMode: "自定义尺寸",
    appIconMode: "App 图标",
    selectPlatform: "选择目标平台",
    selectPlatformDesc: "勾选您需要生成图标的平台",
    sizes: "种尺寸",
    totalOutput: "将生成",
    files: "个文件",
    organizedIn: "分类至",
    folders: "个文件夹",
    noPlatform: "请至少选择一个平台",
    noPlatformPreview: "请先选择至少一个平台",
    sourceImage: "源图片",
    outputReadOnly: "以下为各平台输出尺寸预览（只读）",
    usage: "用途",
    status: "状态",
    generateAndDownload: "生成并下载图标",
    qualityHint: "此模式以 100% 最高品质输出，不进行压缩，确保图标清晰锐利。",
    // iOS 描述
    descIosAppStore: "App Store 主图标，必须不含透明度，sRGB",
    descIosIphone3x: "iPhone 主屏幕 @3x",
    descIosIphone2x: "iPhone 主屏幕 @2x",
    descIosIpadPro2x: "iPad Pro 主屏幕 @2x",
    descIosIpad2x: "iPad 主屏幕 @2x",
    descIosSettings3x: "系统设置/偏好设置 @3x",
    descIosSettings2x: "系统设置/偏好设置 @2x",
    descIosNotification3x: "通知图标 @3x",
    descIosNotification2x: "通知图标 @2x",
    // Android 描述
    descAndroidPlayStore: "Google Play 商店图标，32-bit PNG，最大 1MB",
    descAndroidAdaptive: "自适应图标 Full Asset",
    descAndroidXxxhdpi: "启动器 xxxhdpi",
    descAndroidXxhdpi: "启动器 xxhdpi",
    descAndroidXhdpi: "启动器 xhdpi",
    descAndroidHdpi: "启动器 hdpi",
    descAndroidMdpi: "启动器 mdpi",
    descAndroidNotification: "通知图标",
    // Web 描述
    descWebFavicon32: "浏览器标签页图标",
    descWebFavicon16: "浏览器标签页图标（小）",
    descWebFaviconIco: "Favicon .ico（旧版浏览器兼容）",
    descWebAppleTouchIcon: "iOS「添加到主屏幕」时使用",
    descWebPwa512: "PWA 启动闪屏用",
    descWebPwa192: "PWA 安装图标",
    descWebOgImage: "FB/Line 社交分享预览图（1.91:1）",
  },
};
