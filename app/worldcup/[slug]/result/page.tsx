'use client';

import { useEffect, useCallback } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Layout, Button } from '@/components/ui';
import { getWorldcupBySlug } from '@/features/worldcup';
import { ShareButtons } from '@/features/worldcup/components/ShareButtons';

export default function WorldcupResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const winnerId = searchParams.get('winner');

  const config = getWorldcupBySlug(slug);

  // 폭죽 애니메이션
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // 왼쪽에서 발사
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });

      // 오른쪽에서 발사
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (config && winnerId) {
      fireConfetti();
    }
  }, [config, winnerId, fireConfetti]);

  if (!config || !winnerId) {
    notFound();
  }

  const winner = config.items.find((item) => item.id === winnerId);

  if (!winner) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cozy.example.com';
  const shareUrl = `${baseUrl}/worldcup/${slug}/result?winner=${winnerId}`;

  return (
    <Layout
      header={
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/worldcup" className="text-xl font-bold text-cozy-primary">
            🏆 월드컵
          </Link>
          <Link
            href="/worldcup"
            className="text-sm text-gray-600 transition-colors hover:text-cozy-primary"
          >
            목록으로
          </Link>
        </nav>
      }
      footer={
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 Cozy. All rights reserved.</p>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex flex-col items-center">
          <header className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{config.title}</h1>
          </header>

          <div className="mt-8 w-full max-w-md overflow-hidden rounded-2xl border-4 border-cozy-primary bg-white shadow-xl">
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
              <Image
                src={winner.imagePath}
                alt={winner.imageAlt || winner.name}
                fill
                className="object-cover"
                sizes="(max-width: 800px) 100vw, 400px"
              />
            </div>
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-cozy-primary">🏆 최종 우승</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">{winner.name}</h2>
              {winner.description && (
                <p className="mt-2 text-gray-600">{winner.description}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <ShareButtons
              url={shareUrl}
              title={`${config.title} 결과: ${winner.name}`}
              description={config.metadata.description}
            />
            <Link href={`/worldcup/${slug}`}>
              <Button variant="outline" className="w-full">
                나도 해보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
