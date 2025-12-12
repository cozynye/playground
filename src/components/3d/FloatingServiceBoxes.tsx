'use client';

import React, { useRef, useState, memo, useEffect, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 애니메이션 상수 - 컴포넌트 외부로 이동하여 매 렌더마다 재생성 방지
const ANIMATION_SPEEDS = [0.25, 0.42, 0.31, 0.38];
const ANIMATION_PHASES = [0, Math.PI * 0.7, Math.PI * 1.3, Math.PI * 0.3];
const LEMNISCATE_SCALES = [0.8, 1.0, 0.7, 0.9];

// 현재 화면 크기에 따른 레이아웃 계산 (반응형)
// 3가지 브레이크포인트: Mobile(< 600px), Tablet(600-1024px), Desktop(> 1024px)
function getLayoutConfig() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      positions: [
        [-4, 2, 0],
        [4, 2, 0],
        [-4, -2.5, 0],
        [4, -2.5, 0],
      ] as [number, number, number][],
      scale: 1.3,
    };
  }

  const width = window.innerWidth;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;

  // Mobile (< 600px): 세로 배치, 적당한 박스
  if (isMobile) {
    const scale = 0.9; // 적당한 크기
    const yGap = 2.5; // 박스 간격
    const startY = 4; // 시작 위치
    return {
      isMobile: true,
      positions: [
        [0, startY, 0],
        [0, startY - yGap, 0],
        [0, startY - yGap * 2, 0],
        [0, startY - yGap * 3, 0],
      ] as [number, number, number][],
      scale,
    };
  }

  // Tablet (600px - 1024px): 2x2 그리드, 큰 박스
  if (isTablet) {
    const scale = 1.2;
    const xSpread = 3.5;
    const ySpread = 3;
    return {
      isMobile: false,
      positions: [
        [-xSpread, ySpread * 0.5, 0],
        [xSpread, ySpread * 0.5, 0],
        [-xSpread, -ySpread * 0.6, 0],
        [xSpread, -ySpread * 0.6, 0],
      ] as [number, number, number][],
      scale,
    };
  }

  // Desktop (> 1024px): 2x2 그리드, 데스크톱 크기
  return {
    isMobile: false,
    positions: [
      [-4, 2, 0],
      [4, 2, 0],
      [-4, -2.5, 0],
      [4, -2.5, 0],
    ] as [number, number, number][],
    scale: 1.3,
  };
}

interface Service {
  title: string;
  description: string;
  href: string;
  emoji: string;
  color: string;
}

const services: Service[] = [
  {
    title: 'Worldcup',
    description: '이상형 월드컵',
    href: '/worldcup',
    emoji: '🏆',
    color: '#4169E1', // 밝은 로얄블루 (해왕성)
  },
  {
    title: 'Weather',
    description: '실시간 날씨',
    href: '/weather',
    emoji: '🌤️',
    color: '#20B2AA', // 밝은 청록색 (별빛)
  },
  {
    title: 'Test',
    description: '심리 테스트',
    href: '/test',
    emoji: '💝',
    color: '#9370DB', // 밝은 보라색 (성운)
  },
  {
    title: 'Coming Soon',
    description: '새로운 서비스',
    href: '#',
    emoji: '✨',
    color: '#708090', // 밝은 슬레이트 그레이 (달)
  },
];

interface ServiceBoxProps {
  service: Service;
  position: [number, number, number];
  scale: number;
  onServiceClick: (href: string) => void;
  isMobile?: boolean;
  index: number; // 각 박스마다 다른 애니메이션을 위한 인덱스
}

function ServiceBoxComponent({ service, position, scale, onServiceClick, isMobile = false, index }: ServiceBoxProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    // 8자 모양 애니메이션 (Lemniscate) - 각 박스마다 독립적으로
    if (groupRef.current) {
      // 각 박스마다 완전히 다른 속도 (불규칙적으로)
      const speed = ANIMATION_SPEEDS[index];

      // 각 박스마다 완전히 다른 시작 위상 (불규칙적으로)
      const phase = ANIMATION_PHASES[index];

      // 일부는 반대 방향으로 회전 (시계/반시계)
      const direction = index % 2 === 0 ? 1 : -1;

      const t = state.clock.elapsedTime * speed + phase;

      // 각 박스마다 8자 크기도 약간씩 다르게
      const baseScale = isMobile ? 0.3 : 1.0;
      const lemniscateScale = baseScale * LEMNISCATE_SCALES[index];

      const denominator = 1 + Math.sin(t) * Math.sin(t);

      const offsetX = direction * (lemniscateScale * Math.cos(t)) / denominator;
      const offsetY = (lemniscateScale * Math.sin(t) * Math.cos(t)) / denominator;

      // 원래 위치 + 8자 오프셋
      groupRef.current.position.set(
        position[0] + offsetX,
        position[1] + offsetY,
        position[2]
      );
    }

    if (meshRef.current) {
      // Hover animation - 모바일에서는 더 미묘하게
      const targetScale = hovered ? (isMobile ? 1.08 : 1.15) : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Rotation animation - 모바일에서는 최소화
      const rotationIntensity = isMobile ? 0.3 : 1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1 * rotationIntensity;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3 + position[1]) * 0.05 * rotationIntensity;
    }
  });

  // 클릭 핸들러 메모이제이션
  const handleClick = useCallback((event: any) => {
    // 이벤트 전파 중단
    event.stopPropagation();

    alert(`클릭됨! ${service.title}`);
    console.log('📦 Box clicked:', service.title, service.href);
    if (service.href !== '#') {
      console.log('✅ Calling onServiceClick:', service.href);
      onServiceClick(service.href);
    } else {
      console.log('⏭️ Skipping navigation (href is #)');
    }
  }, [service.href, service.title, onServiceClick]);

  // Scaled dimensions - 박스 크기 제한 (최대 300px 정도) - 메모이제이션
  const { boxWidth, boxHeight, boxDepth } = useMemo(() => {
    const baseWidth = isMobile ? 3.5 : 3.5;
    const constrainedBaseWidth = Math.min(baseWidth, 4); // 최대 4로 제한
    return {
      boxWidth: constrainedBaseWidth * scale,
      boxHeight: 2.5 * scale,
      boxDepth: 0.6 * scale,
    };
  }, [isMobile, scale]);

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = service.href !== '#' ? 'pointer' : 'default';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <RoundedBox args={[boxWidth, boxHeight, boxDepth]} radius={0.15 * scale} smoothness={4}>
          <MeshDistortMaterial
            color={service.color}
            envMapIntensity={0.5}
            clearcoat={1}
            clearcoatRoughness={0}
            metalness={0.1}
            roughness={0.3}
            distort={hovered ? 0.2 : 0.1}
            speed={hovered ? 4 : 2}
          />
        </RoundedBox>

        {/* Glow effect when hovered - z를 충분히 뒤로 이동하여 텍스트 가리지 않도록 */}
        {hovered && (
          <mesh scale={[1.1, 1.1, 1.1]} position={[0, 0, -0.5 * scale]}>
            <RoundedBox args={[boxWidth, boxHeight, boxDepth]} radius={0.15 * scale} smoothness={4}>
              <meshBasicMaterial
                color={service.color}
                transparent
                opacity={0.3}
                side={THREE.BackSide}
                depthWrite={false}
              />
            </RoundedBox>
          </mesh>
        )}
      </mesh>

      {/* Emoji - 텍스트를 더 앞으로 이동 (z: 0.35) */}
      <Text
        position={[0, 0.4 * scale, 0.35 * scale]}
        fontSize={isMobile ? 0.8 * scale : 0.6 * scale}
        anchorX="center"
        anchorY="middle"
        renderOrder={10}
      >
        {service.emoji}
      </Text>

      {/* Title - 텍스트를 더 앞으로 이동 */}
      <Text
        position={[0, -0.2 * scale, 0.35 * scale]}
        fontSize={isMobile ? 0.4 * scale : 0.3 * scale}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02 * scale}
        outlineColor="#000000"
        renderOrder={10}
      >
        {service.title}
      </Text>

      {/* Description - 텍스트를 더 앞으로 이동 */}
      <Text
        position={[0, -0.65 * scale, 0.35 * scale]}
        fontSize={isMobile ? 0.22 * scale : 0.16 * scale}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        renderOrder={10}
      >
        {service.description}
      </Text>
    </group>
  );
}

// React.memo로 ServiceBox 컴포넌트 메모이제이션
const ServiceBox = memo(ServiceBoxComponent);

interface FloatingServiceBoxesProps {
  onServiceClick: (href: string) => void;
}

function FloatingServiceBoxes({ onServiceClick }: FloatingServiceBoxesProps) {
  // Hydration mismatch 방지를 위한 마운트 상태
  const [isMounted, setIsMounted] = useState(false);

  // 반응형 레이아웃을 위한 state - SSR과 동일한 초기값으로 시작
  const [layoutConfig, setLayoutConfig] = useState(() => ({
    isMobile: false,
    positions: [
      [-4, 2, 0],
      [4, 2, 0],
      [-4, -2.5, 0],
      [4, -2.5, 0],
    ] as [number, number, number][],
    scale: 1.3,
  }));

  // 클라이언트 사이드에서만 실제 레이아웃 설정 적용
  useEffect(() => {
    setIsMounted(true);
    setLayoutConfig(getLayoutConfig());

    const handleResize = () => {
      setLayoutConfig(getLayoutConfig());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <group>
      {services.map((service, index) => (
        <ServiceBox
          key={index}
          service={service}
          position={layoutConfig.positions[index]}
          scale={layoutConfig.scale}
          onServiceClick={onServiceClick}
          isMobile={layoutConfig.isMobile}
          index={index}
        />
      ))}
    </group>
  );
}

export default memo(FloatingServiceBoxes);
