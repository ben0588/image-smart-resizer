/**
 * AppIconPreview - App 圖示模式的左側預覽元件
 * 以手風琴（Accordion）方式列出各平台的所有尺寸
 *
 * 行為規則：
 * - 只勾選 1 個平台：預設展開該平台
 * - 勾選多個平台：預設全部收合
 * - 不可編輯或調整尺寸（純展示）
 */

"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  Smartphone,
  Globe,
  Apple,
  ImageIcon,
  Check,
} from "lucide-react";
import type { AppIconPlatform } from "@/src/types";
import { APP_ICON_PLATFORMS } from "@/src/lib/app-icon-presets";
import { formatToShortName } from "@/src/lib/utils";
import useAppStore from "@/src/store/use-app-store";
import { useTranslation } from "@/src/hooks/useTranslation";

const platformIcons: Record<AppIconPlatform, React.ElementType> = {
  ios: Apple,
  android: Smartphone,
  web: Globe,
};

export default function AppIconPreview() {
  const { t } = useTranslation();
  const selectedPlatforms = useAppStore(
    (s) => s.appIconState.selectedPlatforms,
  );
  const results = useAppStore((s) => s.appIconState.results);
  const isProcessing = useAppStore((s) => s.appIconState.isProcessing);
  const sourcePreviewUrl = useAppStore((s) => s.sourcePreviewUrl);

  // 根據選擇的平台數量產生一個穩定的 key，用來重置展開狀態
  const platformKey = selectedPlatforms.sort().join(",");

  // 手風琴展開狀態 - 使用 useMemo 衍生初始值
  const defaultExpanded = useMemo<AppIconPlatform[]>(() => {
    if (selectedPlatforms.length === 1) {
      return [selectedPlatforms[0]];
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformKey]);

  const [expandedPlatforms, setExpandedPlatforms] =
    useState<AppIconPlatform[]>(defaultExpanded);

  // 當 defaultExpanded 因為平台切換而改變時，同步更新 state
  const [prevKey, setPrevKey] = useState(platformKey);
  if (prevKey !== platformKey) {
    setPrevKey(platformKey);
    setExpandedPlatforms(
      selectedPlatforms.length === 1 ? [selectedPlatforms[0]] : [],
    );
  }

  const toggleExpand = (platform: AppIconPlatform) => {
    setExpandedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  const hasResults = Object.keys(results).length > 0;

  // 取得選中的平台設定
  const activePlatforms = APP_ICON_PLATFORMS.filter((p) =>
    selectedPlatforms.includes(p.id),
  );

  if (selectedPlatforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-50 p-8 lg:col-span-8">
        <ImageIcon className="h-16 w-16 text-slate-300" />
        <p className="mt-4 text-sm text-slate-400">
          {t.appIcon?.noPlatformPreview || "請先選擇至少一個平台"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-slate-50 lg:col-span-8">
      {/* 上方：來源圖片小縮圖 */}
      {sourcePreviewUrl && (
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sourcePreviewUrl}
            alt="source"
            className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
          />
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">
              {t.appIcon?.sourceImage || "來源圖片"}
            </span>
            <p className="text-[10px] text-slate-400">
              {t.appIcon?.outputReadOnly || "以下為各平台輸出尺寸預覽（唯讀）"}
            </p>
          </div>
          {isProcessing && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-indigo-600">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              {t.controls.processing}
            </div>
          )}
        </div>
      )}

      {/* 手風琴列表 */}
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {activePlatforms.map((platform) => {
          const isExpanded = expandedPlatforms.includes(platform.id);
          const Icon = platformIcons[platform.id];
          const completedCount = platform.sizes.filter((size) => {
            const key = `${platform.id}-${size.width}x${size.height}-${size.format}`;
            return results[key];
          }).length;

          return (
            <div
              key={platform.id}
              className="border-b border-slate-200 last:border-b-0"
            >
              {/* 手風琴標頭 */}
              <button
                onClick={() => toggleExpand(platform.id)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-100"
              >
                <Icon className="h-4 w-4 shrink-0 text-slate-600" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {platform.label}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    {platform.sizes.length} {t.appIcon?.sizes || "種尺寸"}
                  </span>
                  {hasResults && completedCount > 0 && (
                    <span className="ml-2 inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                      <Check className="h-2.5 w-2.5" />
                      {completedCount}/{platform.sizes.length}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  /{platform.folder}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* 手風琴內容 - 尺寸列表 */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-white px-4 py-2">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] tracking-wider text-slate-400 uppercase">
                        <th className="py-1 text-left font-medium">
                          {t.appIcon?.usage || "用途"}
                        </th>
                        <th className="py-1 text-center font-medium">
                          {t.controls.dimensions || "尺寸"}
                        </th>
                        <th className="py-1 text-center font-medium">
                          {t.controls.format || "格式"}
                        </th>
                        <th className="py-1 text-right font-medium">
                          {t.appIcon?.status || "狀態"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {platform.sizes.map((size) => {
                        const key = `${platform.id}-${size.width}x${size.height}-${size.format}`;
                        const result = results[key];

                        return (
                          <tr
                            key={key}
                            className="group text-xs transition-colors hover:bg-slate-50"
                          >
                            <td className="py-2 pr-2">
                              <div className="flex items-center gap-2">
                                {result ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={result.url}
                                    alt={size.label}
                                    className="h-6 w-6 shrink-0 rounded border border-slate-200 bg-white object-cover"
                                  />
                                ) : (
                                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50">
                                    <ImageIcon className="h-3 w-3 text-slate-300" />
                                  </div>
                                )}
                                <div>
                                  <span className="font-medium text-slate-700">
                                    {size.label}
                                  </span>
                                  {(size.descKey || size.description) && (
                                    <p className="text-[10px] leading-tight text-slate-400">
                                      {(t.appIcon as Record<string, string>)?.[
                                        size.descKey
                                      ] || size.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-2 text-center font-mono text-slate-500">
                              {size.width}×{size.height}
                            </td>
                            <td className="py-2 text-center text-slate-500">
                              {formatToShortName(size.format)}
                            </td>
                            <td className="py-2 text-right">
                              {result ? (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                                  <Check className="h-2.5 w-2.5" />
                                  {t.batch.done}
                                </span>
                              ) : isProcessing ? (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                                  <div className="h-2 w-2 animate-spin rounded-full border border-indigo-600 border-t-transparent" />
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-300">
                                  {t.batch.pending}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
