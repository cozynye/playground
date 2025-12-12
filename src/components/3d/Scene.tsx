'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, memo } from 'react';
import { Environment, Stars, Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import FloatingServiceBoxes from './FloatingServiceBoxes';
import Genie from './Genie';
import ParticleField from './ParticleField';
import CameraController from './CameraController';
import Moon from './Moon';

interface SceneProps {
  onServiceClick: (href: string) => void;
}

// 초기 렌더링 시 한 번만 계산 (SSR 안전)
function getPerformanceSettings() {
  if (typeof window === 'undefined') {
    return { starCount: 2000, antialias: true, dpr: [1, 2] as [number, number] };
  }

  const width = window.innerWidth;
  const isSmallMobile = width < 400;
  const isMobile = width < 768;

  if (isSmallMobile) {
    return { starCount: 500, antialias: false, dpr: [0.75, 1] as [number, number] };
  } else if (isMobile) {
    return { starCount: 1000, antialias: false, dpr: [0.75, 1.5] as [number, number] };
  }
  return { starCount: 2000, antialias: true, dpr: [1, 2] as [number, number] };
}

// 메모이제이션된 하위 컴포넌트들
const MemoizedGenie = memo(Genie);
const MemoizedMoon = memo(Moon);
const MemoizedParticleField = memo(ParticleField);
const MemoizedCameraController = memo(CameraController);

function Scene({ onServiceClick }: SceneProps) {
  // useMemo로 한 번만 계산
  const { starCount, antialias, dpr } = useMemo(() => getPerformanceSettings(), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%)' }}
      gl={{
        antialias,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      }}
      dpr={dpr}
      performance={{ min: 0.5 }}
    >
      {/* 성능 최적화 헬퍼 */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <Suspense fallback={null}>
        {/* Lighting - 단순화 */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />

        {/* Background Stars - 수 감소 */}
        <Stars
          radius={80}
          depth={40}
          count={starCount}
          factor={4}
          saturation={0}
          fade
          speed={0.8}
        />

        {/* Particle Effects */}
        <MemoizedParticleField />

        {/* Service Boxes */}
        <FloatingServiceBoxes onServiceClick={onServiceClick} />

        {/* Genie Character */}
        <MemoizedGenie />

        {/* Dark Moon - 왼쪽 하단 */}
        <MemoizedMoon />

        {/* Camera Animation */}
        <MemoizedCameraController />

        {/* Environment - 가벼운 프리셋 */}
        <Environment preset="night" />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

export default memo(Scene);
