/**
 * useLocalStorage Hook
 * 管理歷史紀錄的 LocalStorage 存取
 * Storage Key: 'smart-resizer-history'
 */

'use client';

import { useState } from 'react';
import type { HistoryItem } from '@/src/types';

const STORAGE_KEY = 'smart-resizer-history';
const MAX_HISTORY_ITEMS = 20;

/**
 * 生成 UUID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * useResizeHistory - 管理調整歷史紀錄
 */
export function useResizeHistory() {
  // 初始化時從 LocalStorage 讀取
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as HistoryItem[];
      } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  /**
   * 新增歷史紀錄
   */
  const addHistory = (width: number, height: number, label?: string) => {
    const newItem: HistoryItem = {
      id: generateId(),
      width,
      height,
      label,
      lastUsedAt: Date.now(),
    };

    setHistory((prev) => {
      // 移除重複的尺寸
      const filtered = prev.filter(
        (item) => !(item.width === width && item.height === height)
      );

      // 加入新項目並限制數量
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      // 存入 LocalStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  };

  /**
   * 清除歷史紀錄
   */
  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  /**
   * 刪除單筆歷史
   */
  const removeHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    history,
    addHistory,
    clearHistory,
    removeHistory,
  };
}

/**
 * useLocalStorage - 泛用 LocalStorage Hook
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setStoredValue = (newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue] as const;
}
