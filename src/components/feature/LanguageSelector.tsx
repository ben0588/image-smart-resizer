/**
 * LanguageSelector - 語言切換選擇器
 */

'use client';

import { Globe } from 'lucide-react';
import { useTranslation } from '@/src/hooks/useTranslation';
import type { Language } from '@/src/contexts/LanguageContext';

const LANGUAGES: Language[] = ['en', 'zh-TW', 'zh-CN', 'ja', 'ko'];

export function LanguageSelector() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer">
          <Globe className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">
            {t.languages[language]}
          </span>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 py-1 bg-white rounded-lg shadow-lg border border-slate-200 min-w-35 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                language === lang
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.languages[lang]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
