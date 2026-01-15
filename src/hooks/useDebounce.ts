/**
 * useDebounce - 防抖 Hook
 * 提供 debounce 功能，避免頻繁觸發操作
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 通用 debounce 函式
 * @param fn - 要延遲執行的函式
 * @param delay - 延遲時間 (ms)
 * @returns 經過 debounce 處理的函式
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * useDebounce Hook - 對值進行防抖處理
 * @param value - 要 debounce 的值
 * @param delay - 延遲時間 (ms)，預設 400ms
 * @returns debounce 後的值
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebouncedCallback Hook - 對 callback 進行防抖處理
 * @param callback - 要 debounce 的 callback 函式
 * @param delay - 延遲時間 (ms)，預設 400ms
 * @returns debounce 後的 callback
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number = 400
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 保持 callback 最新
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 清理 timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}
