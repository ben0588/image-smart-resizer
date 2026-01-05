/**
 * Button - 基礎按鈕元件
 * UI Component - 基於 shadcn/ui 設計精神
 */

import * as React from 'react';
import { cn } from '@/src/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-xl font-medium transition-all cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-95',
          
          // Variant styles
          {
            'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700':
              variant === 'default',
            'border border-slate-200 bg-white hover:bg-slate-50 text-slate-900':
              variant === 'outline',
            'hover:bg-slate-100 text-slate-900': variant === 'ghost',
            'bg-rose-500 text-white hover:bg-rose-600': variant === 'destructive',
          },
          
          // Size styles
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 px-3 text-sm': size === 'sm',
            'h-11 px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
