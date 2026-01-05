/**
 * Modal - 彈窗元件
 * UI Component - 通用彈窗，支援圖片預覽
 */

'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // ESC 鍵關閉
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // 防止背景滾動
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 彈窗內容 */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden flex flex-col">
        {/* 標題列 */}
        {title && (
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="關閉"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        )}
        
        {/* 內容區 */}
        <div className="overflow-auto flex-1 p-6">
          {children}
        </div>
        
        {/* 無標題時的關閉按鈕 */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
