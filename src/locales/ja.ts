/**
 * Japanese (日本語) Translations
 */

import type { Translation } from './en';

export const ja: Translation = {
  // Header
  title: 'スマート画像リサイザー',
  subtitle: '高品質クライアントサイド画像リサイズ、プライバシー保護',

  // Upload Zone
  upload: {
    title: '画像をアップロード',
    dragDrop: 'ここに画像をドラッグ＆ドロップ',
    or: 'または',
    browse: 'ファイルを選択',
    formats: '対応形式：JPG、PNG、WebP、ICO',
    multipleSupport: '（単一または複数のファイルに対応）',
    localProcessing: 'ローカル処理、画像はサーバーにアップロードされません',
    addMore: 'さらに追加',
  },

  // Control Panel
  controls: {
    dimensions: 'サイズ',
    width: '幅',
    height: '高さ',
    maintainAspectRatio: '縦横比を固定',
    toggleAspectRatio: '縦横比固定を切り替え',
    history: '履歴',
    format: '形式',
    quality: '品質',
    smallerFile: 'ファイルサイズ小',
    bestQuality: '最高品質',
    download: '画像をダウンロード',
    processing: '処理中...',
    applySize: 'このサイズを適用',
    deleteHistory: 'この履歴を削除',
    reset: 'リセット',
  },

  // Image Preview
  preview: {
    original: 'オリジナル',
    result: '結果',
    processFirst: '設定を調整してダウンロードをクリックして処理',
  },

  // Batch Processing
  batch: {
    completed: 'バッチ処理完了！',
    failed: '処理に失敗しました',
    remove: '削除',
    preview: 'プレビュー',
    pending: '待機中',
    processing: '処理中',
    done: '完了',
    error: 'エラー',
  },

  // Footer
  footer: {
    copyright: '© 2026 Smart Resizer. クリエイターのために設計',
    privacyPolicy: 'プライバシーポリシー',
    createdBy: '作成者:',
    privacyText: 'すべての画像処理はブラウザ内でローカルに行われます。データがサーバーにアップロードされることはありません。',
  },

  // Errors
  errors: {
    uploadFirst: '先に画像をアップロードしてください',
    processingFailed: '画像処理に失敗しました',
    readFileFailed: 'ファイルの読み込みに失敗しました',
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
