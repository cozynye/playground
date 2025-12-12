import type { ITest, TestCategory } from '../types';
import { loveLangQuestions, loveLangResults } from './questions/loveLangTest';
import { simpleMbtiQuestions, simpleMbtiResults } from './questions/simpleMbtiTest';

// 이미지 URL 생성 헬퍼 (Unsplash)
const getUnsplashImage = (imageId: string, width = 1200, height = 630) =>
  `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;

// 테스트 이미지 설정
const images = {
  loveLang: {
    thumbnail: getUnsplashImage('1516589178581-6cd7833ae3b2', 800, 600),
    og: getUnsplashImage('1516589178581-6cd7833ae3b2', 1200, 630),
  },
  simpleMbti: {
    thumbnail: getUnsplashImage('1507003211169-0a1dd7228f2d', 800, 600),
    og: getUnsplashImage('1507003211169-0a1dd7228f2d', 1200, 630),
  },
  personalColor: {
    thumbnail: getUnsplashImage('1541701494587-cb58502866ab', 800, 600),
    og: getUnsplashImage('1541701494587-cb58502866ab', 1200, 630),
  },
  loveStyle: {
    thumbnail: getUnsplashImage('1518568814500-bf0f8d125f46', 800, 600),
    og: getUnsplashImage('1518568814500-bf0f8d125f46', 1200, 630),
  },
};

// 전체 테스트 설정 배열
export const testConfigs: ITest[] = [
  // 1. 사랑의 언어 테스트
  {
    id: 'love-language-test',
    slug: 'love',
    title: '사랑의 언어 테스트',
    description:
      '당신의 사랑의 언어는 무엇인가요? 5가지 사랑의 언어 중 당신의 사랑 표현 방식과 받고 싶은 사랑의 형태를 알아보세요!',
    category: 'love' as TestCategory,
    colors: {
      primary: '#FF6B9D',
      secondary: '#FFC1D9',
      gradient: 'from-pink-500 to-rose-400',
      background: '#FFF5F7',
      text: '#C41E3A',
    },
    thumbnailImage: images.loveLang.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    estimatedTime: 3,
    metadata: {
      title: '사랑의 언어 테스트 - 나의 사랑 표현 방식은? | Cozy',
      description:
        '인정하는 말, 함께하는 시간, 선물, 봉사, 스킨십! 5가지 사랑의 언어 중 당신의 사랑 표현 방식을 알아보세요. 무료 심리 테스트',
      ogImage: images.loveLang.og,
      keywords: [
        '사랑의 언어',
        '사랑의 언어 테스트',
        '연애 테스트',
        '심리 테스트',
        'love language',
        '연애 심리',
        '커플 테스트',
      ],
    },
    questions: loveLangQuestions,
    results: loveLangResults,
  },

  // 2. 간단한 MBTI 테스트
  {
    id: 'simple-mbti-test',
    slug: 't1',
    title: '간단 MBTI 테스트',
    description:
      '8문항으로 알아보는 나의 MBTI! 빠르고 간단하게 당신의 성격 유형을 확인해보세요. 16가지 성격 유형 중 당신은?',
    category: 'personality' as TestCategory,
    colors: {
      primary: '#6C63FF',
      secondary: '#B4AFFF',
      gradient: 'from-indigo-500 to-purple-500',
      background: '#F5F4FF',
      text: '#4338CA',
    },
    thumbnailImage: images.simpleMbti.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    estimatedTime: 2,
    metadata: {
      title: '간단 MBTI 테스트 - 8문항으로 알아보는 나의 성격 유형 | Cozy',
      description:
        'ISTJ, ENFP, INTJ... 16가지 MBTI 유형 중 당신은? 8문항의 간단한 질문으로 빠르게 알아보는 MBTI 성격 테스트',
      ogImage: images.simpleMbti.og,
      keywords: [
        'MBTI',
        'MBTI 테스트',
        '성격 테스트',
        '심리 테스트',
        'MBTI 유형',
        '간단한 MBTI',
        '무료 MBTI',
        '16가지 성격',
      ],
    },
    questions: simpleMbtiQuestions,
    results: simpleMbtiResults,
  },

  // 3. 퍼스널 컬러 테스트 (준비 중)
  {
    id: 'personal-color-test',
    slug: 't2',
    title: '퍼스널 컬러 테스트',
    description:
      '나에게 어울리는 색은? 봄 웜톤, 여름 쿨톤, 가을 웜톤, 겨울 쿨톤 중 당신의 퍼스널 컬러를 찾아보세요!',
    category: 'fun' as TestCategory,
    colors: {
      primary: '#FF9F43',
      secondary: '#FFD89B',
      gradient: 'from-orange-400 to-yellow-400',
      background: '#FFF9F0',
      text: '#D97706',
    },
    thumbnailImage: images.personalColor.thumbnail,
    isActive: false, // 준비 중
    createdAt: '2024-12-12',
    estimatedTime: 5,
    metadata: {
      title: '퍼스널 컬러 테스트 - 나에게 어울리는 컬러는? | Cozy',
      description:
        '봄웜, 여쿨, 가웜, 겨쿨! 4가지 퍼스널 컬러 중 당신에게 가장 어울리는 컬러 톤을 찾아보세요. 무료 퍼스널 컬러 진단',
      ogImage: images.personalColor.og,
      keywords: [
        '퍼스널 컬러',
        '퍼스널 컬러 테스트',
        '퍼컬',
        '웜톤',
        '쿨톤',
        '봄웜',
        '여쿨',
        '가웜',
        '겨쿨',
      ],
    },
    questions: [], // TODO: 추후 추가
    results: [], // TODO: 추후 추가
  },

  // 4. 연애 스타일 테스트 (준비 중)
  {
    id: 'love-style-test',
    slug: 't3',
    title: '연애 스타일 테스트',
    description:
      '당신의 연애 스타일은? 열정형, 헌신형, 친구형, 독립형 등 다양한 연애 유형 중 당신의 스타일을 알아보세요!',
    category: 'love' as TestCategory,
    colors: {
      primary: '#E91E63',
      secondary: '#F8BBD0',
      gradient: 'from-pink-600 to-red-500',
      background: '#FCE4EC',
      text: '#C2185B',
    },
    thumbnailImage: images.loveStyle.thumbnail,
    isActive: false, // 준비 중
    createdAt: '2024-12-12',
    estimatedTime: 4,
    metadata: {
      title: '연애 스타일 테스트 - 나의 사랑 방식은? | Cozy',
      description:
        '열정적? 헌신적? 독립적? 당신의 연애 스타일과 이상적인 연애 유형을 알아보는 심리 테스트',
      ogImage: images.loveStyle.og,
      keywords: [
        '연애 스타일',
        '연애 테스트',
        '연애 유형',
        '심리 테스트',
        '사랑 테스트',
        '커플 테스트',
        '연애 심리',
      ],
    },
    questions: [], // TODO: 추후 추가
    results: [], // TODO: 추후 추가
  },
];

// 활성화된 테스트만 필터링
export const activeTests = testConfigs.filter((test) => test.isActive);

// slug로 테스트 찾기
export const getTestBySlug = (slug: string): ITest | undefined => {
  return testConfigs.find((test) => test.slug === slug);
};

// 카테고리별 테스트 찾기
export const getTestsByCategory = (category: TestCategory): ITest[] => {
  return activeTests.filter((test) => test.category === category);
};

// 전체 테스트 개수
export const getTotalTestCount = (): number => {
  return activeTests.length;
};
