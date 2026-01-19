import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { Button } from './Button'; // 假設你有的元件
import { useTranslation } from '@/src/hooks/useTranslation';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export function CanvasPermissionModal({ isOpen, onClose, onRetry }: PermissionModalProps) {
  const { t } = useTranslation();
  const [openBrowser, setOpenBrowser] = useState<string | null>('brave'); // 預設打開常見的 Brave

  if (!isOpen) return null;

  const toggleBrowser = (browser: string) => {
    setOpenBrowser(openBrowser === browser ? null : browser);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        
        {/* 頂部警告區塊 */}
        <div className="bg-amber-50 dark:bg-amber-950/30 p-6 flex flex-col items-center text-center border-b border-amber-100 dark:border-amber-900/50">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {t.canvasPermission.title}
          </h3>
          <p 
            className="text-sm text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: t.canvasPermission.description1 }}
          />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t.canvasPermission.description2}
          </p>
        </div>

        {/* 瀏覽器教學區塊 (手風琴樣式) */}
        <div className="p-4 max-h-[40vh] overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">
            {t.canvasPermission.chooseBrowser}
          </p>

          <div className="space-y-2">
            {/* Brave */}
            <InstructionItem 
              title={t.canvasPermission.braveTitle} 
              isOpen={openBrowser === 'brave'} 
              onClick={() => toggleBrowser('brave')}
            >
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li dangerouslySetInnerHTML={{ __html: t.canvasPermission.braveStep1 }} />
                <li dangerouslySetInnerHTML={{ __html: t.canvasPermission.braveStep2 }} />
                <li dangerouslySetInnerHTML={{ __html: t.canvasPermission.braveStep3 }} />
              </ol>
            </InstructionItem>

            {/* Firefox */}
            <InstructionItem 
              title={t.canvasPermission.firefoxTitle} 
              isOpen={openBrowser === 'firefox'} 
              onClick={() => toggleBrowser('firefox')}
            >
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li dangerouslySetInnerHTML={{ __html: t.canvasPermission.firefoxStep1 }} />
                <li dangerouslySetInnerHTML={{ __html: t.canvasPermission.firefoxStep2 }} />
                <li dangerouslySetInnerHTML={{ __html: t.canvasPermission.firefoxStep3 }} />
              </ol>
            </InstructionItem>

            {/* Safari */}
            <InstructionItem 
              title={t.canvasPermission.safariTitle} 
              isOpen={openBrowser === 'safari'} 
              onClick={() => toggleBrowser('safari')}
            >
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li dangerouslySetInnerHTML={{ __html: t.canvasPermission.safariStep1 }} />
                <li dangerouslySetInnerHTML={{ __html: t.canvasPermission.safariStep2 }} />
                <li dangerouslySetInnerHTML={{ __html: t.canvasPermission.safariStep3 }} />
              </ol>
            </InstructionItem>
            
            {/* Chrome / Edge */}
            <InstructionItem 
              title={t.canvasPermission.chromeEdgeTitle} 
              isOpen={openBrowser === 'chrome'} 
              onClick={() => toggleBrowser('chrome')}
            >
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p dangerouslySetInnerHTML={{ __html: t.canvasPermission.chromeEdgeDesc }} />
                <p>{t.canvasPermission.chromeEdgeAction}</p>
              </div>
            </InstructionItem>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t.canvasPermission.cancel}
          </Button>
          <Button className="flex-1" onClick={onRetry}>
            {t.canvasPermission.retry}
          </Button>
        </div>
      </div>
    </div>
  );
}

// 輔助元件：手風琴項目
interface InstructionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

function InstructionItem({ title, children, isOpen, onClick }: InstructionItemProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 text-left transition-colors cursor-pointer  ${
          isOpen ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}