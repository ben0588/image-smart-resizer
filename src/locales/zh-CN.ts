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
    formats: '支持格式：JPG、PNG、WebP',
    multipleSupport: '（支持单个或多个文件）',
    localProcessing: '本地处理，图片不会上传到服务器',
    addMore: '添加更多',
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
  },

  // Footer
  footer: {
    copyright: '© 2025 Smart Resizer. 为创作者设计',
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
