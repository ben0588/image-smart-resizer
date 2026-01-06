/**
 * Next.js Middleware - 語言偵測與設定
 * 自動根據瀏覽器語言設定偏好語系（若用戶未設定過）
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LANGUAGES = ['en', 'zh-TW', 'zh-CN', 'ja', 'ko'];
const COOKIE_NAME = 'app-language';

export function middleware(request: NextRequest) {
  // 檢查是否已有語言偏好 cookie
  const savedLanguage = request.cookies.get(COOKIE_NAME)?.value;

  // 如果已有設定，直接返回
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    return NextResponse.next();
  }

  // 從瀏覽器 Accept-Language header 偵測語言
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLanguage = 'en'; // 預設英文

  if (acceptLanguage) {
    // 解析 Accept-Language: zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7
    const languages = acceptLanguage
      .split(',')
      .map((lang) => {
        const [code, qValue] = lang.trim().split(';');
        const quality = qValue ? parseFloat(qValue.split('=')[1]) : 1.0;
        return { code: code.trim(), quality };
      })
      .sort((a, b) => b.quality - a.quality);

    // 尋找支援的語言
    for (const { code } of languages) {
      // 完全匹配（如 zh-TW）
      if (SUPPORTED_LANGUAGES.includes(code)) {
        detectedLanguage = code;
        break;
      }
      
      // 部分匹配（如 zh 匹配到 zh-TW）
      const mainLang = code.split('-')[0].toLowerCase();
      if (mainLang === 'zh') {
        // 優先匹配繁體中文
        if (code.toLowerCase().includes('tw') || code.toLowerCase().includes('hk')) {
          detectedLanguage = 'zh-TW';
        } else {
          detectedLanguage = 'zh-CN';
        }
        break;
      } else if (mainLang === 'ja') {
        detectedLanguage = 'ja';
        break;
      } else if (mainLang === 'ko') {
        detectedLanguage = 'ko';
        break;
      } else if (mainLang === 'en') {
        detectedLanguage = 'en';
        break;
      }
    }
  }

  // 設定 cookie 並返回
  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, detectedLanguage, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 年
    sameSite: 'lax',
  });

  return response;
}

// 設定 middleware 適用路徑
export const config = {
  matcher: [
    /*
     * 匹配所有路徑除了：
     * - api (API routes)
     * - _next/static (靜態檔案)
     * - _next/image (圖片優化)
     * - favicon.ico, icon.svg 等靜態資源
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|.*\\.png$).*)',
  ],
};
