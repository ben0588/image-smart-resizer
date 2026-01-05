/**
 * Language Context - 多語系管理
 * 支援語言：English, 繁體中文, 簡體中文, 日本語, 한국어
 */

'use client';

import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'zh-TW' | 'zh-CN' | 'ja' | 'ko';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 載入儲存的語言設定
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-language') as Language;
      if (saved && ['en', 'zh-TW', 'zh-CN', 'ja', 'ko'].includes(saved)) {
        return saved;
      }
    }
    return 'en';
  });

  // 切換語言並儲存
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
