'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { IWorldcupItem, IGameState, GamePhase, IRoundInfo, IMatch } from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createMatches(items: IWorldcupItem[]): IMatch[] {
  const matches: IMatch[] = [];
  for (let i = 0; i < items.length; i += 2) {
    matches.push({ left: items[i], right: items[i + 1] });
  }
  return matches;
}

export function getRoundName(round: number): string {
  if (round === 2) return '결승';
  if (round === 4) return '준결승';
  return `${round}강`;
}

interface UseWorldcupGameOptions {
  autoStart?: boolean;
}

interface UseWorldcupGameReturn {
  gameState: IGameState;
  startGame: () => void;
  selectItem: (position: 'left' | 'right') => void;
  restartGame: () => void;
  roundName: string;
  progress: number;
  nextMatch: IMatch | null;
}

export function useWorldcupGame(
  items: IWorldcupItem[],
  roundCount: number,
  options: UseWorldcupGameOptions = {}
): UseWorldcupGameReturn {
  const { autoStart = false } = options;
  const hasAutoStarted = useRef(false);
  // 항상 'ready'로 시작 - hydration mismatch 방지 (Math.random() 사용하므로)
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [currentRound, setCurrentRound] = useState(roundCount);
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [winners, setWinners] = useState<IWorldcupItem[]>([]);
  const [finalWinner, setFinalWinner] = useState<IWorldcupItem | null>(null);

  const startGame = useCallback(() => {
    if (items.length < roundCount) {
      console.error('항목 수가 라운드 수보다 적습니다.');
      return;
    }
    const shuffledItems = shuffleArray(items).slice(0, roundCount);
    const initialMatches = createMatches(shuffledItems);

    setPhase('playing');
    setCurrentRound(roundCount);
    setMatches(initialMatches);
    setMatchIndex(0);
    setWinners([]);
    setFinalWinner(null);
  }, [items, roundCount]);

  // autoStart 옵션이 true면 컴포넌트 마운트 시 자동으로 게임 시작
  useEffect(() => {
    if (autoStart && !hasAutoStarted.current && items.length >= roundCount) {
      hasAutoStarted.current = true;
      startGame();
    }
  }, [autoStart, items, roundCount, startGame]);

  const selectItem = useCallback(
    (position: 'left' | 'right') => {
      if (phase !== 'playing' || !matches[matchIndex]) return;

      const selectedItem = position === 'left' ? matches[matchIndex].left : matches[matchIndex].right;
      const newWinners = [...winners, selectedItem];
      const isLastMatchInRound = matchIndex >= matches.length - 1;

      if (isLastMatchInRound) {
        if (currentRound === 2) {
          setFinalWinner(selectedItem);
          setPhase('result');
          setWinners([]);
          return;
        }

        const nextRound = currentRound / 2;
        const shuffledWinners = shuffleArray(newWinners);
        const nextMatches = createMatches(shuffledWinners);

        setCurrentRound(nextRound);
        setMatches(nextMatches);
        setMatchIndex(0);
        setWinners([]);
      } else {
        setWinners(newWinners);
        setMatchIndex(matchIndex + 1);
      }
    },
    [phase, matches, matchIndex, winners, currentRound]
  );

  const restartGame = useCallback(() => {
    setPhase('ready');
    setCurrentRound(roundCount);
    setMatches([]);
    setMatchIndex(0);
    setWinners([]);
    setFinalWinner(null);
  }, [roundCount]);

  const currentMatch: IMatch | null = matches[matchIndex] || null;
  const nextMatch: IMatch | null = matches[matchIndex + 1] || null;

  const roundInfo: IRoundInfo | null =
    phase === 'playing'
      ? { currentRound, matchIndex, totalMatches: matches.length }
      : null;

  const gameState: IGameState = useMemo(
    () => ({ phase, roundInfo, currentMatch, winners, finalWinner }),
    [phase, roundInfo, currentMatch, winners, finalWinner]
  );

  const roundName = getRoundName(currentRound);

  const progress = useMemo(() => {
    if (phase !== 'playing') return 0;

    let totalMatches = 0;
    let completedMatches = 0;
    let round = roundCount;

    while (round >= 2) {
      const matchesInRound = round / 2;
      totalMatches += matchesInRound;

      if (round > currentRound) {
        completedMatches += matchesInRound;
      } else if (round === currentRound) {
        completedMatches += matchIndex;
      }

      round = round / 2;
    }

    return Math.round((completedMatches / totalMatches) * 100);
  }, [phase, roundCount, currentRound, matchIndex]);

  return { gameState, startGame, selectItem, restartGame, roundName, progress, nextMatch };
}
