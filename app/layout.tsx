
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { LanguageProvider, type Language } from '@/src/contexts/LanguageContext';
import { ToastContainer } from 'react-toastify';
import { Analytics } from "@vercel/analytics/react"
import JsonLd from '@/src/components/JsonLd';
import { translations } from '@/src/locales';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SUPPORTED_LANGUAGES = ['en', 'zh-TW', 'zh-CN', 'ja', 'ko'];

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export async function generateMetadata(): Promise<Metadata> {
  // 從伺服器端讀取 Cookie 中的語言偏好
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get('app-language')?.value;
  const lang: Language = 
    savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)
      ? (savedLanguage as Language)
      : 'en';

  const t = translations[lang];

  return {
    // 基礎設定
    title: {
      template: `%s | ${t.seo.title}`,
      default: t.seo.title,
    },
    description: t.seo.description,
    
    // 關鍵字
    keywords: t.seo.features.split(', '),

    // 作者與版權
    authors: [{ name: 'ben0588' }],
    creator: 'ben0588',
    
    // 讓搜尋引擎正確索引
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      title: t.seo.title,
      description: t.seo.description,
      url: 'https://image-smart-resizer.vercel.app',
      siteName: t.title,
      locale: lang.replace('-', '_'),
      type: 'website',
      images: [
        {
          url: 'https://image-smart-resizer.vercel.app/1200x630.png',
          width: 1200,
          height: 630,
          alt: t.title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: t.seo.title,
      description: t.seo.description,
      images: ['https://image-smart-resizer.vercel.app/1200x630.png'],
    },

    // 圖示
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },

    // 語言替代連結
    alternates: {
      canonical: 'https://image-smart-resizer.vercel.app',
      languages: {
        'en': 'https://image-smart-resizer.vercel.app/en',
        'zh-TW': 'https://image-smart-resizer.vercel.app/zh-TW',
        'zh-CN': 'https://image-smart-resizer.vercel.app/zh-CN',
        'ja': 'https://image-smart-resizer.vercel.app/ja',
        'ko': 'https://image-smart-resizer.vercel.app/ko',
        'x-default': 'https://image-smart-resizer.vercel.app/en',
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 從伺服器端讀取 Cookie 中的語言偏好
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get('app-language')?.value;
  const initialLanguage: Language = 
    savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)
      ? (savedLanguage as Language)
      : 'en';

  return (
    <html lang={initialLanguage}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <JsonLd />
          {children}
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {/* Vercel 分析流量 */}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
