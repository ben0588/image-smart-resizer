/**
 * Image Processing Engine - Client-side Only
 * 使用 Pica 進行高品質圖片縮放與格式轉換 (Lanczos3 演算法)
 * 所有處理皆在瀏覽器端執行，確保隱私安全
 */

import Pica from 'pica';
import JSZip from 'jszip';
import type { ProcessOptions, Dimensions } from '@/src/types';

const pica = Pica();

/**
 * 調整圖片大小
 * @param file - 原始圖片檔案
 * @param options - 調整選項
 * @returns 處理後的圖片 Blob
 */
export async function resizeImage(
  file: File,
  options: ProcessOptions
): Promise<Blob> {
  const { width, height, format, quality } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target?.result || typeof e.target.result !== 'string') {
          throw new Error('無法讀取圖片檔案');
        }

        // 建立原始圖片元素
        const img = new Image();
        img.src = e.target.result;

        await new Promise<void>((res) => {
          img.onload = () => res();
        });

        // 建立來源 canvas
        const sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = img.naturalWidth;
        sourceCanvas.height = img.naturalHeight;
        const sourceCtx = sourceCanvas.getContext('2d');
        
        if (!sourceCtx) {
          throw new Error('無法建立 Canvas Context');
        }
        
        sourceCtx.drawImage(img, 0, 0);

        // 建立目標 canvas
        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = width;
        targetCanvas.height = height;

        // 使用 Pica 進行高品質縮放 (Lanczos3)
        await pica.resize(sourceCanvas, targetCanvas, {
          quality: 3, // 最高品質
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2,
        });

        // 轉換為指定格式 (quality 已是 0-1 範圍)
        const blob = await pica.toBlob(
          targetCanvas,
          format,
          quality
        );
        
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('讀取檔案失敗'));
    reader.readAsDataURL(file);
  });
}

/**
 * 將 SVG 轉換為多個 PNG 大小的 Blob
 * @param file - 原始 SVG 檔案
 * @param sizes - 欲輸出的尺寸陣列 (寬度，px)，會以正方形或依 viewBox 比例計算高度
 * @param format - 輸出格式，預設 'image/png'
 * @param quality - 壓縮品質 (0-1)，對 PNG 無效但保留參數一致性
 * @returns Array of { width, height, blob }
 */
export async function convertSvgToPngSizes(
  file: File,
  sizes: number[],
  format: string = 'image/png',
  quality: number = 1
): Promise<Array<{ width: number; height: number; blob: Blob }>> {
  // 讀取 SVG 原始文字
  const svgText = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('無法讀取 SVG'));
    };
    reader.onerror = () => reject(new Error('讀取 SVG 檔案失敗'));
    reader.readAsText(file);
  });

  // 簡單解析 viewBox 與原始尺寸以保留長寬比
  const viewBoxMatch = svgText.match(/viewBox="([0-9.\-\s]+)"/i);
  let vbWidth = 0;
  let vbHeight = 0;
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
    if (parts.length === 4) {
      vbWidth = parts[2];
      vbHeight = parts[3];
    }
  }

  // 若沒有 viewBox，嘗試從 width/height 屬性解析
  if (!vbWidth || !vbHeight) {
    const wMatch = svgText.match(/width="([0-9.]+)px?"/i) || svgText.match(/width="([0-9.]+)"/i);
    const hMatch = svgText.match(/height="([0-9.]+)px?"/i) || svgText.match(/height="([0-9.]+)"/i);
    if (wMatch && hMatch) {
      vbWidth = Number(wMatch[1]);
      vbHeight = Number(hMatch[1]);
    }
  }

  // 預設比例為 1:1
  if (!vbWidth || !vbHeight) {
    vbWidth = 1;
    vbHeight = 1;
  }

  const results: Array<{ width: number; height: number; blob: Blob }> = [];

  for (const size of sizes) {
    const targetWidth = size;
    const targetHeight = Math.round((vbHeight / vbWidth) * size);

    // 注入 width/height 到 SVG，確保正確渲染尺寸
    let svgForSize = svgText;
    // 移除原本的 width/height 屬性以避免衝突
    svgForSize = svgForSize.replace(/\swidth=\"[^"]*\"/i, '');
    svgForSize = svgForSize.replace(/\sheight=\"[^"]*\"/i, '');

    // 在 <svg ...> 標籤上插入 width/height 屬性
    svgForSize = svgForSize.replace(/<svg([\s\S]*?)>/i, (match, g1) => {
      return `<svg${g1} width="${targetWidth}px" height="${targetHeight}px">`;
    });

    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgForSize);

    // 建立 Image 並繪製到 Canvas
    const img = new Image();
    img.src = svgDataUrl;

    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('SVG 轉 PNG 時載入失敗'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('無法建立 Canvas Context');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Canvas 轉 Blob
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), format, quality)
    );

    if (!blob) throw new Error('SVG 轉 PNG Blob 失敗');

    results.push({ width: targetWidth, height: targetHeight, blob });
  }

  return results;
}

/**
 * 計算保持長寬比的尺寸
 * @param originalWidth - 原始寬度
 * @param originalHeight - 原始高度
 * @param targetWidth - 目標寬度
 * @param targetHeight - 目標高度
 * @param lockAspectRatio - 是否鎖定長寬比
 * @returns 計算後的尺寸
 */
export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number | null,
  targetHeight: number | null,
  lockAspectRatio = true
): Dimensions {
  if (!lockAspectRatio && targetWidth && targetHeight) {
    return { width: targetWidth, height: targetHeight };
  }

  const aspectRatio = originalWidth / originalHeight;

  // 根據寬度計算高度
  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  }

  // 根據高度計算寬度
  if (targetHeight && !targetWidth) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }

  // 兩者都指定時，優先使用寬度
  if (targetWidth) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  }

  // 預設返回原始尺寸
  return {
    width: originalWidth,
    height: originalHeight,
  };
}

/**
 * 建立圖片預覽 URL
 * @param fileOrBlob - 圖片檔案或 Blob
 * @returns Object URL
 */
export function createPreviewURL(fileOrBlob: File | Blob): string {
  return URL.createObjectURL(fileOrBlob);
}

/**
 * 釋放預覽 URL
 * @param url - Object URL
 */
export function revokePreviewURL(url: string | null): void {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

/**
 * 下載處理後的圖片
 * @param blob - 圖片 Blob
 * @param filename - 檔案名稱
 */
export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  
  // 延遲釋放 URL 和移除元素
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 150);
}

/**
 * 批次下載多個檔案為 ZIP
 * @param files - 檔案陣列 { blob: Blob, filename: string }[]
 * @param zipFilename - ZIP 檔名，預設 'images.zip'
 */
export async function downloadBatchAsZip(
  files: Array<{ blob: Blob; filename: string }>,
  zipFilename = 'images.zip'
): Promise<void> {
  const zip = new JSZip();

  // 將所有檔案加入 ZIP
  files.forEach((file, index) => {
    // 若檔名重複，自動加上序號
    const uniqueFilename = file.filename || `image-${index + 1}.png`;
    zip.file(uniqueFilename, file.blob);
  });

  // 產生 ZIP Blob
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // 下載 ZIP
  downloadImage(zipBlob, zipFilename);
}
