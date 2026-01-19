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
    dropHere: 'ここにファイルをドロップして追加',
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
    estimatedSize: '予想サイズ',
    calculating: '計算中...',
    reduction: '削減',
    calculateAllSizes: 'すべてのサイズを試算',
    downloadSingle: '画像をダウンロード',
    downloadBatch: '一括ダウンロード',
    downloadAndCompress: '圧縮してダウンロード',
    approxTotal: '合計約',
    pendingCalculation: '計算待ち',
    // フィットモード
    fitMode: 'フィットモード',
    fitCover: 'カバー',
    fitContain: '含む',
    fitFill: '引き伸ばし',
    // アスペクト比プリセット
    aspectRatioPreset: '比率',
    aspectOriginal: 'オリジナル',
    aspectCrop: 'クロップ調整',    cropModified: 'クロップ済み',
    cropReset: 'クロップリセット',    // クロップモーダル
    cropAdjustTitle: 'クロップ範囲を調整',
    cropAdjustDesc: 'ドラッグしてクロップ位置を調整',
    zoomLevel: 'ズーム',
    rotation: '回転',
    rotate90: '90度回転',
    resetCrop: '位置をリセット',
    applyCrop: '適用',
    cancel: 'キャンセル',
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
    clearAll: 'すべてクリア',
    filename: 'ファイル名',
    dimensions: 'サイズ',
    format: '形式',
    originalSize: '元のサイズ',
    compressedSize: '圧縮後',
    selected: '選択済み',
    clickToEdit: 'クリックして設定を編集',
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
    title: "無料オンライン画像サイズ変更・変換ツール (アップロード不要) | Image Smart Resizer",
    description: "プライバシー重視の無料オンライン画像一括リサイズツール。Pica高画質アルゴリズム採用。JPG、PNG、WebP、ICOの相互変換およびSVGからPNGへの変換（ファビコン作成）に対応。すべての処理はブラウザ上で完結し、サーバーへのアップロードは一切不要。セキュリティも安心です。",
    features: "オンライン画像リサイズ, 画像一括変換, 画像フォーマット変換, 解像度調整, 画像圧縮ツール, SVG PNG 変換, ファビコン作成, 画像トリミング, 画像回転, WebP JPG 変換, Picaアルゴリズム, 高画質リサイズ, プライバシー保護, アップロード不要, クライアントサイド処理",
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
