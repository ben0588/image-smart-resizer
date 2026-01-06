/**
 * Translations Index
 * 統一匯出所有翻譯
 */

import { en } from './en';
import { zhTW } from './zh-TW';
import { zhCN } from './zh-CN';
import { ja } from './ja';
import { ko } from './ko';
import type { Language } from '@/src/contexts/LanguageContext';

export const translations = {
  en,
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  ja,
  ko,
} as const;

export function getTranslation(lang: Language) {
  return translations[lang];
}
