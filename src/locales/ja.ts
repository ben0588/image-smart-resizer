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
    privacyText: `
<div class="space-y-6 text-slate-600">
  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">核心的な約束：データ収集ゼロ</h4>
    <p><strong>スマート画像リサイザー</strong>をご利用いただきありがとうございます。本ツールは<strong>「ローカルファースト」</strong>の設計思想に基づいています。プライバシーを重視しており、入力されたコンテンツをクラウドサーバーにアップロードすることはありません。</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">1. データ処理と保存方法</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>デバイスに保存</strong>：本ツールで発生するすべてのデータは、ブラウザのローカル（LocalStorage、IndexedDB、またはキャッシュ）に完全に保存されます。</li>
      <li><strong>アクセス不可の声明</strong>：開発チームはお客様のデータにアクセス、表示、編集することはできません。</li>
      <li><strong>ローカル実行</strong>：すべての演算ロジックはブラウザ内で実行されます。オフラインでも主要機能は動作します。</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">2. ホスティングと分析ツール</h4>
    <p>本ツールのコードはVercelプラットフォームでホストされています。ユーザー体験の向上のため、<strong>Vercel Analytics</strong>を使用してパフォーマンス追跡とトラフィック分析を行っています：</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>匿名分析</strong>：ブラウザの種類、デバイス、読み込み時間などの匿名化された技術情報を収集しますが、個人を特定できる情報（PII）は含まれません。</li>
      <li><strong>画像へのアクセスなし</strong>：分析ツールは利用統計のみを追跡し、処理された画像内容にアクセスすることはありません。</li>
      <li><strong>サービスの安定性</strong>：標準的なサーバーアクセスログは、接続の安定性維持のためにのみ使用されます。</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">3. データの安全性とリスク</h4>
    <p>データはブラウザ内にのみ保存されるため、キャッシュの削除やシークレットモードの使用により失われる可能性があります。一方で、クラウドからのデータ流出リスクは完全に排除されています。</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">4. クッキーと分析技術</h4>
    <p>サービスの質を向上のため、必要な技術を使用しています：</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>設定の保存</strong>：言語設定などのインターフェース設定を記録するために必要なローカルストレージを使用します。</li>
      <li><strong>匿名統計</strong>：Vercel Analyticsによる匿名のサイト統計を通じて製品のパフォーマンスを改善します。</li>
      <li><strong>広告目的の外</strong>：サードパーティの広告追跡クッキーは一切使用していません。</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">5. お問い合わせ</h4>
    <p>仕組みや安全性についてご不明な点がございましたら、こちらまでお問い合わせください：<br/><strong>メール：energy9527z@gmail.com</strong></p>
  </section>
</div>
    `,
  },

  // SEO
  seo: {
    description: "ブラウザ内で完結する、効率的でクリーン、そしてプライバシーを重視した画期的な画像リサイズツールです。",
    features: "画像リサイズ, 形式変換, SVGからPNGへの変換, プライバシー保護"
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
