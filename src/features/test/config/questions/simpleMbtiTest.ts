import type { ITestQuestion, ITestResultType } from '../../types';

// 간단한 MBTI 테스트 질문 (E/I, S/N, T/F, J/P 각 2문제씩 총 8문제)
export const simpleMbtiQuestions: ITestQuestion[] = [
  // E/I 질문
  {
    id: 'q1',
    question: '주말에 친구들이 갑자기 약속을 잡자고 할 때 나는?',
    answers: [
      {
        id: 'a1',
        text: '좋아! 바로 나간다! 사람 만나는 게 재밌어',
        score: { E: 2, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
      },
      {
        id: 'a2',
        text: '음... 집에서 쉬고 싶은데... 다음에 약속 잡을까?',
        score: { E: 0, I: 2, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
      },
    ],
  },
  {
    id: 'q2',
    question: '여행을 다녀온 후 나는?',
    answers: [
      {
        id: 'a1',
        text: '에너지 충전 완료! 더 많은 사람들과 경험을 나누고 싶어',
        score: { E: 2, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
      },
      {
        id: 'a2',
        text: '너무 피곤해... 혼자만의 시간이 필요해',
        score: { E: 0, I: 2, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
      },
    ],
  },
  // S/N 질문
  {
    id: 'q3',
    question: '새로운 것을 배울 때 나는?',
    answers: [
      {
        id: 'a1',
        text: '구체적인 예시와 실습이 중요해! 직접 해봐야 알아',
        score: { E: 0, I: 0, S: 2, N: 0, T: 0, F: 0, J: 0, P: 0 },
      },
      {
        id: 'a2',
        text: '전체적인 맥락과 원리를 먼저 이해하고 싶어',
        score: { E: 0, I: 0, S: 0, N: 2, T: 0, F: 0, J: 0, P: 0 },
      },
    ],
  },
  {
    id: 'q4',
    question: '이야기를 할 때 나는?',
    answers: [
      {
        id: 'a1',
        text: '있었던 일을 사실 그대로 자세하게 설명한다',
        score: { E: 0, I: 0, S: 2, N: 0, T: 0, F: 0, J: 0, P: 0 },
      },
      {
        id: 'a2',
        text: '의미와 느낌, 상상력을 더해서 이야기한다',
        score: { E: 0, I: 0, S: 0, N: 2, T: 0, F: 0, J: 0, P: 0 },
      },
    ],
  },
  // T/F 질문
  {
    id: 'q5',
    question: '친구가 고민 상담을 할 때 나는?',
    answers: [
      {
        id: 'a1',
        text: '문제의 원인을 분석하고 해결책을 제시한다',
        score: { E: 0, I: 0, S: 0, N: 0, T: 2, F: 0, J: 0, P: 0 },
      },
      {
        id: 'a2',
        text: '공감하고 위로하며 감정을 나눈다',
        score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 2, J: 0, P: 0 },
      },
    ],
  },
  {
    id: 'q6',
    question: '의사결정을 할 때 나는?',
    answers: [
      {
        id: 'a1',
        text: '논리적이고 객관적인 기준으로 판단한다',
        score: { E: 0, I: 0, S: 0, N: 0, T: 2, F: 0, J: 0, P: 0 },
      },
      {
        id: 'a2',
        text: '사람들의 감정과 관계를 먼저 고려한다',
        score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 2, J: 0, P: 0 },
      },
    ],
  },
  // J/P 질문
  {
    id: 'q7',
    question: '프로젝트를 진행할 때 나는?',
    answers: [
      {
        id: 'a1',
        text: '계획을 세우고 일정대로 차근차근 진행한다',
        score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 2, P: 0 },
      },
      {
        id: 'a2',
        text: '유연하게 상황에 맞춰 즉흥적으로 처리한다',
        score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 2 },
      },
    ],
  },
  {
    id: 'q8',
    question: '여행 계획을 세울 때 나는?',
    answers: [
      {
        id: 'a1',
        text: '일정표를 만들고 예약을 미리 다 해놓는다',
        score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 2, P: 0 },
      },
      {
        id: 'a2',
        text: '대충 정하고 현지에서 그때그때 결정한다',
        score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 2 },
      },
    ],
  },
];

// MBTI 16가지 결과 타입
export const simpleMbtiResults: ITestResultType[] = [
  {
    id: 'ISTJ',
    title: 'ISTJ - 현실주의자',
    description: '책임감 강하고 체계적인 당신! 철저한 계획과 성실함으로 목표를 달성하는 실용주의자입니다.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    details: ['체계적', '책임감', '신뢰성', '현실적'],
    tags: ['#현실주의자', '#책임감', '#체계적', '#신뢰성'],
  },
  {
    id: 'ISFJ',
    title: 'ISFJ - 수호자',
    description: '따뜻하고 헌신적인 당신! 타인을 배려하고 세심하게 돌보는 보호자형 성격입니다.',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
    details: ['헌신적', '배려심', '세심함', '책임감'],
    tags: ['#수호자', '#헌신적', '#배려', '#따뜻함'],
  },
  {
    id: 'INFJ',
    title: 'INFJ - 옹호자',
    description: '이상주의적이고 통찰력 있는 당신! 깊은 사고와 높은 이상으로 세상을 변화시키려는 옹호자입니다.',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80',
    details: ['통찰력', '이상주의', '창의적', '공감능력'],
    tags: ['#옹호자', '#이상주의', '#통찰력', '#공감'],
  },
  {
    id: 'INTJ',
    title: 'INTJ - 전략가',
    description: '독립적이고 분석적인 당신! 높은 목표와 전략적 사고로 혁신을 이끄는 마스터마인드입니다.',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    details: ['전략적', '독립적', '분석적', '혁신적'],
    tags: ['#전략가', '#독립적', '#분석적', '#혁신'],
  },
  {
    id: 'ISTP',
    title: 'ISTP - 장인',
    description: '실용적이고 호기심 많은 당신! 손으로 직접 만들고 문제를 해결하는 장인 기질을 가졌습니다.',
    image:
      'https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=1000&q=80',
    details: ['실용적', '분석적', '적응력', '논리적'],
    tags: ['#장인', '#실용적', '#문제해결', '#적응력'],
  },
  {
    id: 'ISFP',
    title: 'ISFP - 모험가',
    description: '예술적이고 자유로운 당신! 아름다움을 추구하고 자신만의 방식으로 살아가는 예술가 기질입니다.',
    image:
      'https://images.unsplash.com/photo-1502101872923-d48509bff386?auto=format&fit=crop&w=1000&q=80',
    details: ['예술적', '유연함', '조화', '감성적'],
    tags: ['#모험가', '#예술적', '#자유로움', '#감성'],
  },
  {
    id: 'INFP',
    title: 'INFP - 중재자',
    description: '이상주의적이고 감성적인 당신! 진정성을 추구하며 자신만의 가치관으로 살아가는 몽상가입니다.',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
    details: ['이상주의', '공감능력', '창의적', '진정성'],
    tags: ['#중재자', '#이상주의', '#공감', '#창의적'],
  },
  {
    id: 'INTP',
    title: 'INTP - 논리술사',
    description: '분석적이고 창의적인 당신! 이론과 논리로 세상을 이해하려는 지적 호기심의 소유자입니다.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
    details: ['논리적', '분석적', '창의적', '객관적'],
    tags: ['#논리술사', '#분석적', '#창의적', '#논리'],
  },
  {
    id: 'ESTP',
    title: 'ESTP - 사업가',
    description: '대담하고 행동 지향적인 당신! 현재를 즐기며 빠르게 행동하는 모험을 즐기는 실용주의자입니다.',
    image:
      'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1000&q=80',
    details: ['대담함', '활동적', '실용적', '관찰력'],
    tags: ['#사업가', '#대담함', '#활동적', '#모험'],
  },
  {
    id: 'ESFP',
    title: 'ESFP - 연예인',
    description: '자유분방하고 사교적인 당신! 즐거움을 추구하며 주변을 즐겁게 만드는 엔터테이너입니다.',
    image:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1000&q=80',
    details: ['사교적', '활발함', '즐거움', '순발력'],
    tags: ['#연예인', '#사교적', '#즐거움', '#활발함'],
  },
  {
    id: 'ENFP',
    title: 'ENFP - 활동가',
    description: '열정적이고 창의적인 당신! 새로운 가능성을 탐구하며 사람들에게 영감을 주는 자유로운 영혼입니다.',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
    details: ['열정적', '창의적', '사교적', '호기심'],
    tags: ['#활동가', '#열정적', '#창의적', '#자유로움'],
  },
  {
    id: 'ENTP',
    title: 'ENTP - 변론가',
    description: '논리적이고 혁신적인 당신! 지적 토론을 즐기며 새로운 아이디어로 세상에 도전하는 발명가입니다.',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=80',
    details: ['논리적', '혁신적', '토론가', '창의적'],
    tags: ['#변론가', '#논리적', '#혁신적', '#도전'],
  },
  {
    id: 'ESTJ',
    title: 'ESTJ - 경영자',
    description: '체계적이고 실용적인 당신! 효율적으로 조직을 이끌며 목표를 달성하는 타고난 리더입니다.',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=80',
    details: ['리더십', '체계적', '실용적', '결단력'],
    tags: ['#경영자', '#리더십', '#체계적', '#실용적'],
  },
  {
    id: 'ESFJ',
    title: 'ESFJ - 집정관',
    description: '사교적이고 배려심 많은 당신! 사람들을 돌보고 조화로운 관계를 만드는 사교의 달인입니다.',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1000&q=80',
    details: ['사교적', '배려심', '협력적', '책임감'],
    tags: ['#집정관', '#사교적', '#배려', '#조화'],
  },
  {
    id: 'ENFJ',
    title: 'ENFJ - 선도자',
    description: '카리스마 있고 영감을 주는 당신! 사람들을 이끌고 성장시키는 타고난 멘토이자 리더입니다.',
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80',
    details: ['카리스마', '공감능력', '리더십', '열정'],
    tags: ['#선도자', '#카리스마', '#리더십', '#멘토'],
  },
  {
    id: 'ENTJ',
    title: 'ENTJ - 통솔자',
    description: '단호하고 전략적인 당신! 비전을 제시하고 효율적으로 목표를 달성하는 타고난 지휘자입니다.',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
    details: ['전략적', '결단력', '리더십', '효율성'],
    tags: ['#통솔자', '#전략적', '#결단력', '#비전'],
  },
];
