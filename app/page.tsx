'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import 3D scene to avoid SSR issues
const Scene = dynamic(() => import('@/components/3d/Scene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-black" />
  ),
});

// 서비스 경로 - prefetch 대상
const SERVICE_ROUTES = ['/worldcup', '/weather', '/test'];

export default function HomePage() {
  const router = useRouter();
  const [showHint, setShowHint] = useState(true);

  // 페이지 로드 시 서비스 페이지 prefetch
  useEffect(() => {
    SERVICE_ROUTES.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  const handleServiceClick = useCallback((href: string) => {
    if (href === '#') return;
    router.push(href);
  }, [router]);

  useEffect(() => {
    // Hide hint after 5 seconds
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 3D Scene */}
      <Scene onServiceClick={handleServiceClick} />

      {/* UI Overlay - 항상 렌더링, 애니메이션은 CSS로 1회만 */}
      <div className="pointer-events-none absolute inset-0">
        {/* Title */}
        <header className="absolute left-0 right-0 top-0 p-6 text-center">
          <h1 className="title-animate text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Cozy
            </span>
          </h1>
          <p className="subtitle-animate mt-2 text-lg text-gray-300 md:text-xl">
            다양한 서비스를 하나의 공간에서
          </p>
        </header>

        {/* Interaction hint */}
        {showHint && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm">
              <p className="flex items-center gap-2 text-sm text-white">
                <span className="animate-pulse">✨</span>
                마우스를 움직여 탐험하고, 서비스를 클릭하세요
                <span className="animate-pulse">✨</span>
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 p-4 text-center">
          <p className="text-xs text-gray-500">
            &copy; 2024 Cozy. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Custom styles - 애니메이션은 페이지 로드 시 1회만 실행 */}
      <style jsx global>{`
        @keyframes title-fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes subtitle-fade-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 애니메이션 클래스 - forwards로 최종 상태 유지 */
        .title-animate {
          opacity: 0;
          animation: title-fade-in 1s ease-out 0.2s forwards;
        }

        .subtitle-animate {
          opacity: 0;
          animation: subtitle-fade-in 1s ease-out 0.6s forwards;
        }

        /* Hide scrollbar */
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
