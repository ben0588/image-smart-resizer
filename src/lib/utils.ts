/**
 * 樣式工具函式
 * 整合 clsx 與 tailwind-merge，避免 Tailwind 類別衝突
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { FileValidation, ImageFormat } from '@/src/types';

/**
 * 合併 Tailwind CSS 類別
 * @param inputs - 類別字串或陣列
 * @returns 合併後的類別字串
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 格式化檔案大小
 * @param bytes - 位元組數
 * @returns 格式化後的字串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 驗證圖片檔案類型
 * @param file - 檔案物件
 * @returns 驗證結果
 */
export function validateImageFile(file: File): FileValidation {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: '不支援的檔案格式，請上傳 JPG、PNG、WebP 或 SVG 檔案',
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '檔案大小超過 50MB 限制',
    };
  }
  
  return { valid: true };
}

/**
 * 取得圖片副檔名
 * @param filename - 檔案名稱
 * @returns 副檔名
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * 替換檔案副檔名並加入尺寸資訊
 * @param filename - 原始檔案名稱
 * @param format - 新格式 (MIME Type)
 * @param width - 圖片寬度
 * @param height - 圖片高度
 * @returns 新檔案名稱 (格式: 原檔名-寬x高.副檔名)
 */
export function replaceExtension(
  filename: string,
  format: ImageFormat,
  width?: number,
  height?: number
): string {
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
  const extensionMap: Record<ImageFormat, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  
  // 如果有尺寸資訊，加入檔名
  const sizeInfo = width && height ? `-${width}x${height}` : '';
  return `${nameWithoutExt}${sizeInfo}.${extensionMap[format]}`;
}

/**
 * ImageFormat 轉為簡短格式名稱
 */
export function formatToShortName(format: ImageFormat): string {
  const map: Record<ImageFormat, string> = {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
  };
  return map[format];
}
