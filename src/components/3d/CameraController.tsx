'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 초기 렌더링 시 한 번만 계산
function getCameraConfig() {
  if (typeof window === 'undefined') {
    return { isSmallMobile: false, isMobile: false, initialZ: 12 };
  }
  const width = window.innerWidth;
  const isSmallMobile = width < 400;
  const isMobile = width < 768;

  let initialZ = 12;
  if (isSmallMobile) {
    initialZ = 18;
  } else if (isMobile) {
    initialZ = 16;
  } else if (width < 1024) {
    initialZ = 14;
  }

  return { isSmallMobile, isMobile, initialZ };
}

export default function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // useMemo로 한 번만 계산 (리렌더링 방지)
  const { isSmallMobile, isMobile, initialZ } = useMemo(() => getCameraConfig(), []);

  const targetPosition = useRef(new THREE.Vector3(0, 0, initialZ));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouse.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    };

    // Device orientation for mobile tilt effect
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        // gamma is left-right tilt (-90 to 90)
        // beta is front-back tilt (-180 to 180)
        mouse.current.x = (event.gamma / 45) * 0.5; // Normalize and reduce sensitivity
        mouse.current.y = ((event.beta - 45) / 45) * 0.3; // Offset for natural holding position
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Request device orientation permission on iOS
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      // iOS 13+ requires permission
      (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // Non-iOS devices
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  useFrame((state) => {
    // Reduce camera movement range on mobile
    // sm 이하에서는 카메라 움직임 거의 없음 (0.2)
    const movementScale = isSmallMobile ? 0.2 : (isMobile ? 0.5 : 1);

    // Smooth camera movement following mouse/touch/tilt
    const targetX = mouse.current.x * 2 * movementScale;
    const targetY = mouse.current.y * 1.5 * movementScale;

    // sm 이하에서는 lerp도 더 부드럽게
    const lerpSpeed = isSmallMobile ? 0.01 : 0.02;

    targetPosition.current.x = THREE.MathUtils.lerp(
      targetPosition.current.x,
      targetX,
      lerpSpeed
    );
    targetPosition.current.y = THREE.MathUtils.lerp(
      targetPosition.current.y,
      targetY,
      lerpSpeed
    );

    // Add subtle breathing motion - sm 이하에서는 더 미묘하게
    const breatheIntensity = isSmallMobile ? 0.08 : 0.15;
    const breathe = Math.sin(state.clock.elapsedTime * 0.5) * breatheIntensity;
    targetPosition.current.z = initialZ + breathe;

    camera.position.copy(targetPosition.current);

    // Look at center with slight offset based on mouse
    // sm 이하에서는 시선 이동 최소화
    const lookAtScale = isSmallMobile ? 0.1 : 1;
    targetLookAt.current.x = mouse.current.x * 0.3 * movementScale * lookAtScale;
    targetLookAt.current.y = mouse.current.y * 0.2 * movementScale * lookAtScale;
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
