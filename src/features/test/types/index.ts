// 테스트 카테고리
export type TestCategory = 'personality' | 'love' | 'psychology' | 'fun' | 'career';

// 테스트 색상 테마
export interface ITestColors {
  primary: string; // 메인 색상
  secondary: string; // 보조 색상
  gradient: string; // 그라데이션 (Tailwind CSS 클래스)
  background: string; // 배경 색상
  text: string; // 텍스트 색상
}

// 테스트 답변 선택지
export interface ITestAnswer {
  id: string;
  text: string;
  score: Record<string, number>; // 결과 타입별 점수 { 'type1': 2, 'type2': 1 }
  image?: string; // 선택지 이미지 (선택)
}

// 테스트 질문
export interface ITestQuestion {
  id: string;
  question: string;
  description?: string; // 질문 설명 (선택)
  answers: ITestAnswer[];
  image?: string; // 질문 이미지 (선택)
}

// 테스트 결과 타입
export interface ITestResultType {
  id: string;
  title: string;
  description: string;
  image: string;
  details?: string[]; // 상세 설명 리스트
  tags?: string[]; // 태그 (예: #긍정적, #창의적)
  percentage?: number; // 결과 비율 (선택, 계산됨)
}

// 테스트 메타데이터
export interface ITestMetadata {
  title: string;
  description: string;
  ogImage: string;
  keywords: string[];
}

// 전체 테스트 설정
export interface ITest {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: TestCategory;
  colors: ITestColors;
  thumbnailImage: string;
  isActive: boolean;
  createdAt: string;
  metadata: ITestMetadata;
  questions: ITestQuestion[];
  results: ITestResultType[];
  estimatedTime?: number; // 예상 소요 시간 (분)
  totalParticipants?: number; // 참여자 수 (선택)
}

// 테스트 진행 상태
export interface ITestProgress {
  testId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>; // { questionId: answerId }
  startedAt: Date;
}

// 테스트 최종 결과
export interface ITestFinalResult {
  testId: string;
  primaryResult: ITestResultType;
  secondaryResult?: ITestResultType;
  scores: Record<string, number>; // 각 결과 타입별 점수
  completedAt: Date;
}
