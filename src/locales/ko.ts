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
    formats: '지원 형식: JPG, PNG, WebP, ICO',
    multipleSupport: '(단일 또는 여러 파일 지원)',
    localProcessing: '로컬 처리, 이미지가 서버에 업로드되지 않습니다',
    addMore: '더 추가',
    dropHere: '파일을 여기에 드롭하여 추가',
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
    estimatedSize: '예상 크기',
    calculating: '계산 중...',
    reduction: '감소',
    calculateAllSizes: '모든 크기 계산',
    downloadSingle: '이미지 다운로드',
    downloadBatch: '모두 다운로드',
    downloadAndCompress: '압축 및 다운로드',
    approxTotal: '총',
    pendingCalculation: '계산 대기',
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
    clearAll: '모두 지우기',
    filename: '파일명',
    dimensions: '크기',
    format: '형식',
    originalSize: '원본 크기',
    compressedSize: '압축 후',
    selected: '선택됨',
    clickToEdit: '클릭하여 설정 편집',
  },

  // Footer
  footer: {
    copyright: '© 2026 Smart Resizer. 크리에이터를 위해 설계',
    privacyPolicy: '개인정보 처리방침',
    createdBy: '제작자:',
    privacyText: `
<div class="space-y-6 text-slate-600">
  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">핵심 약속: 데이터 수집 제로</h4>
    <p><strong>스마트 이미지 리사이저</strong>를 이용해 주셔서 감사합니다. 이 도구는 <strong>「로컬 우선(Local-First)」</strong> 설계 원칙을 따릅니다. 사용자의 개인정보를 매우 소중하게 생각하며, 입력된 모든 콘텐츠는 클라우드 서버에 업로드되지 않습니다.</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">1. 데이터 처리 및 저장 방식</h4>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>사용자 기기에 저장</strong>：사용자가 입력하거나 생성한 모든 데이터는 브라우저 로컬(LocalStorage, IndexedDB 또는 캐시)에만 저장됩니다.</li>
      <li><strong>접근 불가 성명</strong>：개발팀은 사용자의 어떠한 데이터도 열람하거나 편집, 접근할 권한이 없습니다.</li>
      <li><strong>로컬 실행</strong>：모든 연산 및 처리 로직은 브라우저 내에서 실행됩니다. 오프라인 상태에서도 주요 기능이 작동합니다.</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">2. 호스팅 및 분석 도구</h4>
    <p>본 도구의 코드는 Vercel 플랫폼에서 호스팅됩니다. 사용자 경험을 개선하기 위해, <strong>Vercel Analytics</strong>를 사용하여 성능 추적 및 트래픽 분석을 수행합니다：</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>익명 분석</strong>：브라우저 유형, 기기 유형, 로딩 시간 등 익명화된 기술 정보를 수집하며, 개인 식별 정보(PII)는 포함되지 않습니다.</li>
      <li><strong>이미지 접근 불가</strong>：분석 도구는 사이트 이용 행태만을 추적하며, 처리되는 이미지 내용에는 접근할 수 없습니다.</li>
      <li><strong>서비스 안정성</strong>：표준 서버 로그는 연결 안정성 및 유지보수 목적으로만 사용됩니다.</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">3. 데이터 보안 및 위험</h4>
    <p>데이터는 브라우저 내에만 저장되므로 캐시를 지우거나 시크릿 모드를 사용하면 유실될 수 있습니다. 대신 클라우드 데이터 유출에 따른 위험이 없습니다.</p>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">4. 쿠키 및 분석 기술</h4>
    <p>서비스 품질 향상을 위해 필요한 기술을 사용합니다：</p>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li><strong>환경 설정</strong>：언어 설정과 같은 인터페이스 선호도를 기록하기 위해 로컬 스토리지를 사용합니다.</li>
      <li><strong>익명 통계</strong>：Vercel Analytics를 통한 익명 방문 통계로 제품 성능을 개선합니다.</li>
      <li><strong>광고 목적 없음</strong>：어떠한 제3자 광고 추적 쿠키도 사용하지 않습니다.</li>
    </ul>
  </section>

  <section>
    <h4 class="text-lg font-bold text-slate-900 mb-2">5. 문의하기</h4>
    <p>작동 원리나 보안에 대해 궁금한 점이 있으시면 언제든지 문의해 주세요：<br/><strong>이메일：energy9527z@gmail.com</strong></p>
  </section>
</div>
    `,
  },

  // SEO
  seo: {
    description: "브라우저에서 모든 처리가 이루어지는 효율적이고 깨끗하며 개인정보 보호를 중시하는 스마트 이미지 크기 조정 도구입니다.",
    features: "이미지 크기 조정, 형식 변환, SVG를 PNG로 변환, 개인정보 보호"
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
