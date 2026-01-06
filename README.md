# Image Smart Resizer - 智慧圖片調整工具

一個高效、純淨且重視隱私的圖片智慧調整工具，完全在瀏覽器端完成處理。

## 🚀 主要功能

- **高品質縮放**：使用 Pica (Lanczos3 演算法) 確保縮放後的圖片畫質依然清晰。
- **批次處理**：支援同時上傳與處理多張圖片，並提供動態格狀佈局 (Adaptive Grid) 預覽。
- **格式轉換**：支援 JPG、PNG、WebP、ICO 格式互轉，並可自訂壓縮品質。
- **SVG 轉換**：支援將 SVG 檔案轉換為常見的 PNG 尺寸（48、180、192、512px），適合製作 Favicon 與應用程式圖示。
- **隱私安全**：所有圖片處理都在您的瀏覽器本地執行，圖片不會上傳到任何伺服器。
- **多語系支援**：提供繁體中文、簡體中文、英文、日文、韓文五種語言。
- **極致體驗**：
  - 智能偵測瀏覽器語系自動切換。
  - 批次下載時大於 2 個檔案自動打包為 ZIP。
  - 支援拖放上傳與圖片彈窗預覽。
  - 記憶使用者最後選用的設定。

## 🛠 技術棧

- **框架**：Next.js 15 (App Router)
- **狀態管理**：Zustand
- **圖片引擎**：Pica (High-performance JS image resizer)
- **樣式**：Tailwind CSS v4
- **語系架構**：自定義 Context + Cookie (SSR 友善)
- **打包工具**：JSZip
- **通知系統**：React-Toastify
- **圖標**：Lucide React

## 📦 安裝與執行

1. 安裝相依套件：
   ```bash
   npm install
   ```

2. 執行開發伺服器：
   ```bash
   npm run dev
   ```

3. 打包與部署：
   ```bash
   npm run build
   npm run start
   ```

## 🔒 隱私權政策

本工具基於隱私守護設計：
- **不收集圖片**：您的圖片在整個處理過程中都不會離開您的裝置。
- **無伺服器處理**：我們不使用伺服器進行任何圖片運算。
- **Local Storage / Cookies**：僅用於儲存您的偏好語系與調整設定，不會追蹤個人資料。

---

Built with ❤️ for Creators.
