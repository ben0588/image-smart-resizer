/**
 * AppIconControls - App 圖示模式控制元件
 *
 * 功能說明：
 * - 提供 iOS / Android / Web 三個平台的勾選控制
 * - 顯示各平台包含的尺寸規格標籤
 * - 支援「重置」操作：清除圖示結果並回到重新上傳介面
 */

"use client";

import React from "react";
import { Smartphone, Globe, Apple, RotateCcw } from "lucide-react";
import type { AppIconPlatform } from "@/src/types";
import { APP_ICON_PLATFORMS } from "@/src/lib/app-icon-presets";
import useAppStore from "@/src/store/use-app-store";
import { useTranslation } from "@/src/hooks/useTranslation";

/** 各平台對應的圖示元件 */
const platformIcons: Record<AppIconPlatform, React.ElementType> = {
  ios: Apple,
  android: Smartphone,
  web: Globe,
};

export default function AppIconControls() {
  const { t } = useTranslation();

  // ── 從 Store 取得狀態與 Actions ──
  const selectedPlatforms = useAppStore(
    (s) => s.appIconState.selectedPlatforms,
  );
  const toggleAppIconPlatform = useAppStore((s) => s.toggleAppIconPlatform);
  const reset = useAppStore((s) => s.reset);
  const resetAppIconResults = useAppStore((s) => s.resetAppIconResults);

  /**
   * 重置操作
   * 1. 清除已產生的 App 圖示結果（釋放 Object URL）
   * 2. 呼叫全域 reset 回到重新上傳介面
   */
  const handleReset = () => {
    resetAppIconResults();
    reset();
  };

  return (
    <div>
      {/* ── 標題列：平台選擇說明 + 重置按鈕 ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">
            {t.appIcon?.selectPlatform || "選擇目標平台"}
          </h3>
          <button
            onClick={handleReset}
            className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
          >
            <RotateCcw className="h-3 w-3" />
            {t.controls.reset}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          {t.appIcon?.selectPlatformDesc || "勾選您需要生成圖示的平台"}
        </p>
      </div>

      {/* ── 平台勾選卡片列表 ── */}
      <div className="space-y-3">
        {APP_ICON_PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const Icon = platformIcons[platform.id];
          const sizeCount = platform.sizes.length;

          return (
            <label
              key={platform.id}
              className={`relative flex cursor-pointer items-start rounded-lg border-2 p-4 transition-all ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleAppIconPlatform(platform.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 flex-1 text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className="font-bold text-gray-900">
                    {platform.label}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    {sizeCount} {t.appIcon?.sizes || "種尺寸"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {platform.description}
                </p>

                {/* 勾選後展開：顯示該平台所有尺寸標籤 */}
                {isSelected && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {platform.sizes.map((size) => (
                      <span
                        key={`${size.width}x${size.height}-${size.format}`}
                        className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-gray-500 ring-1 ring-gray-200"
                      >
                        {size.width}×{size.height}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* ── 統計訊息：顯示即將產生的檔案總數與資料夾數量 ── */}
      {selectedPlatforms.length > 0 && (
        <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700">
          <span className="font-semibold">
            {t.appIcon?.totalOutput || "將產生"}:{" "}
          </span>
          {APP_ICON_PLATFORMS.filter((p) =>
            selectedPlatforms.includes(p.id),
          ).reduce((sum, p) => sum + p.sizes.length, 0)}{" "}
          {t.appIcon?.files || "個檔案"}，{t.appIcon?.organizedIn || "分類至"}{" "}
          {selectedPlatforms.length} {t.appIcon?.folders || "個資料夾"}
        </div>
      )}

      {/* ── 品質提示：說明此模式不壓縮，確保圖示最高品質 ── */}
      {selectedPlatforms.length > 0 && (
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
          <svg
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>
            {t.appIcon?.qualityHint ||
              "此模式以 100% 最高品質輸出，不進行壓縮，確保圖示清晰銳利。"}
          </span>
        </div>
      )}

      {/* ── 警告提示：未選擇任何平台時顯示 ── */}
      {selectedPlatforms.length === 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
          {t.appIcon?.noPlatform || "請至少選擇一個平台"}
        </div>
      )}
    </div>
  );
}
