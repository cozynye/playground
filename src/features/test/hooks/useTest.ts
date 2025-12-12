'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ITest, ITestResultType } from '../types';

export function useTest(test: ITest) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // 답변 선택 핸들러
  const handleAnswer = useCallback(
    (answerId: string) => {
      const questionId = currentQuestion.id;

      // 답변 저장
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answerId,
      }));

      // 다음 질문으로 이동 또는 완료
      if (isLastQuestion) {
        setIsCompleted(true);
      } else {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 150);
      }
    },
    [currentQuestion, isLastQuestion]
  );

  // 결과 계산
  const calculateResults = useCallback((): {
    primaryResult: ITestResultType;
    secondaryResult?: ITestResultType;
    scores: Record<string, number>;
  } => {
    const scores: Record<string, number> = {};

    // 모든 결과 타입 초기화
    test.results.forEach((result) => {
      scores[result.id] = 0;
    });

    // 점수 계산
    test.questions.forEach((question) => {
      const selectedAnswerId = answers[question.id];
      if (!selectedAnswerId) return;

      const selectedAnswer = question.answers.find((a) => a.id === selectedAnswerId);
      if (!selectedAnswer) return;

      // 각 결과 타입별 점수 합산
      Object.entries(selectedAnswer.score).forEach(([key, value]) => {
        scores[key] = (scores[key] || 0) + value;
      });
    });

    // 점수 기준으로 정렬
    const sortedResults = test.results
      .map((result) => ({
        ...result,
        percentage: scores[result.id] || 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      primaryResult: sortedResults[0],
      secondaryResult: sortedResults.length > 1 ? sortedResults[1] : undefined,
      scores,
    };
  }, [test, answers]);

  // 이전 질문으로 이동
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // 테스트 재시작
  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  }, []);

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    isCompleted,
    answers,
    handleAnswer,
    handlePreviousQuestion,
    handleRestart,
    calculateResults,
  };
}
