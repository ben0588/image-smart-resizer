/**
 * Slider - 基礎滑桿元件
 * UI Component - 基於 shadcn/ui 設計精神
 */

import * as React from 'react';
import { cn } from '@/src/lib/utils';

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, value, min = 0, max = 100, step = 1, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {label}
            </label>
            {value !== undefined && (
              <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded tabular-nums">
                {value}%
              </span>
            )}
          </div>
        )}
        <input
          type="range"
          ref={ref}
          value={value}
          min={min}
          max={max}
          step={step}
          className={cn(
            'w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
