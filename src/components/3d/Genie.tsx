'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 초기 렌더링 시 한 번만 계산
function getGenieConfig() {
  if (typeof window === 'undefined') {
    return { isSmallMobile: false };
  }
  return { isSmallMobile: window.innerWidth < 400 };
}

export default function Genie() {
  const genieRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  // useMemo로 한 번만 계산 (리렌더링 방지)
  const { isSmallMobile } = useMemo(() => getGenieConfig(), []);

  useFrame((state) => {
    if (genieRef.current) {
      const time = state.clock.elapsedTime;

      // 8자 패턴 (리사주 곡선) - 규칙적이고 부드러운 움직임
      // sm 이하에서는 범위 축소
      const rangeX = isSmallMobile ? 1.2 : 3;
      const rangeY = isSmallMobile ? 0.8 : 1.5;
      const rangeZ = isSmallMobile ? 0.3 : 0.8;
      const speed = isSmallMobile ? 0.3 : 0.4;

      // 8자 형태 궤적 (Lissajous curve)
      const x = Math.sin(time * speed * 2) * rangeX;
      const y = Math.sin(time * speed) * rangeY + 2; // 중심 높이 2
      const z = Math.cos(time * speed) * rangeZ + 3; // 앞쪽에 위치

      genieRef.current.position.set(x, y, z);

      // 이동 방향을 향해 부드럽게 회전
      const nextX = Math.sin((time + 0.1) * speed * 2) * rangeX;
      const nextY = Math.sin((time + 0.1) * speed) * rangeY + 2;
      const nextZ = Math.cos((time + 0.1) * speed) * rangeZ + 3;

      const direction = new THREE.Vector3(nextX - x, nextY - y, nextZ - z).normalize();
      const lookAtPoint = new THREE.Vector3(x + direction.x, y + direction.y, z + direction.z);
      genieRef.current.lookAt(lookAtPoint);

      // 약간의 기울기 추가
      genieRef.current.rotation.z = Math.sin(time * speed * 2) * 0.15;
    }

    // 몸체 스쿼시 애니메이션
    if (bodyRef.current) {
      const squish = Math.sin(state.clock.elapsedTime * 3) * 0.08 + 1;
      bodyRef.current.scale.set(squish, 1 / squish, squish);
    }

    // 눈 깜빡임
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkCycle = Math.sin(state.clock.elapsedTime * 0.5) * 10 + state.clock.elapsedTime * 3;
      const blink = Math.sin(blinkCycle) > 0.95 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = blink;
      eyeRightRef.current.scale.y = blink;
    }
  });

  // sm 이하에서는 Float 애니메이션 최소화
  const floatSpeed = isSmallMobile ? 1 : 1.5;
  const floatRotationIntensity = isSmallMobile ? 0.05 : 0.15;
  const floatIntensity = isSmallMobile ? 0.1 : 0.2;
  const genieScale = isSmallMobile ? 0.6 : 1;

  return (
    <Float speed={floatSpeed} rotationIntensity={floatRotationIntensity} floatIntensity={floatIntensity}>
      <group ref={genieRef} position={[0, 2, 3]} scale={genieScale}>
        <Trail
          width={0.6}
          length={8}
          color={new THREE.Color('#8b5cf6')}
          attenuation={(t) => t * t}
        >
          {/* Genie Body - Ghost-like shape */}
          <group>
            {/* Main body */}
            <mesh ref={bodyRef}>
              <capsuleGeometry args={[0.25, 0.4, 16, 16]} />
              <meshPhysicalMaterial
                color="#8b5cf6"
                emissive="#4c1d95"
                emissiveIntensity={0.4}
                transparent
                opacity={0.85}
                roughness={0.2}
                metalness={0.1}
                clearcoat={1}
              />
            </mesh>

            {/* Head */}
            <mesh position={[0, 0.45, 0]}>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshPhysicalMaterial
                color="#a78bfa"
                emissive="#6d28d9"
                emissiveIntensity={0.4}
                transparent
                opacity={0.9}
                roughness={0.2}
                metalness={0.1}
              />
            </mesh>

            {/* Left Eye */}
            <mesh ref={eyeLeftRef} position={[-0.1, 0.5, 0.24]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.1, 0.5, 0.28]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="#1a1a2e" />
            </mesh>

            {/* Right Eye */}
            <mesh ref={eyeRightRef} position={[0.1, 0.5, 0.24]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.1, 0.5, 0.28]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="#1a1a2e" />
            </mesh>

            {/* Smile */}
            <mesh position={[0, 0.35, 0.26]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
              <meshBasicMaterial color="#1a1a2e" />
            </mesh>

            {/* Tail - wispy bottom */}
            <mesh position={[0, -0.4, 0]} rotation={[0.2, 0, 0]}>
              <coneGeometry args={[0.2, 0.5, 16]} />
              <meshPhysicalMaterial
                color="#8b5cf6"
                emissive="#4c1d95"
                emissiveIntensity={0.3}
                transparent
                opacity={0.5}
                roughness={0.3}
              />
            </mesh>

            {/* Hat */}
            <mesh position={[0, 0.75, 0]} rotation={[0.15, 0, 0.1]}>
              <coneGeometry args={[0.15, 0.35, 16]} />
              <meshPhysicalMaterial
                color="#f59e0b"
                emissive="#d97706"
                emissiveIntensity={0.4}
                metalness={0.3}
              />
            </mesh>

            {/* Hat pom pom */}
            <mesh position={[0, 0.95, 0.05]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color="#fbbf24" />
            </mesh>

            {/* Sparkles around genie */}
            <Sparkles
              count={isSmallMobile ? 10 : 20}
              scale={1.2}
              size={2}
              speed={0.5}
              color="#fbbf24"
            />
          </group>
        </Trail>
      </group>
    </Float>
  );
}
