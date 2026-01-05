/**
 * useTranslation Hook
 * 便捷的翻譯 hook
 */

import { useLanguage } from '@/src/contexts/LanguageContext';
import { getTranslation } from '@/src/locales';

export function useTranslation() {
  const { language, setLanguage } = useLanguage();
  const t = getTranslation(language);

  return { t, language, setLanguage };
}
