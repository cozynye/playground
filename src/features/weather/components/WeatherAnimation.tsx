'use client';

import { useMemo } from 'react';

type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'default';

interface WeatherAnimationProps {
  weatherDescription?: string;
  icon?: string;
}

// 날씨 설명/아이콘으로 타입 판별
function getWeatherType(description?: string, icon?: string): WeatherType {
  const desc = description?.toLowerCase() || '';
  const iconCode = icon?.toLowerCase() || '';

  // 눈
  if (desc.includes('눈') || iconCode.includes('13')) {
    return 'snow';
  }
  // 비 (비, 소나기, 빗방울)
  if (desc.includes('비') || desc.includes('소나기') || iconCode.includes('09') || iconCode.includes('10')) {
    return 'rain';
  }
  // 구름 (구름많음, 흐림)
  if (desc.includes('구름') || desc.includes('흐림') || iconCode.includes('03') || iconCode.includes('04')) {
    return 'cloudy';
  }
  // 맑음
  if (desc.includes('맑음') || desc.includes('청명') || iconCode.includes('01') || iconCode.includes('02')) {
    return 'clear';
  }

  return 'default';
}

// 배경 그라데이션
const backgrounds: Record<WeatherType, string> = {
  clear: 'from-sky-300 via-blue-400 to-blue-500',
  cloudy: 'from-gray-300 via-gray-400 to-slate-500',
  rain: 'from-slate-400 via-gray-500 to-slate-600',
  snow: 'from-slate-200 via-blue-200 to-slate-300',
  default: 'from-sky-100 to-blue-200',
};

export function WeatherAnimation({ weatherDescription, icon }: WeatherAnimationProps) {
  const weatherType = useMemo(() => getWeatherType(weatherDescription, icon), [weatherDescription, icon]);

  // 파티클 개수
  const particleCount = useMemo(() => {
    if (weatherType === 'rain') return 50;
    if (weatherType === 'snow') return 40;
    return 0;
  }, [weatherType]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 min-h-[100dvh] overflow-hidden">
      {/* 배경 그라데이션 - 전체 화면 커버 */}
      <div
        className={`absolute inset-0 min-h-[100dvh] bg-gradient-to-b transition-colors duration-1000 ${backgrounds[weatherType]}`}
      />

      {/* 맑음 - 태양 */}
      {weatherType === 'clear' && (
        <div className="absolute right-10 top-20 md:right-20">
          <div className="relative">
            {/* 태양 광선 */}
            <div className="absolute -inset-8 animate-spin-slow">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-16 w-2 -translate-x-1/2 -translate-y-1/2 bg-yellow-300/50"
                  style={{ transform: `rotate(${i * 45}deg) translateY(-40px)` }}
                />
              ))}
            </div>
            {/* 태양 본체 */}
            <div className="h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg shadow-yellow-400/50" />
          </div>
        </div>
      )}

      {/* 구름 - 떠다니는 구름 */}
      {weatherType === 'cloudy' && (
        <>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-cloud"
              style={{
                top: `${10 + i * 15}%`,
                left: `${-20 + i * 5}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${20 + i * 5}s`,
              }}
            >
              <Cloud size={80 + i * 20} opacity={0.6 - i * 0.08} />
            </div>
          ))}
        </>
      )}

      {/* 비 - 빗방울 */}
      {weatherType === 'rain' && (
        <>
          {[...Array(particleCount)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            >
              <div className="h-4 w-0.5 rounded-full bg-blue-400/60" />
            </div>
          ))}
        </>
      )}

      {/* 눈 - 눈송이 */}
      {weatherType === 'snow' && (
        <>
          {[...Array(particleCount)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              <div
                className="rounded-full bg-white shadow-sm"
                style={{
                  width: `${4 + Math.random() * 6}px`,
                  height: `${4 + Math.random() * 6}px`,
                }}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// 구름 SVG 컴포넌트
function Cloud({ size = 100, opacity = 0.5 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      style={{ opacity }}
      className="fill-white"
    >
      <ellipse cx="25" cy="40" rx="20" ry="15" />
      <ellipse cx="50" cy="35" rx="25" ry="20" />
      <ellipse cx="75" cy="40" rx="20" ry="15" />
      <ellipse cx="40" cy="25" rx="18" ry="15" />
      <ellipse cx="60" cy="25" rx="18" ry="15" />
    </svg>
  );
}
