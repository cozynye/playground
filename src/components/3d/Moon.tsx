'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 초기 렌더링 시 한 번만 계산
function getMoonConfig() {
  if (typeof window === 'undefined') {
    return { scale: 2, position: [-7, -4.5, -5] as [number, number, number] };
  }

  const width = window.innerWidth;
  if (width < 400) {
    return { scale: 1.2, position: [-3.5, -3.5, -5] as [number, number, number] };
  } else if (width < 768) {
    return { scale: 1.5, position: [-4.5, -4, -5] as [number, number, number] };
  }
  return { scale: 2, position: [-7, -4.5, -5] as [number, number, number] };
}

export default function Moon() {
  const moonRef = useRef<THREE.Group>(null);

  // useMemo로 한 번만 계산 (리렌더링 방지)
  const moonConfig = useMemo(() => getMoonConfig(), []);

  // 사실적인 달 표면 텍스처 생성 (회색 톤 + 크레이터)
  const moonTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 기본 달 표면 색상 (밝은 회색)
      const baseGray = 140;
      ctx.fillStyle = `rgb(${baseGray}, ${baseGray}, ${baseGray + 5})`;
      ctx.fillRect(0, 0, 1024, 1024);

      // 표면 노이즈 (미세한 질감)
      for (let i = 0; i < 50000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const variation = Math.random() * 40 - 20;
        const gray = baseGray + variation;
        ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // 마레 (바다) 영역 - 더 어두운 회색 영역
      const mares = [
        { x: 300, y: 350, rx: 180, ry: 120, darkness: 0.25 },
        { x: 650, y: 400, rx: 150, ry: 100, darkness: 0.2 },
        { x: 450, y: 600, rx: 200, ry: 130, darkness: 0.22 },
        { x: 200, y: 700, rx: 120, ry: 80, darkness: 0.18 },
        { x: 750, y: 250, rx: 100, ry: 70, darkness: 0.2 },
      ];

      mares.forEach((mare) => {
        const gradient = ctx.createRadialGradient(
          mare.x, mare.y, 0,
          mare.x, mare.y, Math.max(mare.rx, mare.ry)
        );
        gradient.addColorStop(0, `rgba(80, 80, 85, ${mare.darkness})`);
        gradient.addColorStop(0.7, `rgba(100, 100, 105, ${mare.darkness * 0.5})`);
        gradient.addColorStop(1, 'rgba(140, 140, 145, 0)');

        ctx.beginPath();
        ctx.ellipse(mare.x, mare.y, mare.rx, mare.ry, Math.random() * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // 크레이터 (다양한 크기)
      const craters = [
        // 큰 크레이터
        { x: 180, y: 200, r: 70 },
        { x: 800, y: 180, r: 65 },
        { x: 500, y: 150, r: 55 },
        { x: 850, y: 600, r: 60 },
        { x: 150, y: 550, r: 50 },
        // 중간 크레이터
        { x: 350, y: 120, r: 35 },
        { x: 600, y: 300, r: 40 },
        { x: 250, y: 400, r: 38 },
        { x: 700, y: 500, r: 42 },
        { x: 400, y: 800, r: 45 },
        { x: 900, y: 400, r: 35 },
        { x: 100, y: 850, r: 40 },
        // 작은 크레이터
        { x: 450, y: 250, r: 20 },
        { x: 550, y: 450, r: 22 },
        { x: 300, y: 650, r: 18 },
        { x: 750, y: 750, r: 25 },
        { x: 200, y: 300, r: 15 },
        { x: 650, y: 200, r: 18 },
        { x: 850, y: 850, r: 20 },
        { x: 100, y: 150, r: 22 },
        { x: 950, y: 300, r: 16 },
        { x: 500, y: 950, r: 24 },
      ];

      craters.forEach((crater) => {
        // 크레이터 내부 (어두운 부분)
        const innerGradient = ctx.createRadialGradient(
          crater.x - crater.r * 0.15,
          crater.y - crater.r * 0.15,
          0,
          crater.x,
          crater.y,
          crater.r
        );
        innerGradient.addColorStop(0, 'rgb(90, 90, 95)');
        innerGradient.addColorStop(0.5, 'rgb(110, 110, 115)');
        innerGradient.addColorStop(0.8, 'rgb(130, 130, 135)');
        innerGradient.addColorStop(1, `rgb(${baseGray}, ${baseGray}, ${baseGray + 5})`);

        ctx.beginPath();
        ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
        ctx.fillStyle = innerGradient;
        ctx.fill();

        // 크레이터 테두리 하이라이트 (오른쪽 아래 빛 반사)
        ctx.beginPath();
        ctx.arc(crater.x, crater.y, crater.r, Math.PI * 0.8, Math.PI * 1.8);
        ctx.strokeStyle = 'rgba(180, 180, 185, 0.6)';
        ctx.lineWidth = crater.r * 0.08;
        ctx.stroke();

        // 크레이터 그림자 (왼쪽 위)
        ctx.beginPath();
        ctx.arc(crater.x, crater.y, crater.r * 0.95, Math.PI * 1.8, Math.PI * 0.8);
        ctx.strokeStyle = 'rgba(60, 60, 65, 0.4)';
        ctx.lineWidth = crater.r * 0.1;
        ctx.stroke();
      });

      // 추가 표면 디테일 (밝은 반점들 - 고지대)
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = Math.random() * 15 + 5;
        const brightness = 160 + Math.random() * 30;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, `rgba(${brightness}, ${brightness}, ${brightness + 5}, 0.3)`);
        gradient.addColorStop(1, 'rgba(140, 140, 145, 0)');

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // 범프맵 텍스처 (입체감)
  const bumpTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 512, 512);

      // 범프맵용 노이즈
      for (let i = 0; i < 10000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const gray = Math.random() * 100 + 78;
        ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // 크레이터 범프
      const bumps = [
        { x: 90, y: 100, r: 35 },
        { x: 400, y: 90, r: 32 },
        { x: 250, y: 75, r: 27 },
        { x: 425, y: 300, r: 30 },
        { x: 75, y: 275, r: 25 },
      ];

      bumps.forEach((bump) => {
        const gradient = ctx.createRadialGradient(
          bump.x - bump.r * 0.3, bump.y - bump.r * 0.3, 0,
          bump.x, bump.y, bump.r
        );
        gradient.addColorStop(0, '#404040');
        gradient.addColorStop(0.7, '#606060');
        gradient.addColorStop(1, '#808080');

        ctx.beginPath();
        ctx.arc(bump.x, bump.y, bump.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // 매우 느린 애니메이션
  useFrame((state) => {
    if (moonRef.current) {
      const time = state.clock.elapsedTime;

      // 매우 느린 자전 (0.01 속도)
      moonRef.current.rotation.y = time * 0.01;

      // 미세한 흔들림 (breathing effect)
      const breathe = Math.sin(time * 0.2) * 0.03;
      moonRef.current.position.y = moonConfig.position[1] + breathe;

      // 매우 미세한 좌우 흔들림
      const sway = Math.sin(time * 0.15) * 0.02;
      moonRef.current.position.x = moonConfig.position[0] + sway;
    }
  });

  return (
    <group ref={moonRef} position={moonConfig.position} scale={moonConfig.scale}>
      {/* 달 본체 */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={moonTexture}
          bumpMap={bumpTexture}
          bumpScale={0.02}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* 달 주변 은은한 글로우 */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#9090a0"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 더 큰 외부 글로우 */}
      <mesh scale={1.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#707080"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
