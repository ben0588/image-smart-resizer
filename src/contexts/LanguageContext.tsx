/**
 * Language Context - 多語系管理
 * 支援語言：English, 繁體中文, 簡體中文, 日本語, 한국어
 * 使用 Cookie 儲存語言偏好，支援 SSR
 */

'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

export type Language = 'en' | 'zh-TW' | 'zh-CN' | 'ja' | 'ko';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const COOKIE_NAME = 'app-language';

// 設定 Cookie
function setLanguageCookie(lang: Language) {
  if (typeof document === 'undefined') return;
  
  const maxAge = 60 * 60 * 24 * 365; // 1 年
  document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=${maxAge}; samesite=lax`;
}

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language; // 從伺服器端傳入的初始語言
}

export function LanguageProvider({ children, initialLanguage = 'en' }: LanguageProviderProps) {
  const router = useRouter();
  // 使用從伺服器端傳入的初始語言，確保 SSR 和客戶端一致
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // 切換語言並儲存到 Cookie
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLanguageCookie(lang);
    // 強制 Next.js 重新整理伺服器組件，以更新 Metadata (generateMetadata)
    router.refresh();
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
