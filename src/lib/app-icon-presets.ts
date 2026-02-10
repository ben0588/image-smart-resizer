/**
 * App Icon Presets - 三大平台圖示尺寸預設定義
 *
 * 各平台遵循官方設計規範：
 * - iOS：Apple Human Interface Guidelines
 * - Android：Material Design Guidelines
 * - Web：PWA Manifest + SEO 社群分享最佳實踐
 *
 * 資料結構：每個平台包含 id、顯示名稱、輸出資料夾名稱、以及各尺寸規格陣列
 * 檔名規範：
 *   - Web / PWA：kebab-case（如 apple-touch-icon.png），對 URL 友好利於 SEO
 *   - Android：snake_case（如 ic_launcher_xxxhdpi.png），系統資源路徑僅允許 [a-z0-9_]
 *   - iOS：kebab-case + @ 保留（如 iphone-180@3x.png），與 Web 統一且保留 iOS 慣例
 */

import type { AppIconPlatformConfig } from "@/src/types";

// ============ iOS 平台 ============

/**
 * iOS App Store / 系統圖標
 * 基於 Apple Human Interface Guidelines
 * 包含 App Store（1024px）、主畫面（@2x/@3x）、設定、通知等 9 種尺寸
 */
export const iosPlatform: AppIconPlatformConfig = {
  id: "ios",
  label: "iOS (Apple)",
  description: "iPhone, iPad, App Store",
  folder: "ios",
  sizes: [
    {
      label: "App Store",
      filename: "app-store-1024.png",
      descKey: "descIosAppStore",
      width: 1024,
      height: 1024,
      format: "image/png",
      description: "App Store 主圖標，必須不含透明度，sRGB",
    },
    {
      label: "iPhone @3x",
      filename: "iphone-180@3x.png",
      descKey: "descIosIphone3x",
      width: 180,
      height: 180,
      format: "image/png",
      description: "iPhone 主畫面 @3x",
    },
    {
      label: "iPhone @2x",
      filename: "iphone-120@2x.png",
      descKey: "descIosIphone2x",
      width: 120,
      height: 120,
      format: "image/png",
      description: "iPhone 主畫面 @2x",
    },
    {
      label: "iPad Pro @2x",
      filename: "ipad-pro-167@2x.png",
      descKey: "descIosIpadPro2x",
      width: 167,
      height: 167,
      format: "image/png",
      description: "iPad Pro 主畫面 @2x",
    },
    {
      label: "iPad @2x",
      filename: "ipad-152@2x.png",
      descKey: "descIosIpad2x",
      width: 152,
      height: 152,
      format: "image/png",
      description: "iPad 主畫面 @2x",
    },
    {
      label: "Settings @3x",
      filename: "settings-87@3x.png",
      descKey: "descIosSettings3x",
      width: 87,
      height: 87,
      format: "image/png",
      description: "系統設置/偏好設定 @3x",
    },
    {
      label: "Settings @2x",
      filename: "settings-58@2x.png",
      descKey: "descIosSettings2x",
      width: 58,
      height: 58,
      format: "image/png",
      description: "系統設置/偏好設定 @2x",
    },
    {
      label: "Notification @3x",
      filename: "notification-60@3x.png",
      descKey: "descIosNotification3x",
      width: 60,
      height: 60,
      format: "image/png",
      description: "通知圖標 @3x",
    },
    {
      label: "Notification @2x",
      filename: "notification-40@2x.png",
      descKey: "descIosNotification2x",
      width: 40,
      height: 40,
      format: "image/png",
      description: "通知圖標 @2x",
    },
  ],
};

// ============ Android 平台 ============

/**
 * Android Google Play / 系統圖標
 * 基於 Material Design Guidelines
 * 包含 Play Store（512px）、Adaptive Icon、各密度 Launcher 與通知等 8 種尺寸
 */
export const androidPlatform: AppIconPlatformConfig = {
  id: "android",
  label: "Android",
  description: "Play Store, Adaptive Icons",
  folder: "android",
  sizes: [
    {
      label: "Play Store",
      filename: "ic_play_store_512.png",
      descKey: "descAndroidPlayStore",
      width: 512,
      height: 512,
      format: "image/png",
      description: "Google Play 商店圖標，32-bit PNG，最大 1MB",
    },
    {
      label: "Adaptive Icon",
      filename: "ic_adaptive_launcher.png",
      descKey: "descAndroidAdaptive",
      width: 108,
      height: 108,
      format: "image/png",
      description: "適應性圖標 Full Asset",
    },
    {
      label: "xxxhdpi",
      filename: "ic_launcher_xxxhdpi.png",
      descKey: "descAndroidXxxhdpi",
      width: 192,
      height: 192,
      format: "image/png",
      description: "Launcher xxxhdpi",
    },
    {
      label: "xxhdpi",
      filename: "ic_launcher_xxhdpi.png",
      descKey: "descAndroidXxhdpi",
      width: 144,
      height: 144,
      format: "image/png",
      description: "Launcher xxhdpi",
    },
    {
      label: "xhdpi",
      filename: "ic_launcher_xhdpi.png",
      descKey: "descAndroidXhdpi",
      width: 96,
      height: 96,
      format: "image/png",
      description: "Launcher xhdpi",
    },
    {
      label: "hdpi",
      filename: "ic_launcher_hdpi.png",
      descKey: "descAndroidHdpi",
      width: 72,
      height: 72,
      format: "image/png",
      description: "Launcher hdpi",
    },
    {
      label: "mdpi",
      filename: "ic_launcher_mdpi.png",
      descKey: "descAndroidMdpi",
      width: 48,
      height: 48,
      format: "image/png",
      description: "Launcher mdpi",
    },
    {
      label: "Notification",
      filename: "ic_stat_notify.png",
      descKey: "descAndroidNotification",
      width: 24,
      height: 24,
      format: "image/png",
      description: "通知圖標",
    },
  ],
};

// ============ Web / PWA 平台 ============

/**
 * Web / SEO / PWA 圖標
 * 涵蓋 Favicon（含 .ico 舊版相容）、Apple Touch Icon、PWA Manifest 圖示、
 * 以及 OG Image（Facebook / Line 社群分享預覽圖）共 7 種尺寸
 */
export const webPlatform: AppIconPlatformConfig = {
  id: "web",
  label: "Web / PWA",
  description: "Favicon, PWA, OG Image",
  folder: "web",
  sizes: [
    {
      label: "Favicon 32x32",
      filename: "favicon-32x32.png",
      descKey: "descWebFavicon32",
      width: 32,
      height: 32,
      format: "image/png",
      description: "瀏覽器分頁圖標",
    },
    {
      label: "Favicon 16x16",
      filename: "favicon-16x16.png",
      descKey: "descWebFavicon16",
      width: 16,
      height: 16,
      format: "image/png",
      description: "瀏覽器分頁圖標（小）",
    },
    {
      // Google SEO 官方建議 48x48
      label: "Favicon ICO",
      filename: "favicon.ico",
      descKey: "descWebFaviconIco",
      width: 48,
      height: 48,
      format: "image/x-icon",
      description: "Favicon .ico（舊版瀏覽器相容）",
    },
    {
      label: "Apple Touch Icon",
      filename: "apple-touch-icon.png",
      descKey: "descWebAppleTouchIcon",
      width: 180,
      height: 180,
      format: "image/png",
      description: "iOS「加到主畫面」時使用",
    },
    {
      label: "PWA 512x512",
      filename: "pwa-512x512.png",
      descKey: "descWebPwa512",
      width: 512,
      height: 512,
      format: "image/png",
      description: "PWA 啟動閃屏用",
    },
    {
      label: "PWA 192x192",
      filename: "pwa-192x192.png",
      descKey: "descWebPwa192",
      width: 192,
      height: 192,
      format: "image/png",
      description: "PWA 安裝圖示",
    },
    {
      label: "OG Image",
      filename: "og-image.png",
      descKey: "descWebOgImage",
      width: 1200,
      height: 630,
      format: "image/png",
      description: "FB/Line 社群分享預覽圖（1.91:1）",
    },
  ],
};

// ============ 匯出：預設集合與查詢工具 ============

/** 所有平台預設集合（供 UI 迭代與處理引擎使用） */
export const APP_ICON_PLATFORMS: AppIconPlatformConfig[] = [
  iosPlatform,
  androidPlatform,
  webPlatform,
];

/** 根據平台 ID 取得對應的預設設定，找不到時回傳 undefined */
export function getPlatformConfig(
  id: string,
): AppIconPlatformConfig | undefined {
  return APP_ICON_PLATFORMS.find((p) => p.id === id);
}
