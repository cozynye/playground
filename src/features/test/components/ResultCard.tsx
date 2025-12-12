'use client';

import Image from 'next/image';
import type { ITestResultType, ITestColors } from '../types';

interface ResultCardProps {
  result: ITestResultType;
  rank: number;
  colors: ITestColors;
}

export function ResultCard({ result, rank, colors }: ResultCardProps) {
  const isFirst = rank === 1;

  return (
    <div
      className={`bg-white rounded-3xl shadow-2xl overflow-hidden ${
        isFirst ? 'border-4' : 'border-2'
      }`}
      style={{
        borderColor: isFirst ? colors.primary : colors.secondary,
      }}
    >
      {/* 순위 뱃지 */}
      <div
        className="py-4 text-center font-bold text-white text-lg"
        style={{
          background: isFirst
            ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
            : colors.secondary,
          color: isFirst ? 'white' : colors.text,
        }}
      >
        {rank === 1 ? '🥇 1위' : '🥈 2위'}
      </div>

      {/* 이미지 */}
      <div className="relative w-full aspect-square bg-gray-100">
        <Image src={result.image} alt={result.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      {/* 콘텐츠 */}
      <div className="p-6 md:p-8">
        {/* 제목 */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: colors.text }}>
          {result.title}
        </h2>

        {/* 설명 */}
        <p className="text-gray-700 leading-relaxed mb-6">{result.description}</p>

        {/* 상세 설명 */}
        {result.details && result.details.length > 0 && (
          <div className="space-y-2 mb-6">
            {result.details.map((detail, index) => (
              <div key={index} className="flex items-start gap-2">
                <span
                  className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors.primary }}
                />
                <p className="text-gray-600 text-sm">{detail}</p>
              </div>
            ))}
          </div>
        )}

        {/* 태그 */}
        {result.tags && result.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
