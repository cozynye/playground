import type { ITestQuestion, ITestResultType } from '../../types';

// 사랑의 언어 테스트 질문
export const loveLangQuestions: ITestQuestion[] = [
  {
    id: 'q1',
    question: '연인과의 데이트에서 가장 행복한 순간은?',
    answers: [
      {
        id: 'a1',
        text: '연인이 나를 칭찬하고 사랑한다고 말해줄 때',
        score: { words: 3, time: 0, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a2',
        text: '둘만의 시간을 온전히 함께 보낼 때',
        score: { words: 0, time: 3, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a3',
        text: '연인이 준비한 선물을 받을 때',
        score: { words: 0, time: 0, gifts: 3, service: 0, touch: 0 },
      },
      {
        id: 'a4',
        text: '연인이 내가 힘든 일을 도와줄 때',
        score: { words: 0, time: 0, gifts: 0, service: 3, touch: 0 },
      },
      {
        id: 'a5',
        text: '연인과 손을 잡고 포옹할 때',
        score: { words: 0, time: 0, gifts: 0, service: 0, touch: 3 },
      },
    ],
  },
  {
    id: 'q2',
    question: '연인에게 가장 섭섭할 때는?',
    answers: [
      {
        id: 'a1',
        text: '내 노력을 알아주지 않고 인정해주지 않을 때',
        score: { words: 3, time: 0, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a2',
        text: '함께 있어도 핸드폰만 보고 대화를 안 할 때',
        score: { words: 0, time: 3, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a3',
        text: '기념일을 잊어버리고 선물이 없을 때',
        score: { words: 0, time: 0, gifts: 3, service: 0, touch: 0 },
      },
      {
        id: 'a4',
        text: '내가 힘들 때 도와주지 않고 방관할 때',
        score: { words: 0, time: 0, gifts: 0, service: 3, touch: 0 },
      },
      {
        id: 'a5',
        text: '스킨십을 거부하거나 피할 때',
        score: { words: 0, time: 0, gifts: 0, service: 0, touch: 3 },
      },
    ],
  },
  {
    id: 'q3',
    question: '연인에게 사랑받는다고 느끼는 순간은?',
    answers: [
      {
        id: 'a1',
        text: '"사랑해", "고마워" 같은 따뜻한 말을 자주 들을 때',
        score: { words: 3, time: 0, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a2',
        text: '방해받지 않고 둘만의 시간을 가질 때',
        score: { words: 0, time: 3, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a3',
        text: '내가 원하던 것을 기억하고 선물해줄 때',
        score: { words: 0, time: 0, gifts: 3, service: 0, touch: 0 },
      },
      {
        id: 'a4',
        text: '내가 하기 싫은 일을 대신 해줄 때',
        score: { words: 0, time: 0, gifts: 0, service: 3, touch: 0 },
      },
      {
        id: 'a5',
        text: '자연스럽게 터치하고 안아줄 때',
        score: { words: 0, time: 0, gifts: 0, service: 0, touch: 3 },
      },
    ],
  },
  {
    id: 'q4',
    question: '연인과 싸운 후 화해하고 싶을 때 나는?',
    answers: [
      {
        id: 'a1',
        text: '진심 어린 사과와 내 마음을 글이나 말로 전달한다',
        score: { words: 3, time: 0, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a2',
        text: '함께 산책하거나 대화하며 시간을 보낸다',
        score: { words: 0, time: 3, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a3',
        text: '연인이 좋아하는 선물을 준비한다',
        score: { words: 0, time: 0, gifts: 3, service: 0, touch: 0 },
      },
      {
        id: 'a4',
        text: '연인이 힘들어하는 일을 도와주거나 대신 해준다',
        score: { words: 0, time: 0, gifts: 0, service: 3, touch: 0 },
      },
      {
        id: 'a5',
        text: '먼저 안아주거나 손을 잡는다',
        score: { words: 0, time: 0, gifts: 0, service: 0, touch: 3 },
      },
    ],
  },
  {
    id: 'q5',
    question: '연인에게 사랑을 표현하는 나만의 방법은?',
    answers: [
      {
        id: 'a1',
        text: '자주 "사랑해", "최고야" 같은 애정표현을 한다',
        score: { words: 3, time: 0, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a2',
        text: '연인과 온전히 집중해서 대화하고 함께 시간을 보낸다',
        score: { words: 0, time: 3, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a3',
        text: '기념일이 아니어도 깜짝 선물을 준비한다',
        score: { words: 0, time: 0, gifts: 3, service: 0, touch: 0 },
      },
      {
        id: 'a4',
        text: '연인의 짐을 들어주거나 일을 도와준다',
        score: { words: 0, time: 0, gifts: 0, service: 3, touch: 0 },
      },
      {
        id: 'a5',
        text: '자연스럽게 손을 잡고 스킨십을 한다',
        score: { words: 0, time: 0, gifts: 0, service: 0, touch: 3 },
      },
    ],
  },
  {
    id: 'q6',
    question: '연인이 나를 위해 해준 것 중 가장 기억에 남는 것은?',
    answers: [
      {
        id: 'a1',
        text: '힘들 때 나를 격려하고 응원해준 말',
        score: { words: 3, time: 0, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a2',
        text: '바쁜 와중에도 나를 위해 시간을 내준 것',
        score: { words: 0, time: 3, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a3',
        text: '내가 갖고 싶었던 것을 기억하고 선물해준 것',
        score: { words: 0, time: 0, gifts: 3, service: 0, touch: 0 },
      },
      {
        id: 'a4',
        text: '내가 힘들어할 때 직접 도움을 준 것',
        score: { words: 0, time: 0, gifts: 0, service: 3, touch: 0 },
      },
      {
        id: 'a5',
        text: '힘들 때 말없이 안아준 것',
        score: { words: 0, time: 0, gifts: 0, service: 0, touch: 3 },
      },
    ],
  },
  {
    id: 'q7',
    question: '연인과의 이상적인 주말은?',
    answers: [
      {
        id: 'a1',
        text: '서로의 꿈과 일상에 대해 깊은 대화를 나누는 시간',
        score: { words: 3, time: 0, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a2',
        text: '핸드폰 끄고 온전히 둘만의 데이트를 즐기는 시간',
        score: { words: 0, time: 3, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a3',
        text: '서로에게 의미 있는 선물을 주고받는 시간',
        score: { words: 0, time: 0, gifts: 3, service: 0, touch: 0 },
      },
      {
        id: 'a4',
        text: '함께 집안일을 하거나 서로를 도우며 보내는 시간',
        score: { words: 0, time: 0, gifts: 0, service: 3, touch: 0 },
      },
      {
        id: 'a5',
        text: '포옹하고 cuddling하며 친밀함을 느끼는 시간',
        score: { words: 0, time: 0, gifts: 0, service: 0, touch: 3 },
      },
    ],
  },
  {
    id: 'q8',
    question: '연인에게 가장 듣고 싶은 말은?',
    answers: [
      {
        id: 'a1',
        text: '"당신이 최고예요", "당신이 자랑스러워요"',
        score: { words: 3, time: 0, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a2',
        text: '"당신과 함께하는 시간이 가장 소중해요"',
        score: { words: 0, time: 3, gifts: 0, service: 0, touch: 0 },
      },
      {
        id: 'a3',
        text: '"이거 보니까 당신 생각나서 샀어요"',
        score: { words: 0, time: 0, gifts: 3, service: 0, touch: 0 },
      },
      {
        id: 'a4',
        text: '"제가 도와드릴게요", "제가 할게요"',
        score: { words: 0, time: 0, gifts: 0, service: 3, touch: 0 },
      },
      {
        id: 'a5',
        text: '"안아도 돼요?", "손 잡아도 돼요?"',
        score: { words: 0, time: 0, gifts: 0, service: 0, touch: 3 },
      },
    ],
  },
];

// 사랑의 언어 테스트 결과 타입
export const loveLangResults: ITestResultType[] = [
  {
    id: 'words',
    title: '인정하는 말 (Words of Affirmation)',
    description: '언어로 표현되는 사랑을 중요하게 여기는 당신! 칭찬과 격려, 따뜻한 말 한마디가 당신에게는 최고의 선물입니다.',
    image:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
    details: [
      '사랑한다는 말을 자주 듣고 싶어합니다',
      '칭찬과 격려가 큰 힘이 됩니다',
      '비판보다 긍정적인 피드백을 선호합니다',
      '문자나 편지로 마음을 전하는 것을 좋아합니다',
    ],
    tags: ['#언어적표현', '#칭찬', '#격려', '#감사'],
  },
  {
    id: 'time',
    title: '함께하는 시간 (Quality Time)',
    description: '온전한 관심과 집중이 필요한 당신! 함께하는 시간의 질이 사랑의 깊이를 결정합니다.',
    image:
      'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=1000&q=80',
    details: [
      '온전히 집중하는 대화를 중요하게 생각합니다',
      '함께 보내는 시간의 질을 중시합니다',
      '핸드폰 없이 둘만의 시간을 원합니다',
      '깊은 대화와 교감을 통해 친밀감을 느낍니다',
    ],
    tags: ['#함께', '#집중', '#대화', '#교감'],
  },
  {
    id: 'gifts',
    title: '선물 (Receiving Gifts)',
    description: '마음이 담긴 선물을 소중히 여기는 당신! 선물은 사랑의 가시적인 상징이자 배려의 증거입니다.',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
    details: [
      '선물의 가격보다 마음과 의미를 중시합니다',
      '기념일과 특별한 날을 중요하게 생각합니다',
      '받은 선물을 오래 간직하고 기억합니다',
      '깜짝 선물에 큰 감동을 받습니다',
    ],
    tags: ['#선물', '#기념일', '#마음', '#깜짝'],
  },
  {
    id: 'service',
    title: '봉사 (Acts of Service)',
    description: '실질적인 도움과 배려를 사랑으로 받아들이는 당신! 행동으로 보여주는 사랑이 가장 진실됩니다.',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1000&q=80',
    details: [
      '말보다 행동으로 사랑을 확인합니다',
      '일을 도와주는 것을 큰 배려로 받아들입니다',
      '실질적인 도움에서 사랑을 느낍니다',
      '작은 배려와 친절을 기억하고 감사합니다',
    ],
    tags: ['#행동', '#도움', '#배려', '#실천'],
  },
  {
    id: 'touch',
    title: '스킨십 (Physical Touch)',
    description: '신체적 접촉으로 사랑을 느끼는 당신! 따뜻한 포옹과 터치가 마음의 안정과 친밀감을 가져다줍니다.',
    image:
      'https://images.unsplash.com/photo-1573152143286-0c422b4d2175?auto=format&fit=crop&w=1000&q=80',
    details: [
      '포옹과 스킨십으로 안정감을 느낍니다',
      '자연스러운 터치를 통해 친밀감을 표현합니다',
      '신체적 거리가 심리적 거리를 결정합니다',
      '손잡기, 안아주기 등 작은 접촉도 의미있게 받아들입니다',
    ],
    tags: ['#스킨십', '#포옹', '#터치', '#친밀감'],
  },
];
