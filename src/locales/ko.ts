/**
 * Korean (한국어) Translations
 */

import type { Translation } from './en';

export const ko: Translation = {
  // Header
  title: '스마트 이미지 리사이저',
  subtitle: '고품질 클라이언트 측 이미지 크기 조정, 개인정보 보호',

  // Upload Zone
  upload: {
    title: '이미지 업로드',
    dragDrop: '여기에 이미지를 드래그하세요',
    or: '또는',
    browse: '파일 선택',
    formats: '지원 형식: JPG, PNG, WebP',
    multipleSupport: '(단일 또는 여러 파일 지원)',
    localProcessing: '로컬 처리, 이미지가 서버에 업로드되지 않습니다',
    addMore: '더 추가',
  },

  // Control Panel
  controls: {
    dimensions: '크기',
    width: '너비',
    height: '높이',
    maintainAspectRatio: '종횡비 고정',
    toggleAspectRatio: '종횡비 고정 전환',
    history: '기록',
    format: '형식',
    quality: '품질',
    smallerFile: '파일 작게',
    bestQuality: '최고 품질',
    download: '이미지 다운로드',
    processing: '처리 중...',
    applySize: '이 크기 적용',
    deleteHistory: '이 기록 삭제',
    reset: '리셋',
  },

  // Image Preview
  preview: {
    original: '원본',
    result: '결과',
    processFirst: '설정을 조정하고 다운로드를 클릭하여 처리',
  },

  // Batch Processing
  batch: {
    completed: '일괄 처리 완료!',
    failed: '처리 실패',
    remove: '제거',
    preview: '미리보기',
    pending: '대기 중',
    processing: '처리 중',
    done: '완료',
    error: '오류',
  },

  // Footer
  footer: {
    copyright: '© 2025 Smart Resizer. 크리에이터를 위해 설계',
  },

  // Errors
  errors: {
    uploadFirst: '먼저 이미지를 업로드하세요',
    processingFailed: '이미지 처리 실패',
    readFileFailed: '파일 읽기 실패',
  },

  // Languages
  languages: {
    en: 'English',
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    ja: '日本語',
    ko: '한국어',
  },
};
