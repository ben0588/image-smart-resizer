import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { Button } from './Button'; // 假設你有的元件

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export function CanvasPermissionModal({ isOpen, onClose, onRetry }: PermissionModalProps) {
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
            瀏覽器限制了圖片處理
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            為了保護您的隱私，我們在<strong>本地端</strong>運算圖片而不上傳伺服器。
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            但您的瀏覽器判定該行為具有風險，請暫時允許本站的權限。
          </p>
        </div>

        {/* 瀏覽器教學區塊 (手風琴樣式) */}
        <div className="p-4 max-h-[40vh] overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">
            如何解決？請選擇您的瀏覽器：
          </p>

          <div className="space-y-2">
            {/* Brave */}
            <InstructionItem 
              title="Brave 瀏覽器 (最常見)" 
              isOpen={openBrowser === 'brave'} 
              onClick={() => toggleBrowser('brave')}
            >
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>點擊網址列右側的 <span className="font-bold text-orange-600">獅子頭圖示</span>。</li>
                <li>關閉上方的開關 (Shields DOWN)。</li>
                <li>或者：點擊 Advanced View，將 &quot;Block fingerprinting&quot; 改為 Disabled。</li>
              </ol>
            </InstructionItem>

            {/* Firefox */}
            <InstructionItem 
              title="Firefox 火狐" 
              isOpen={openBrowser === 'firefox'} 
              onClick={() => toggleBrowser('firefox')}
            >
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>點擊網址列左側的 <span className="font-bold text-purple-600">盾牌圖示</span>。</li>
                <li>關閉「增強型追蹤保護」。</li>
                <li>如果不想完全關閉，請至設定取消勾選「指紋追蹤器 (Fingerprinters)」。</li>
              </ol>
            </InstructionItem>

            {/* Safari */}
            <InstructionItem 
              title="Safari" 
              isOpen={openBrowser === 'safari'} 
              onClick={() => toggleBrowser('safari')}
            >
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>打開「偏好設定」 (Settings)。</li>
                <li>切換到「隱私權」 (Privacy) 分頁。</li>
                <li>取消勾選「防止跨網站追蹤」。</li>
              </ol>
            </InstructionItem>
            
            {/* Chrome / Edge */}
            <InstructionItem 
              title="Chrome / Edge / 其他" 
              isOpen={openBrowser === 'chrome'} 
              onClick={() => toggleBrowser('chrome')}
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Chrome 通常不會阻擋。如果您看到此訊息，通常是因為安裝了隱私擴充套件（例如 <strong>Privacy Badger</strong>, <strong>CanvasBlocker</strong>）。
                <br/><br/>
                請嘗試暫停這些套件後重試。
              </p>
            </InstructionItem>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            取消
          </Button>
          <Button className="flex-1" onClick={onRetry}>
            我已設定完成，重試
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