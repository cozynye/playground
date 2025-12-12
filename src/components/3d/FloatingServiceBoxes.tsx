'use client';

import React, { useRef, useState, useMemo, memo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 초기 렌더링 시 한 번만 계산
function getLayoutConfig() {
  if (typeof window === 'undefined') {
    return {
      isSmallMobile: false,
      positions: [
        [-3.5, 1.5, 0],
        [3.5, 1.5, 0],
        [-3.5, -2, 0],
        [3.5, -2, 0],
      ] as [number, number, number][],
      scale: 1,
    };
  }

  const width = window.innerWidth;
  const smallMobile = width < 400;
  const isMobile = width >= 400 && width < 768;
  const isTablet = width >= 768 && width < 1024;

  if (smallMobile) {
    const scale = 0.55;
    const yGap = 1.6;
    const startY = 2.5;
    return {
      isSmallMobile: true,
      positions: [
        [0, startY, 0],
        [0, startY - yGap, 0],
        [0, startY - yGap * 2, 0],
        [0, startY - yGap * 3, 0],
      ] as [number, number, number][],
      scale,
    };
  } else if (isMobile) {
    const scale = 0.6;
    const xSpread = 1.8;
    const ySpread = 1.8;
    return {
      isSmallMobile: false,
      positions: [
        [-xSpread, ySpread * 0.5, 0],
        [xSpread, ySpread * 0.5, 0],
        [-xSpread, -ySpread * 0.7, 0],
        [xSpread, -ySpread * 0.7, 0],
      ] as [number, number, number][],
      scale,
    };
  } else if (isTablet) {
    const scale = 0.8;
    const xSpread = 2.5;
    const ySpread = 2;
    return {
      isSmallMobile: false,
      positions: [
        [-xSpread, ySpread * 0.6, 0],
        [xSpread, ySpread * 0.6, 0],
        [-xSpread, -ySpread * 0.6, 0],
        [xSpread, -ySpread * 0.6, 0],
      ] as [number, number, number][],
      scale,
    };
  }

  return {
    isSmallMobile: false,
    positions: [
      [-3.5, 1.5, 0],
      [3.5, 1.5, 0],
      [-3.5, -2, 0],
      [3.5, -2, 0],
    ] as [number, number, number][],
    scale: 1,
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
    color: '#f59e0b',
  },
  {
    title: 'Weather',
    description: '실시간 날씨',
    href: '/weather',
    emoji: '🌤️',
    color: '#06b6d4',
  },
  {
    title: 'Coming Soon',
    description: '새로운 서비스',
    href: '#',
    emoji: '✨',
    color: '#8b5cf6',
  },
  {
    title: 'Coming Soon',
    description: '새로운 서비스',
    href: '#',
    emoji: '🎮',
    color: '#ec4899',
  },
];

interface ServiceBoxProps {
  service: Service;
  position: [number, number, number];
  scale: number;
  onServiceClick: (href: string) => void;
  isSmallMobile?: boolean;
}

function ServiceBox({ service, position, scale, onServiceClick, isSmallMobile = false }: ServiceBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Hover animation - sm 이하에서는 더 미묘하게
      const targetScale = hovered ? (isSmallMobile ? 1.08 : 1.15) : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Rotation animation - sm 이하에서는 최소화
      const rotationIntensity = isSmallMobile ? 0.3 : 1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1 * rotationIntensity;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3 + position[1]) * 0.05 * rotationIntensity;
    }
  });

  const handleClick = () => {
    if (service.href !== '#') {
      onServiceClick(service.href);
    }
  };

  // Scaled dimensions
  const boxWidth = 2.8 * scale;
  const boxHeight = 2 * scale;
  const boxDepth = 0.5 * scale;

  // sm 이하에서는 Float 애니메이션 최소화
  const floatSpeed = isSmallMobile ? 1.2 : 2;
  const floatRotationIntensity = isSmallMobile ? 0.05 : 0.2;
  const floatIntensity = isSmallMobile ? 0.4 : 1;
  const floatRange: [number, number] = isSmallMobile ? [-0.05, 0.05] : [-0.15, 0.15];

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={floatRotationIntensity}
      floatIntensity={floatIntensity}
      floatingRange={floatRange}
    >
      <group position={position}>
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

          {/* Glow effect when hovered - z를 뒤로 이동하여 텍스트 가리지 않도록 */}
          {hovered && (
            <mesh scale={[1.1, 1.1, 1.1]} position={[0, 0, -0.1 * scale]}>
              <RoundedBox args={[boxWidth, boxHeight, boxDepth]} radius={0.15 * scale} smoothness={4}>
                <meshBasicMaterial
                  color={service.color}
                  transparent
                  opacity={0.3}
                  side={THREE.BackSide}
                />
              </RoundedBox>
            </mesh>
          )}
        </mesh>

        {/* Emoji - 텍스트를 더 앞으로 이동 (z: 0.35) */}
        <Text
          position={[0, 0.3 * scale, 0.35 * scale]}
          fontSize={0.5 * scale}
          anchorX="center"
          anchorY="middle"
          renderOrder={10}
        >
          {service.emoji}
        </Text>

        {/* Title - 텍스트를 더 앞으로 이동 */}
        <Text
          position={[0, -0.2 * scale, 0.35 * scale]}
          fontSize={0.25 * scale}
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
          position={[0, -0.55 * scale, 0.35 * scale]}
          fontSize={0.12 * scale}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          renderOrder={10}
        >
          {service.description}
        </Text>

      </group>
    </Float>
  );
}

interface FloatingServiceBoxesProps {
  onServiceClick: (href: string) => void;
}

function FloatingServiceBoxes({ onServiceClick }: FloatingServiceBoxesProps) {
  // useMemo로 한 번만 계산 (리렌더링 방지)
  const layoutConfig = useMemo(() => getLayoutConfig(), []);

  return (
    <group>
      {services.map((service, index) => (
        <ServiceBox
          key={index}
          service={service}
          position={layoutConfig.positions[index]}
          scale={layoutConfig.scale}
          onServiceClick={onServiceClick}
          isSmallMobile={layoutConfig.isSmallMobile}
        />
      ))}
    </group>
  );
}

export default memo(FloatingServiceBoxes);
