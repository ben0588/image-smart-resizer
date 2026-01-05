import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { LanguageProvider } from '@/src/contexts/LanguageContext';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
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
