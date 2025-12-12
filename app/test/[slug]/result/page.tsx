'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getTestBySlug } from '@/features/test/config/tests';
import { ResultCard } from '@/features/test/components/ResultCard';
import type { ITestResultType } from '@/features/test/types';

export default function TestResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const test = getTestBySlug(slug);

  const primaryId = searchParams.get('primary');
  const secondaryId = searchParams.get('secondary');

  const [primaryResult, setPrimaryResult] = useState<ITestResultType | null>(null);
  const [secondaryResult, setSecondaryResult] = useState<ITestResultType | null>(null);

  // 폭죽 애니메이션
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (!test || !primaryId) {
      router.push(`/test/${slug}`);
      return;
    }

    // 결과 찾기
    const primary = test.results.find((r) => r.id === primaryId);
    const secondary = secondaryId ? test.results.find((r) => r.id === secondaryId) : undefined;

    if (!primary) {
      router.push(`/test/${slug}`);
      return;
    }

    setPrimaryResult(primary);
    setSecondaryResult(secondary || null);

    // 폭죽 효과
    fireConfetti();
  }, [test, primaryId, secondaryId, slug, router, fireConfetti]);

  const handleShare = async (type: 'native' | 'twitter' | 'url') => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/test/${slug}/result?primary=${primaryId}${secondaryId ? `&secondary=${secondaryId}` : ''}`;
    const title = `${test?.title} 결과: ${primaryResult?.title}`;
    const description = test?.description || '';

    if (type === 'url') {
      try {
        await navigator.clipboard.writeText(url);
        alert('URL이 복사되었습니다!');
      } catch (err) {
        console.error('URL 복사 실패:', err);
      }
    } else if (type === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n${description}`)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    } else if (type === 'native') {
      if (navigator.share) {
        try {
          await navigator.share({ title, text: description, url });
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            console.error('공유 실패:', err);
          }
        }
      } else {
        handleShare('url');
      }
    }
  };

  const handleRestart = () => {
    router.push(`/test/${slug}/quiz`);
  };

  if (!test || !primaryResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen py-8 md:py-12"
      style={{
        background: `linear-gradient(135deg, ${test.colors.background} 0%, white 100%)`,
      }}
    >
      {/* 메인 콘텐츠 */}
      <div className="max-w-5xl mx-auto px-4">
        {/* 타이틀 */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
            style={{ color: test.colors.text }}
          >
            {test.title}
          </h1>
          <p className="text-lg text-gray-600">테스트 결과</p>
        </div>

        {/* 결과 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
          <ResultCard result={primaryResult} rank={1} colors={test.colors} />
          {secondaryResult && <ResultCard result={secondaryResult} rank={2} colors={test.colors} />}
        </div>

        {/* 공유 버튼 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h3 className="text-lg md:text-xl font-bold text-center mb-6 text-gray-800">
            결과 공유하기
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <button
              onClick={() => handleShare('url')}
              className="flex items-center justify-center gap-2 px-8 py-4 md:px-6 md:py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors min-h-[56px] md:min-h-[48px] text-base"
            >
              <span className="text-xl md:text-base">🔗</span>
              <span>링크 복사</span>
            </button>
            <button
              onClick={() => handleShare('native')}
              className="flex items-center justify-center gap-2 px-8 py-4 md:px-6 md:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors min-h-[56px] md:min-h-[48px] text-base"
            >
              <span className="text-xl md:text-base">📤</span>
              <span>공유하기</span>
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center gap-2 px-8 py-4 md:px-6 md:py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-xl transition-colors min-h-[56px] md:min-h-[48px] text-base"
            >
              <span className="text-xl md:text-base">𝕏</span>
              <span>트위터</span>
            </button>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <button
            onClick={handleRestart}
            className="flex-1 py-5 md:py-4 rounded-2xl font-bold text-lg md:text-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-white min-h-[64px] md:min-h-[56px]"
            style={{
              background: `linear-gradient(135deg, ${test.colors.primary}, ${test.colors.secondary})`,
            }}
          >
            다시 테스트하기 🔄
          </button>
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <Link href={`/test/${slug}`} className="flex-1">
              <button
                className="w-full py-5 md:py-4 rounded-2xl bg-white border-2 font-bold text-base md:text-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] min-h-[64px] md:min-h-[56px]"
                style={{
                  borderColor: test.colors.primary,
                  color: test.colors.text,
                }}
              >
                나도 해보기
              </button>
            </Link>
            <Link href="/test" className="flex-1">
              <button
                className="w-full py-5 md:py-4 rounded-2xl bg-white border-2 font-bold text-base md:text-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] min-h-[64px] md:min-h-[56px]"
                style={{
                  borderColor: test.colors.primary,
                  color: test.colors.text,
                }}
              >
                다른 테스트 →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
