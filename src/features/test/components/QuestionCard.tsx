'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ITestQuestion, ITestColors } from '../types';

interface QuestionCardProps {
  question: ITestQuestion;
  questionNumber: number;
  totalQuestions: number;
  colors: ITestColors;
  onAnswer: (answerId: string) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  colors,
  onAnswer,
}: QuestionCardProps) {
  const [clickedId, setClickedId] = useState<string | null>(null);

  const handleAnswerClick = (answerId: string) => {
    setClickedId(answerId);
    onAnswer(answerId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 질문 카드 */}
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        style={{
          borderTop: `6px solid ${colors.primary}`,
        }}
      >
        {/* 질문 번호 */}
        <div className="text-center mb-6">
          <span
            className="inline-block px-6 py-2 rounded-full text-white font-bold text-sm"
            style={{ backgroundColor: colors.primary }}
          >
            Q{questionNumber}
          </span>
        </div>

        {/* 질문 이미지 (있는 경우) */}
        {question.image && (
          <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden">
            <Image
              src={question.image}
              alt="질문 이미지"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* 질문 텍스트 */}
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-3"
          style={{ color: colors.text }}
        >
          {question.question}
        </h2>

        {/* 질문 설명 (있는 경우) */}
        {question.description && (
          <p className="text-gray-600 text-center mb-8">{question.description}</p>
        )}

        {/* 답변 선택지 */}
        <div className="space-y-3 md:space-y-4 mt-8">
          {question.answers.map((answer, index) => {
            const isClicked = clickedId === answer.id;
            return (
              <button
                key={answer.id}
                onClick={() => handleAnswerClick(answer.id)}
                disabled={clickedId !== null}
                className="w-full p-6 md:p-6 rounded-2xl border-2 border-gray-200 transition-all duration-200 text-left group min-h-[88px] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: isClicked ? colors.primary : 'transparent',
                  backgroundColor: isClicked ? colors.background : 'white',
                  opacity: clickedId && !isClicked ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!clickedId) {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.backgroundColor = colors.background;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!clickedId) {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  {/* 선택지 이미지 (있는 경우) */}
                  {answer.image && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={answer.image}
                        alt="답변 이미지"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}

                  {/* 선택지 번호 및 텍스트 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="w-9 h-9 md:w-8 md:h-8 flex-shrink-0 flex items-center justify-center rounded-full text-white text-base md:text-sm font-bold"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium leading-relaxed text-base md:text-base">
                      {answer.text}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
