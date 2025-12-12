'use client';

import { useParams, useRouter } from 'next/navigation';
import { getTestBySlug } from '@/features/test/config/tests';
import { useTest } from '@/features/test/hooks/useTest';
import { ProgressBar } from '@/features/test/components/ProgressBar';
import { QuestionCard } from '@/features/test/components/QuestionCard';
import { useEffect } from 'react';

export default function TestQuizPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const test = getTestBySlug(slug);

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isCompleted,
    handleAnswer,
    handlePreviousQuestion,
    calculateResults,
  } = useTest(test!);

  // 결과 페이지로 이동
  useEffect(() => {
    if (isCompleted) {
      const results = calculateResults();
      // URL 파라미터로 결과 전달 (공유 가능하도록)
      const resultParams = new URLSearchParams({
        primary: results.primaryResult.id,
        ...(results.secondaryResult && { secondary: results.secondaryResult.id }),
      });
      router.push(`/test/${slug}/result?${resultParams.toString()}`);
    }
  }, [isCompleted, slug, router, calculateResults]);

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">테스트를 찾을 수 없습니다.</p>
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
      {/* 헤더 */}
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              currentQuestionIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            ← 이전
          </button>
          <h1 className="text-lg font-bold text-gray-800">{test.title}</h1>
          <div className="w-20" /> {/* 균형을 위한 빈 공간 */}
        </div>

        {/* 진행률 바 */}
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          color={test.colors.primary}
        />
      </div>

      {/* 질문 카드 */}
      <div className="px-4">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          colors={test.colors}
          onAnswer={handleAnswer}
        />
      </div>
    </main>
  );
}
