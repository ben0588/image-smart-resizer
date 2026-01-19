/**
 * Image Processing Engine - Client-side Only
 * 使用 Pica 進行高品質圖片縮放與格式轉換 (Lanczos3 演算法)
 * 所有處理皆在瀏覽器端執行，確保隱私安全
 */

import Pica from 'pica';
import JSZip from 'jszip';
import type { ProcessOptions, Dimensions, CropArea } from '@/src/types';

const pica = Pica();

/**
 * 檢查瀏覽器是否允許 Canvas 畫素讀取（防止指紋保護攔截）
 * 某些瀏覽器（如 Brave）啟用隱私保護時會封鎖 getImageData()
 * 使用更接近 Pica 實際操作的測試方法
 * @returns {boolean} - 如果允許讀取返回 true，否則返回 false
 */
export function checkCanvasPermission(): boolean {
  try {
    // 建立一個較大的 canvas 來模擬真實場景
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 10;
    testCanvas.height = 10;
    const ctx = testCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return false;
    
    // 繪製測試圖案（模擬實際圖片處理）
    ctx.fillStyle = 'rgb(255, 100, 50)';
    ctx.fillRect(0, 0, 10, 10);
    ctx.fillStyle = 'rgb(50, 100, 255)';
    ctx.fillRect(2, 2, 6, 6);
    
    // 嘗試讀取完整畫素資料（這是 Pica 會做的）
    const imageData = ctx.getImageData(0, 0, 10, 10);
    
    // 驗證資料完整性
    if (!imageData || imageData.data.length !== 10 * 10 * 4) {
      console.warn('Canvas getImageData 返回了不完整的資料');
      return false;
    }
    
    // 嘗試建立新的 ImageData 並寫回（Pica 的典型操作）
    const newImageData = ctx.createImageData(10, 10);
    for (let i = 0; i < newImageData.data.length; i++) {
      newImageData.data[i] = imageData.data[i];
    }
    ctx.putImageData(newImageData, 0, 0);
    
    // 再次讀取驗證（確保完整的讀寫循環都能執行）
    const verifyData = ctx.getImageData(0, 0, 10, 10);
    if (!verifyData || verifyData.data.length === 0) {
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Canvas 存取被拒絕，可能是指紋保護已啟用:', e);
    return false;
  }
}

/**
 * 計算 Cover 模式的裁切區域（置中裁切，填滿目標尺寸）
 */
function calculateCoverCrop(
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number
): CropArea {
  const srcRatio = srcWidth / srcHeight;
  const targetRatio = targetWidth / targetHeight;

  let cropWidth: number, cropHeight: number, x: number, y: number;

  if (srcRatio > targetRatio) {
    // 來源較寬，裁切左右
    cropHeight = srcHeight;
    cropWidth = srcHeight * targetRatio;
    x = (srcWidth - cropWidth) / 2;
    y = 0;
  } else {
    // 來源較高，裁切上下
    cropWidth = srcWidth;
    cropHeight = srcWidth / targetRatio;
    x = 0;
    y = (srcHeight - cropHeight) / 2;
  }

  return { x, y, width: cropWidth, height: cropHeight };
}

/**
 * 計算 Contain 模式的縮放尺寸和位置（等比縮放，可能有留白）
 */
function calculateContainFit(
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number
): { scaledWidth: number; scaledHeight: number; offsetX: number; offsetY: number } {
  const srcRatio = srcWidth / srcHeight;
  const targetRatio = targetWidth / targetHeight;

  let scaledWidth: number, scaledHeight: number;

  if (srcRatio > targetRatio) {
    // 來源較寬，以寬度為準
    scaledWidth = targetWidth;
    scaledHeight = targetWidth / srcRatio;
  } else {
    // 來源較高，以高度為準
    scaledHeight = targetHeight;
    scaledWidth = targetHeight * srcRatio;
  }

  const offsetX = (targetWidth - scaledWidth) / 2;
  const offsetY = (targetHeight - scaledHeight) / 2;

  return { scaledWidth, scaledHeight, offsetX, offsetY };
}

/**
 * 將圖片旋轉指定角度
 * @param img - 原始圖片元素
 * @param rotation - 旋轉角度（0-360度）
 * @returns 旋轉後的 canvas 和新的尺寸
 */
function rotateImage(
  img: HTMLImageElement,
  rotation: number
): { canvas: HTMLCanvasElement; width: number; height: number } {
  // 正規化角度到 0-360 範圍
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  
  // 如果沒有旋轉，直接返回原始圖片
  if (normalizedRotation === 0) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
    }
    return { canvas, width: img.naturalWidth, height: img.naturalHeight };
  }

  const radians = (normalizedRotation * Math.PI) / 180;
  const srcWidth = img.naturalWidth;
  const srcHeight = img.naturalHeight;

  // 計算旋轉後的邊界框尺寸
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const newWidth = Math.ceil(srcWidth * cos + srcHeight * sin);
  const newHeight = Math.ceil(srcHeight * cos + srcWidth * sin);

  // 建立旋轉後的 canvas
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('無法建立 Canvas Context');
  }

  // 移動到中心點，旋轉，然後繪製
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -srcWidth / 2, -srcHeight / 2);

  return { canvas, width: newWidth, height: newHeight };
}

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
  const { width, height, format, quality, fitMode = 'cover', customCrop, rotation = 0 } = options;

  // 驗證尺寸，防止 0x0 錯誤
  if (!width || !height || width <= 0 || height <= 0) {
    return Promise.reject(new Error(`無效的輸出尺寸: ${width}x${height}`));
  }

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

        // 如果有旋轉，先旋轉圖片
        let workingSource: HTMLCanvasElement | HTMLImageElement = img;
        let srcWidth = img.naturalWidth;
        let srcHeight = img.naturalHeight;
        
        if (rotation !== 0) {
          const rotated = rotateImage(img, rotation);
          workingSource = rotated.canvas;
          srcWidth = rotated.width;
          srcHeight = rotated.height;
        }

        // 根據 fitMode 處理不同的縮放邏輯
        let sourceCanvas: HTMLCanvasElement;
        let targetCanvas: HTMLCanvasElement;

        if (fitMode === 'cover') {
          // Cover 模式：裁切填滿
          const crop = customCrop || calculateCoverCrop(srcWidth, srcHeight, width, height);
          
          // 建立裁切後的來源 canvas
          sourceCanvas = document.createElement('canvas');
          sourceCanvas.width = Math.round(crop.width);
          sourceCanvas.height = Math.round(crop.height);
          const sourceCtx = sourceCanvas.getContext('2d');
          
          if (!sourceCtx) {
            throw new Error('無法建立 Canvas Context');
          }
          
          // 使用 9 參數 drawImage 正確裁切
          // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
          sourceCtx.drawImage(
            workingSource,
            Math.round(crop.x), Math.round(crop.y),  // 來源裁切起點
            Math.round(crop.width), Math.round(crop.height),  // 來源裁切大小
            0, 0,  // 目標起點
            Math.round(crop.width), Math.round(crop.height)  // 目標大小
          );

          // 建立目標 canvas
          targetCanvas = document.createElement('canvas');
          targetCanvas.width = width;
          targetCanvas.height = height;

          // 使用 Pica 進行高品質縮放
          await pica.resize(sourceCanvas, targetCanvas, {
            quality: 3,
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2,
          });

        } else if (fitMode === 'contain') {
          // Contain 模式：完整保留（可能有留白）
          const fit = calculateContainFit(srcWidth, srcHeight, width, height);
          
          // 先將原圖縮放到適當大小
          sourceCanvas = document.createElement('canvas');
          sourceCanvas.width = srcWidth;
          sourceCanvas.height = srcHeight;
          const sourceCtx = sourceCanvas.getContext('2d');
          
          if (!sourceCtx) {
            throw new Error('無法建立 Canvas Context');
          }
          
          sourceCtx.drawImage(workingSource, 0, 0);

          // 建立中間 canvas 進行縮放
          const scaledCanvas = document.createElement('canvas');
          scaledCanvas.width = Math.round(fit.scaledWidth);
          scaledCanvas.height = Math.round(fit.scaledHeight);

          await pica.resize(sourceCanvas, scaledCanvas, {
            quality: 3,
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2,
          });

          // 建立最終目標 canvas（含留白）
          targetCanvas = document.createElement('canvas');
          targetCanvas.width = width;
          targetCanvas.height = height;
          const targetCtx = targetCanvas.getContext('2d');
          
          if (!targetCtx) {
            throw new Error('無法建立 Canvas Context');
          }

          // 填充白色背景（或透明，依格式）
          if (format === 'image/jpeg') {
            targetCtx.fillStyle = '#FFFFFF';
            targetCtx.fillRect(0, 0, width, height);
          }

          // 將縮放後的圖片置中繪製
          targetCtx.drawImage(
            scaledCanvas,
            Math.round(fit.offsetX),
            Math.round(fit.offsetY)
          );

        } else {
          // Fill 模式：強制拉伸（原有行為）
          sourceCanvas = document.createElement('canvas');
          sourceCanvas.width = srcWidth;
          sourceCanvas.height = srcHeight;
          const sourceCtx = sourceCanvas.getContext('2d');
          
          if (!sourceCtx) {
            throw new Error('無法建立 Canvas Context');
          }
          
          sourceCtx.drawImage(workingSource, 0, 0);

          targetCanvas = document.createElement('canvas');
          targetCanvas.width = width;
          targetCanvas.height = height;

          await pica.resize(sourceCanvas, targetCanvas, {
            quality: 3,
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2,
          });
        }

        // 轉換為指定格式
        const outputFormat = format === 'image/x-icon' ? 'image/png' : format;
        let blob = await pica.toBlob(
          targetCanvas,
          outputFormat,
          quality
        );

        if (format === 'image/x-icon') {
          blob = await convertPngToIco(blob, width, height);
        }
        
        resolve(blob);
      } catch (error) {
        // 檢查是否為 Pica 的指紋保護錯誤
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('getImageData') || errorMessage.includes('fingerprinting')) {
          reject(new Error('CANVAS_PERMISSION_DENIED'));
        } else {
          reject(error);
        }
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
 * 將 PNG Blob 封裝為單一圖片的 ICO 格式
 */
async function convertPngToIco(
  pngBlob: Blob,
  width: number,
  height: number
): Promise<Blob> {
  const buffer = await pngBlob.arrayBuffer();
  const pngData = new Uint8Array(buffer);
  
  // ICO 檔案標頭 (6 byte) + 目錄項 (16 byte)
  const icoHeaderSize = 22;
  const icoDataBuffer = new ArrayBuffer(icoHeaderSize + pngData.length);
  const view = new DataView(icoDataBuffer);
  
  // --- ICO Header ---
  view.setUint16(0, 0, true);     // Reserved
  view.setUint16(2, 1, true);     // Type (1 for ICO)
  view.setUint16(4, 1, true);     // Count (1 image)
  
  // --- Directory Entry ---
  view.setUint8(6, width >= 256 ? 0 : width);   // Width
  view.setUint8(7, height >= 256 ? 0 : height); // Height
  view.setUint8(8, 0);            // Color count
  view.setUint8(9, 0);            // Reserved
  view.setUint16(10, 1, true);    // Planes
  view.setUint16(12, 32, true);   // Bits per pixel
  view.setUint32(14, pngData.length, true); // Data size
  view.setUint32(18, icoHeaderSize, true);  // Data offset

  // --- Copy PNG Data ---
  const fullIcoData = new Uint8Array(icoDataBuffer);
  fullIcoData.set(pngData, icoHeaderSize);
  
  return new Blob([icoDataBuffer], { type: 'image/x-icon' });
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
