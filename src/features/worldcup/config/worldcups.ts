import type { IWorldcupConfig, IWorldcupSummary } from '../types';
import {
  foodItems,
  colorItems,
  animalItems,
  convenienceStoreItems,
  mbtiItems,
  dogBreedItems,
  dessertItems,
  lateNightSnackItems,
  bubbleTeaItems,
  travelDestinationItems,
  lolChampionItems,
  kpopIdolItems,
  animeCharacterItems,
  webtoonCharacterItems,
  fashionStyleItems,
  phoneWallpaperItems,
} from './items';

// Unsplash 이미지 URL 헬퍼
function getUnsplashImage(photoId: string, width = 600, height = 600): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

// 썸네일 및 OG 이미지
const images = {
  food: {
    thumbnail: getUnsplashImage('1504674900247-0877df9cc836', 600, 600),
    og: getUnsplashImage('1504674900247-0877df9cc836', 1200, 630),
  },
  color: {
    thumbnail: getUnsplashImage('1525909002-1b05e0c869d8', 600, 600),
    og: getUnsplashImage('1525909002-1b05e0c869d8', 1200, 630),
  },
  animal: {
    thumbnail: getUnsplashImage('1425082661705-1834bfd09dca', 600, 600),
    og: getUnsplashImage('1425082661705-1834bfd09dca', 1200, 630),
  },
  convenienceStore: {
    thumbnail: getUnsplashImage('1604719312566-878b25d4db7f', 600, 600),
    og: getUnsplashImage('1604719312566-878b25d4db7f', 1200, 630),
  },
  mbti: {
    thumbnail: getUnsplashImage('1573496359142-b8d87734a5a2', 600, 600),
    og: getUnsplashImage('1573496359142-b8d87734a5a2', 1200, 630),
  },
  dog: {
    thumbnail: getUnsplashImage('1633722715463-d30f4f325e24', 600, 600),
    og: getUnsplashImage('1633722715463-d30f4f325e24', 1200, 630),
  },
  dessert: {
    thumbnail: getUnsplashImage('1569864358642-9d1684040f43', 600, 600),
    og: getUnsplashImage('1569864358642-9d1684040f43', 1200, 630),
  },
  lateNightSnack: {
    thumbnail: getUnsplashImage('1626645738196-c2a7c87a8f58', 600, 600),
    og: getUnsplashImage('1626645738196-c2a7c87a8f58', 1200, 630),
  },
  bubbleTea: {
    thumbnail: getUnsplashImage('1525385133512-2f3bdd039054', 600, 600),
    og: getUnsplashImage('1525385133512-2f3bdd039054', 1200, 630),
  },
  travel: {
    thumbnail: getUnsplashImage('1519451241324-20b4ea2c4220', 600, 600),
    og: getUnsplashImage('1519451241324-20b4ea2c4220', 1200, 630),
  },
  lol: {
    thumbnail: getUnsplashImage('1542751371-adc38448a05e', 600, 600),
    og: getUnsplashImage('1542751371-adc38448a05e', 1200, 630),
  },
  kpop: {
    thumbnail: getUnsplashImage('1514525253161-7a46d19cd819', 600, 600),
    og: getUnsplashImage('1514525253161-7a46d19cd819', 1200, 630),
  },
  anime: {
    thumbnail: getUnsplashImage('1578632767115-351597cf2477', 600, 600),
    og: getUnsplashImage('1578632767115-351597cf2477', 1200, 630),
  },
  webtoon: {
    thumbnail: getUnsplashImage('1542751371-adc38448a05e', 600, 600),
    og: getUnsplashImage('1542751371-adc38448a05e', 1200, 630),
  },
  fashion: {
    thumbnail: getUnsplashImage('1490114538077-0a7f8cb49891', 600, 600),
    og: getUnsplashImage('1490114538077-0a7f8cb49891', 1200, 630),
  },
  wallpaper: {
    thumbnail: getUnsplashImage('1506905925346-21bda4d32df4', 600, 600),
    og: getUnsplashImage('1506905925346-21bda4d32df4', 1200, 630),
  },
};

export const worldcupConfigs: IWorldcupConfig[] = [
  {
    id: 'food-worldcup',
    slug: 'food',
    title: '음식 월드컵',
    description: '가장 좋아하는 음식은? 8가지 음식 중 최고를 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.food.thumbnail,
    isActive: true,
    createdAt: '2024-01-01',
    metadata: {
      title: '음식 월드컵 - 최애 음식 찾기 | Cozy',
      description: '8가지 음식 중 당신의 최애 음식은? 친구들과 결과를 비교해보세요!',
      ogImage: images.food.og,
      keywords: ['음식', '월드컵', '맛집', '최애'],
    },
    items: foodItems,
  },
  {
    id: 'color-worldcup',
    slug: 'color',
    title: '색상 월드컵',
    description: '당신이 가장 좋아하는 색상은? 8가지 색상 중 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.color.thumbnail,
    isActive: true,
    createdAt: '2024-01-02',
    metadata: {
      title: '색상 월드컵 - 나의 최애 색상 찾기 | Cozy',
      description: '8가지 색상 중 당신이 가장 좋아하는 색상을 찾아보세요!',
      ogImage: images.color.og,
      keywords: ['색상', '월드컵', '컬러', '최애'],
    },
    items: colorItems,
  },
  {
    id: 'animal-worldcup',
    slug: 'animal',
    title: '동물 월드컵',
    description: '가장 좋아하는 동물은? 16마리 동물 중 최고를 선택하세요!',
    roundCount: 16,
    thumbnailImage: images.animal.thumbnail,
    isActive: true,
    createdAt: '2024-01-03',
    metadata: {
      title: '동물 월드컵 - 최애 동물 찾기 | Cozy',
      description: '16마리 동물 중 당신의 최애 동물은? 친구들과 결과를 비교해보세요!',
      ogImage: images.animal.og,
      keywords: ['동물', '월드컵', '펫', '최애'],
    },
    items: animalItems,
  },
  {
    id: 'convenience-store-worldcup',
    slug: 'convenience-store',
    title: '편의점 음식 월드컵',
    description: '편의점에서 꼭 사먹는 음식은? 16가지 편의점 음식 중 최애를 선택하세요!',
    roundCount: 16,
    thumbnailImage: images.convenienceStore.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '편의점 음식 월드컵 - 편의점 꿀조합 찾기 | Cozy',
      description: '삼각김밥부터 도시락까지! 16가지 편의점 음식 중 당신의 최애는?',
      ogImage: images.convenienceStore.og,
      keywords: ['편의점', '음식', '월드컵', 'CU', 'GS25', '세븐일레븐', '편의점 추천'],
    },
    items: convenienceStoreItems,
  },
  {
    id: 'mbti-worldcup',
    slug: 'mbti',
    title: 'MBTI 성격 월드컵',
    description: '가장 매력적인 MBTI는? 16가지 성격 유형 중 최고를 선택하세요!',
    roundCount: 16,
    thumbnailImage: images.mbti.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: 'MBTI 성격 월드컵 - 최애 성격 유형 찾기 | Cozy',
      description: 'INTJ부터 ESFP까지! 16가지 MBTI 성격 유형 중 가장 매력적인 유형은?',
      ogImage: images.mbti.og,
      keywords: ['MBTI', '성격', '월드컵', 'MBTI 테스트', '성격 유형', 'MBTI 유형'],
    },
    items: mbtiItems,
  },
  {
    id: 'dog-breed-worldcup',
    slug: 'dog-breed',
    title: '강아지 품종 월드컵',
    description: '가장 귀여운 강아지 품종은? 16가지 품종 중 최애를 선택하세요!',
    roundCount: 16,
    thumbnailImage: images.dog.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '강아지 품종 월드컵 - 최애 강아지 찾기 | Cozy',
      description: '골든 리트리버부터 푸들까지! 16가지 강아지 품종 중 당신의 최애는?',
      ogImage: images.dog.og,
      keywords: ['강아지', '품종', '월드컵', '반려견', '펫', '강아지 종류'],
    },
    items: dogBreedItems,
  },
  {
    id: 'dessert-worldcup',
    slug: 'dessert',
    title: '카페 디저트 월드컵',
    description: '카페에서 꼭 먹는 디저트는? 16가지 디저트 중 최애를 선택하세요!',
    roundCount: 16,
    thumbnailImage: images.dessert.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '카페 디저트 월드컵 - 최애 디저트 찾기 | Cozy',
      description: '마카롱부터 티라미수까지! 16가지 카페 디저트 중 당신의 최애는?',
      ogImage: images.dessert.og,
      keywords: ['디저트', '카페', '월드컵', '마카롱', '케이크', '카페 메뉴'],
    },
    items: dessertItems,
  },
  {
    id: 'late-night-snack-worldcup',
    slug: 'late-night-snack',
    title: '야식 월드컵',
    description: '밤에 가장 먹고 싶은 야식은? 8가지 야식 중 최고를 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.lateNightSnack.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '야식 월드컵 - 최애 야식 찾기 | Cozy',
      description: '치킨부터 라면까지! 8가지 야식 중 밤에 가장 먹고 싶은 것은?',
      ogImage: images.lateNightSnack.og,
      keywords: ['야식', '배달', '월드컵', '치킨', '족발', '야식 추천'],
    },
    items: lateNightSnackItems,
  },
  {
    id: 'bubble-tea-worldcup',
    slug: 'bubble-tea',
    title: '버블티 월드컵',
    description: '가장 좋아하는 버블티는? 8가지 맛 중 최애를 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.bubbleTea.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '버블티 월드컵 - 최애 버블티 맛 찾기 | Cozy',
      description: '흑당부터 타로까지! 8가지 버블티 맛 중 당신의 최애는?',
      ogImage: images.bubbleTea.og,
      keywords: ['버블티', '밀크티', '월드컵', '공차', '메가MGC', '버블티 맛'],
    },
    items: bubbleTeaItems,
  },
  {
    id: 'travel-worldcup',
    slug: 'travel',
    title: '국내 여행지 월드컵',
    description: '가장 가고 싶은 여행지는? 8곳의 국내 여행지 중 최고를 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.travel.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '국내 여행지 월드컵 - 최애 여행지 찾기 | Cozy',
      description: '제주도부터 부산까지! 8곳의 국내 여행지 중 가장 가고 싶은 곳은?',
      ogImage: images.travel.og,
      keywords: ['여행', '국내 여행', '월드컵', '여행지 추천', '국내 여행지', '제주도', '부산'],
    },
    items: travelDestinationItems,
  },
  {
    id: 'lol-champion-worldcup',
    slug: 'lol-champion',
    title: 'LOL 챔피언 월드컵',
    description: '가장 좋아하는 롤 챔피언은? 16개 챔피언 중 최애를 선택하세요!',
    roundCount: 16,
    thumbnailImage: images.lol.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: 'LOL 챔피언 월드컵 - 최애 챔피언 찾기 | Cozy',
      description: '야스오부터 아리까지! 16개 롤 챔피언 중 당신의 최애는?',
      ogImage: images.lol.og,
      keywords: ['LOL', '롤', '챔피언', '월드컵', '리그오브레전드', 'League of Legends'],
    },
    items: lolChampionItems,
  },
  {
    id: 'kpop-idol-worldcup',
    slug: 'kpop-idol',
    title: 'K-POP 아이돌 월드컵',
    description: '가장 좋아하는 K-POP 그룹은? 8개 그룹 중 최애를 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.kpop.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: 'K-POP 아이돌 월드컵 - 최애 아이돌 찾기 | Cozy',
      description: 'BTS부터 NewJeans까지! 8개 K-POP 그룹 중 당신의 최애는?',
      ogImage: images.kpop.og,
      keywords: ['K-POP', '아이돌', '월드컵', 'BTS', 'BLACKPINK', '케이팝', '아이돌 그룹'],
    },
    items: kpopIdolItems,
  },
  {
    id: 'anime-character-worldcup',
    slug: 'anime-character',
    title: '애니메이션 캐릭터 월드컵',
    description: '가장 좋아하는 애니 캐릭터는? 8명의 캐릭터 중 최애를 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.anime.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '애니메이션 캐릭터 월드컵 - 최애 캐릭터 찾기 | Cozy',
      description: '나루토부터 고죠 사토루까지! 8명의 애니 캐릭터 중 당신의 최애는?',
      ogImage: images.anime.og,
      keywords: ['애니', '애니메이션', '캐릭터', '월드컵', '나루토', '원피스', '주술회전'],
    },
    items: animeCharacterItems,
  },
  {
    id: 'webtoon-character-worldcup',
    slug: 'webtoon-character',
    title: '웹툰 주인공 월드컵',
    description: '가장 좋아하는 웹툰 주인공은? 8명의 주인공 중 최애를 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.webtoon.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '웹툰 주인공 월드컵 - 최애 주인공 찾기 | Cozy',
      description: '성진우부터 김독자까지! 8명의 웹툰 주인공 중 당신의 최애는?',
      ogImage: images.webtoon.og,
      keywords: ['웹툰', '주인공', '월드컵', '나 혼자만 레벨업', '전지적 독자 시점', '네이버 웹툰'],
    },
    items: webtoonCharacterItems,
  },
  {
    id: 'fashion-style-worldcup',
    slug: 'fashion-style',
    title: '패션 스타일 월드컵',
    description: '가장 좋아하는 패션 스타일은? 8가지 스타일 중 최애를 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.fashion.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '패션 스타일 월드컵 - 최애 스타일 찾기 | Cozy',
      description: '스트릿부터 빈티지까지! 8가지 패션 스타일 중 당신의 최애는?',
      ogImage: images.fashion.og,
      keywords: ['패션', '스타일', '월드컵', '코디', '패션 스타일', '옷'],
    },
    items: fashionStyleItems,
  },
  {
    id: 'phone-wallpaper-worldcup',
    slug: 'phone-wallpaper',
    title: '휴대폰 배경화면 월드컵',
    description: '가장 예쁜 배경화면은? 8가지 배경화면 중 최애를 선택하세요!',
    roundCount: 8,
    thumbnailImage: images.wallpaper.thumbnail,
    isActive: true,
    createdAt: '2024-12-12',
    metadata: {
      title: '휴대폰 배경화면 월드컵 - 최애 배경화면 찾기 | Cozy',
      description: '산 풍경부터 우주까지! 8가지 배경화면 중 당신의 최애는?',
      ogImage: images.wallpaper.og,
      keywords: ['배경화면', '휴대폰', '월드컵', 'wallpaper', '핸드폰 배경', '배경'],
    },
    items: phoneWallpaperItems,
  },
];

export function getActiveWorldcups(): IWorldcupSummary[] {
  return worldcupConfigs
    .filter((config) => config.isActive)
    .map(({ id, slug, title, description, roundCount, thumbnailImage, metadata }) => ({
      id,
      slug,
      title,
      description,
      roundCount,
      thumbnailImage,
      metadata,
    }));
}

export function getWorldcupBySlug(slug: string): IWorldcupConfig | undefined {
  return worldcupConfigs.find((config) => config.slug === slug && config.isActive);
}

export function getAllWorldcupSlugs(): string[] {
  return worldcupConfigs.filter((config) => config.isActive).map((config) => config.slug);
}
