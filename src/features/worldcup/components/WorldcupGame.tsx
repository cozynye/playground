'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import type { IWorldcupConfig } from '../types';
import { useWorldcupGame } from '../hooks';
import { ShareButtons } from './ShareButtons';

interface WorldcupGameProps {
  config: IWorldcupConfig;
  currentUrl: string;
  autoStart?: boolean;
}

export function WorldcupGame({ config, currentUrl, autoStart = false }: WorldcupGameProps) {
  const { title, items, roundCount, metadata } = config;
  const { gameState, startGame, selectItem, restartGame, roundName, progress, nextMatch } =
    useWorldcupGame(items, roundCount, { autoStart });
  const router = useRouter();
  const pathname = usePathname();

  const { phase, roundInfo, currentMatch, finalWinner } = gameState;

  // URL에서 autostart 파라미터 제거
  useEffect(() => {
    if (autoStart) {
      router.replace(pathname, { scroll: false });
    }
  }, [autoStart, router, pathname]);

  // 결승 여부 확인
  const isFinal = roundInfo?.currentRound === 2;

  const handleSelect = useCallback(
    (position: 'left' | 'right') => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // 결승에서 선택 시 바로 결과 페이지로 이동
      if (isFinal && currentMatch) {
        const selectedItem = position === 'left' ? currentMatch.left : currentMatch.right;
        router.push(`${pathname}/result?winner=${selectedItem.id}`);
        return;
      }

      selectItem(position);
    },
    [isFinal, currentMatch, router, pathname, selectItem]
  );

  const handleSelectLeft = useCallback(() => {
    handleSelect('left');
  }, [handleSelect]);

  const handleSelectRight = useCallback(() => {
    handleSelect('right');
  }, [handleSelect]);

  if (items.length < roundCount) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-red-500">
          항목 수({items.length}개)가 라운드 수({roundCount}강)보다 적습니다.
        </p>
        <p className="mt-2 text-gray-500">최소 {roundCount}개의 항목이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
      </header>

      {phase === 'ready' && (
        <div className="mt-16 flex flex-col items-center justify-center">
          {autoStart ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cozy-primary border-t-transparent" />
              <p className="mt-4 text-gray-500">게임 준비 중...</p>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-600">{roundCount}강 토너먼트</p>
              <p className="mt-2 text-sm text-gray-500">
                {items.length}개의 항목 중 최고를 선택하세요!
              </p>
              <Button onClick={startGame} className="mt-6">
                시작하기
              </Button>
            </>
          )}
        </div>
      )}

      {phase === 'playing' && currentMatch && roundInfo && (
        <div className="mt-6">
          <div className="mb-6 text-center">
            <p className="text-lg font-semibold text-cozy-primary">
              {roundName} ({roundInfo.matchIndex + 1}/{roundInfo.totalMatches})
            </p>
            <div className="mx-auto mt-2 h-2 w-full max-w-md overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-cozy-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-row gap-2 sm:gap-6">
            <button
              key={currentMatch.left.id}
              tabIndex={-1}
              onClick={handleSelectLeft}
              className="group flex-1 overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all hover:border-cozy-primary hover:shadow-lg active:scale-[0.98]"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <Image
                  src={currentMatch.left.imagePath}
                  alt={currentMatch.left.imageAlt || currentMatch.left.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>
              <div className="p-2 sm:p-4">
                <p className="text-sm font-bold text-gray-900 group-hover:text-cozy-primary sm:text-lg">
                  {currentMatch.left.name}
                </p>
                {currentMatch.left.description && (
                  <p className="mt-1 hidden text-sm text-gray-500 sm:block">{currentMatch.left.description}</p>
                )}
              </div>
            </button>

            <div className="flex items-center justify-center">
              <span className="rounded-full bg-gray-900 px-2 py-1 text-xs font-bold text-white sm:px-4 sm:py-2 sm:text-lg">
                VS
              </span>
            </div>

            <button
              key={currentMatch.right.id}
              tabIndex={-1}
              onClick={handleSelectRight}
              className="group flex-1 overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all hover:border-cozy-primary hover:shadow-lg active:scale-[0.98]"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <Image
                  src={currentMatch.right.imagePath}
                  alt={currentMatch.right.imageAlt || currentMatch.right.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>
              <div className="p-2 sm:p-4">
                <p className="text-sm font-bold text-gray-900 group-hover:text-cozy-primary sm:text-lg">
                  {currentMatch.right.name}
                </p>
                {currentMatch.right.description && (
                  <p className="mt-1 hidden text-sm text-gray-500 sm:block">{currentMatch.right.description}</p>
                )}
              </div>
            </button>
          </div>

          {/* 다음 매치 미리보기 */}
          {nextMatch && (
            <div className="mx-auto mt-8 w-[80%]">
              <p className="mb-3 text-center text-sm text-gray-400">다음 대결</p>
              <div className="flex flex-row gap-2 opacity-50 sm:gap-4">
                <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={nextMatch.left.imagePath}
                      alt={nextMatch.left.imageAlt || nextMatch.left.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 800px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs font-medium text-gray-600 sm:text-sm">
                      {nextMatch.left.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-400 sm:text-sm">VS</span>
                </div>

                <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={nextMatch.right.imagePath}
                      alt={nextMatch.right.imageAlt || nextMatch.right.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 800px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs font-medium text-gray-600 sm:text-sm">
                      {nextMatch.right.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'result' && finalWinner && (
        <div className="mt-8 flex flex-col items-center">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border-4 border-cozy-primary bg-white shadow-xl">
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
              <Image
                src={finalWinner.imagePath}
                alt={finalWinner.imageAlt || finalWinner.name}
                fill
                className="object-cover"
                sizes="(max-width: 800px) 100vw, 400px"
              />
            </div>
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-cozy-primary">🏆 최종 우승</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">{finalWinner.name}</h2>
              {finalWinner.description && (
                <p className="mt-2 text-gray-600">{finalWinner.description}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <ShareButtons
              url={currentUrl}
              title={`${title} 결과: ${finalWinner.name}`}
              description={metadata.description}
            />
            <Button onClick={restartGame} variant="outline">
              다시하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
