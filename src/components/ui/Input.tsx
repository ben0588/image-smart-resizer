/**
 * Input - 基礎輸入框元件
 * UI Component - 基於 shadcn/ui 設計精神
 */

import * as React from 'react';
import { cn } from '@/src/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm',
          'placeholder:text-slate-400',
          'focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'outline-none transition-all',
          // 數字輸入框使用等寬字體
          type === 'number' && 'font-mono tabular-nums',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
