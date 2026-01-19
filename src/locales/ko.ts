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
    format: '출력 형식',
    quality: '압축 품질',
    smallerFile: '파일 작게',
    bestQuality: '최고 품질',
    download: '이미지 다운로드',    close: '닫기',
    rotateLeft: '왼쪽으로 90° 회전',
    rotateRight: '오른쪽으로 90° 회전',    processing: '처리 중...',
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
    // 피트 모드
    fitMode: '피트 모드',
    fitCover: '자르기',
    fitContain: '맞추기',
    fitFill: '늘리기',
    // 비율 프리셋
    aspectRatioPreset: '비율',
    aspectOriginal: '원본',
    aspectCrop: '크롭 조정',
    cropModified: '크롭 완료',
    cropReset: '크롭 초기화',
    // 크롭 모달
    cropAdjustTitle: '크롭 범위 조정',
    cropAdjustDesc: '드래그하여 크롭 위치 조정',
    zoomLevel: '확대',
    rotation: '회전',
    rotate90: '90° 회전',
    resetCrop: '위치 초기화',
    applyCrop: '적용',
    cancel: '취소',
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
    noFilesProcessed: '성공적으로 처리된 파일이 없습니다',
    zipSuccess: '{count}개의 파일을 ZIP으로 압축하여 다운로드합니다',
    fileCountSingle: '{count}개의 파일',
    fileCountPlural: '{count}개의 파일',
  },

  // Footer
  footer: {
    copyright: '© 2026 Smart Resizer. 크리에이터를 위해 설계',
    privacyPolicy: '개인정보 처리방침',
    createdBy: '제작자:',
    done: '완료',
    effectiveDate: '시행일: 2026-01-06',
    footerQuestions: '궁금한 점이 있으신가요? GitHub 또는 이메일로 문의해 주세요.',
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
    title: "무료 온라인 이미지 크기 조절 및 변환 도구 (업로드 불필요) | Image Smart Resizer",
    description: "개인정보를 최우선으로 하는 무료 온라인 이미지 일괄 리사이징 도구입니다. Pica 고화질 알고리즘을 사용하여 JPG, PNG, WebP, ICO 변환 및 SVG의 PNG 변환(파비콘 제작)을 지원합니다. 모든 처리는 브라우저에서만 이루어지며 서버로 전송되지 않아 데이터가 안전합니다.",
    features: "온라인 이미지 리사이징, 이미지 크기 조절, 이미지 일괄 변환, 이미지 포맷 변환, 해상도 조절, 이미지 압축 도구, SVG PNG 변환, 파비콘 만들기, 이미지 자르기, 이미지 회전, WebP JPG 변환, Pica 알고리즘, 고화질 리사이징, 개인정보 보호, 업로드 불필요, 서버 전송 없음",
  },

  // Errors
  errors: {
    uploadFirst: '먼저 이미지를 업로드하세요',
    processingFailed: '이미지 처리 실패',
    readFileFailed: '파일 읽기 실패',
  },

  // Canvas Permission
  canvasPermission: {
    title: '브라우저가 이미지 처리를 제한했습니다',
    description1: '개인정보 보호를 위해 이미지는 서버에 업로드하지 않고 <strong>로컬</strong>에서 처리됩니다.',
    description2: '하지만 브라우저에서 이 동작을 위험한 것으로 판단했으므로, 일시적으로 이 사이트의 권한을 허용해 주세요.',
    chooseBrowser: '해결 방법: 사용 중인 브라우저를 선택하세요.',
    braveTitle: 'Brave 브라우저 (권장)',
    braveStep1: '주소창 오른쪽의 <span class="font-bold text-orange-600">사자 아이콘</span>을 클릭합니다.',
    braveStep2: '상단 스위치를 끕니다 (Shields DOWN).',
    braveStep3: '또는: Advanced View를 클릭하고 &quot;Block fingerprinting&quot;을 Disabled로 변경합니다.',
    firefoxTitle: 'Firefox',
    firefoxStep1: '주소창 왼쪽의 <span class="font-bold text-purple-600">방패 아이콘</span>을 클릭합니다.',
    firefoxStep2: '「항상 강화된 추적 방지」를 끕니다.',
    firefoxStep3: '완전히 끄고 싶지 않다면 설정에서 「핑거프린터 (Fingerprinters)」 체크를 해제하세요.',
    safariTitle: 'Safari',
    safariStep1: '「설정」 (또는 환경설정)을 엽니다.',
    safariStep2: '「개인정보 보호」 (Privacy) 탭으로 이동합니다.',
    safariStep3: '「크로스 사이트 추적 방지」 체크를 해제합니다.',
    chromeEdgeTitle: 'Chrome / Edge / 기타',
    chromeEdgeDesc: 'Chrome은 보통 차단하지 않습니다. 이 메시지가 표시된다면 보통 보안 확장 프로그램(예: <strong>Privacy Badger</strong>, <strong>CanvasBlocker</strong>) 때문입니다.',
    chromeEdgeAction: '이러한 확장 프로그램을 일시 중지한 후 다시 시도해 보세요.',
    cancel: '취소',
    retry: '설정 완료, 다시 시도',
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
