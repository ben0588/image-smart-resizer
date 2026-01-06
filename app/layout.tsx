import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { LanguageProvider, type Language } from '@/src/contexts/LanguageContext';
import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Image Smart Resizer - 智慧圖片調整工具',
  description: '高品質圖片縮放與格式轉換工具，所有處理皆在客戶端執行，保護您的隱私',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const SUPPORTED_LANGUAGES = ['en', 'zh-TW', 'zh-CN', 'ja', 'ko'];

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
    <html lang={initialLanguage === 'zh-TW' ? 'zh-TW' : initialLanguage === 'zh-CN' ? 'zh-CN' : initialLanguage}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider initialLanguage={initialLanguage}>
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
        </LanguageProvider>
      </body>
    </html>
  );
}
