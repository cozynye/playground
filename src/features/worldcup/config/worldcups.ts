import type { IWorldcupConfig, IWorldcupSummary } from '../types';
import { foodItems, colorItems, animalItems } from './items';

// Unsplash 이미지 URL 헬퍼
function getUnsplashImage(photoId: string, width = 600, height = 600): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

// 썸네일 및 OG 이미지
const images = {
  food: {
    thumbnail: getUnsplashImage('1504674900247-0877df9cc836', 600, 600), // 다양한 음식 테이블
    og: getUnsplashImage('1504674900247-0877df9cc836', 1200, 630),
  },
  color: {
    thumbnail: getUnsplashImage('1525909002-1b05e0c869d8', 600, 600), // 다채로운 색상 페인트
    og: getUnsplashImage('1525909002-1b05e0c869d8', 1200, 630),
  },
  animal: {
    thumbnail: getUnsplashImage('1425082661705-1834bfd09dca', 600, 600), // 귀여운 동물들
    og: getUnsplashImage('1425082661705-1834bfd09dca', 1200, 630),
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
