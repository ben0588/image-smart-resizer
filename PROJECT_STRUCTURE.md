# Smart Resizer - 圖片智慧調整工具

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?logo=tailwindcss)

高品質圖片縮放與格式轉換工具，所有處理皆在客戶端執行，100% 保護您的隱私。

## ✨ 核心特色

- 🔒 **完全隱私** - 所有圖片處理在瀏覽器端執行，不上傳到伺服器
- ⚡ **高品質演算法** - 使用 Pica (Lanczos3) 確保縮放品質
- 🎨 **專業設計** - Slate 冷灰基底 + Indigo 靛藍強調，SaaS 級視覺質感
- 💪 **TypeScript Strict Mode** - 完整型別安全保證
- 📦 **模組化架構** - 清晰的目錄結構，易於維護與擴展

## 🛠️ 技術堆疊

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v3.4+
- **State Management**: Zustand
- **Image Processing**: Pica (Lanczos3 演算法)
- **Icons**: Lucide React

## 📁 專案結構

```
image-smart-resizer/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根佈局
│   ├── page.tsx                 # 主頁面
│   └── globals.css              # 全域樣式
│
├── src/
│   ├── components/
│   │   ├── feature/            # 業務邏輯組件
│   │   │   ├── UploadZone.tsx      # 圖片上傳區
│   │   │   ├── ControlPanel.tsx    # 控制面板
│   │   │   └── ImagePreview.tsx    # 圖片預覽
│   │   │
│   │   └── ui/                 # 純展示型組件 (shadcn/ui 風格)
│   │       ├── Button.tsx          # 按鈕元件
│   │       ├── Input.tsx           # 輸入框元件
│   │       └── Slider.tsx          # 滑桿元件
│   │
│   ├── lib/
│   │   ├── engine/             # 圖片處理核心
│   │   │   └── processor.ts        # Pica 封裝與處理邏輯
│   │   │
│   │   └── utils.ts            # 工具函式 (格式化、驗證等)
│   │
│   ├── store/
│   │   └── imageStore.ts       # Zustand 狀態管理
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript 型別定義
│   │
│   └── hooks/                  # 自訂 Hooks (未來擴展)
│
├── public/                     # 靜態資源
├── tsconfig.json              # TypeScript 設定 (Strict Mode)
├── tailwind.config.ts         # Tailwind 設定
└── package.json               # 專案依賴
```

## 🎨 設計規範

### 配色方案 (Tailwind CSS)
- **Primary**: `bg-indigo-600` (Hover: `hover:bg-indigo-700`) - 核心行動按鈕
- **Background**: `bg-slate-50` - 應用程式全域背景
- **Surface**: `bg-white` - 卡片與操作區塊
- **Text**: `text-slate-900` (主要), `text-slate-500` (次要)
- **Border**: `border-slate-200` - 輕微邊界

### 元件樣式
- **Card**: `bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100`
- **Input**: `bg-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 tabular-nums`
- **Button**: `bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700`

## 🚀 開始使用

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

在瀏覽器開啟 [http://localhost:3000](http://localhost:3000)

### 建構生產版本
```bash
npm run build
npm run start
```

## 📚 核心功能

### 1. 圖片上傳
- 支援拖放 (Drag & Drop)
- 支援檔案瀏覽器選擇
- 自動驗證檔案類型與大小
- 支援格式：JPG, PNG, WebP

### 2. 尺寸調整
- 自訂寬度與高度
- 長寬比鎖定/解鎖
- 即時預覽效果

### 3. 格式轉換
- 支援轉換為 JPG / PNG / WebP
- 可調整品質 (1-100%)
- 自動估算檔案大小

### 4. 圖片處理
- 使用 Pica 高品質縮放演算法
- Lanczos3 重採樣確保清晰度
- 客戶端處理，不上傳伺服器

## 🔧 核心技術說明

### TypeScript Strict Mode
專案啟用完整的 TypeScript Strict Mode，包含：
- `strictNullChecks`
- `strictFunctionTypes`
- `noImplicitAny`
- `noImplicitThis`

所有 Props、State、函式參數皆有明確型別定義。

### Zustand 狀態管理
使用輕量級的 Zustand 管理全域狀態：
- 圖片檔案與預覽 URL
- 調整設定 (尺寸、格式、品質)
- 處理狀態與錯誤訊息

### Pica 圖片處理
採用業界最佳實踐的圖片縮放演算法：
- Lanczos3 重採樣
- Unsharp Mask 銳化
- Alpha 通道支援

## 🤝 貢獻指南

歡迎提交 Issue 或 Pull Request！

## 📄 授權

MIT License

---

**© 2025 Smart Resizer. 為創作者設計**
