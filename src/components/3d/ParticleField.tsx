'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 초기 렌더링 시 한 번만 계산
function getParticleConfig() {
  if (typeof window === 'undefined') {
    return { isSmallMobile: false, isMobile: false };
  }
  const width = window.innerWidth;
  return { isSmallMobile: width < 400, isMobile: width < 768 };
}

export default function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const orbitingRef = useRef<THREE.Points>(null);

  // useMemo로 한 번만 계산 (리렌더링 방지)
  const { isSmallMobile, isMobile } = useMemo(() => getParticleConfig(), []);

  // Background floating particles - 모바일에서 감소
  const particleCount = isSmallMobile ? 150 : (isMobile ? 250 : 500);
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color('#8b5cf6'), // Purple
      new THREE.Color('#06b6d4'), // Cyan
      new THREE.Color('#f59e0b'), // Amber
      new THREE.Color('#ec4899'), // Pink
      new THREE.Color('#10b981'), // Emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 8 + Math.random() * 15;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [particleCount]);

  // Orbiting particles - 모바일에서 감소
  const orbitParticleCount = isSmallMobile ? 30 : (isMobile ? 50 : 100);
  const orbitParticles = useMemo(() => {
    const positions = new Float32Array(orbitParticleCount * 3);
    const colors = new Float32Array(orbitParticleCount * 3);

    for (let i = 0; i < orbitParticleCount; i++) {
      const angle = (i / orbitParticleCount) * Math.PI * 2;
      const radius = 5 + Math.sin(angle * 3) * 0.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle * 2) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Rainbow colors
      const hue = i / orbitParticleCount;
      const color = new THREE.Color().setHSL(hue, 1, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [orbitParticleCount]);

  // Create geometry for background particles
  const backgroundGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
    return geometry;
  }, [particles]);

  // Create geometry for orbiting particles
  const orbitGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(orbitParticles.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(orbitParticles.colors, 3));
    return geometry;
  }, [orbitParticles]);

  useFrame((state) => {
    // Animate background particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }

    // Animate orbiting particles
    if (orbitingRef.current) {
      orbitingRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      orbitingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <>
      {/* Background particles */}
      <points ref={particlesRef} geometry={backgroundGeometry}>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Orbiting ring particles */}
      <points ref={orbitingRef} geometry={orbitGeometry}>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
