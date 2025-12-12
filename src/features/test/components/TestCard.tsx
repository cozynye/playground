'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ITest } from '../types';

interface TestCardProps {
  test: ITest;
}

export function TestCard({ test }: TestCardProps) {
  const { slug, title, description, thumbnailImage, colors, estimatedTime, category } = test;

  return (
    <Link href={`/test/${slug}/quiz`} className="group block h-full">
      <article
        className="h-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        style={{
          borderTop: `4px solid ${colors.primary}`,
        }}
      >
        {/* 썸네일 이미지 */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={thumbnailImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* 카테고리 뱃지 */}
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg"
              style={{ backgroundColor: colors.primary }}
            >
              {getCategoryLabel(category)}
            </span>
          </div>
          {/* 소요 시간 */}
          {estimatedTime && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs text-white font-medium">⏱️ {estimatedTime}분</span>
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          <h3
            className="text-xl font-bold mb-2 line-clamp-1 transition-colors"
            style={{ color: colors.text }}
          >
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>

          {/* 시작 버튼 */}
          <div className="flex items-center justify-between mt-4">
            <button
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              테스트 시작 →
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

// 카테고리 레이블 변환
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    personality: '성격',
    love: '연애',
    psychology: '심리',
    fun: '재미',
    career: '진로',
  };
  return labels[category] || category;
}
