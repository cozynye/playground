'use client';

import type { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCardProps {
  weather: WeatherData;
  isMyLocation?: boolean;
}

export function WeatherCard({ weather, isMyLocation = false }: WeatherCardProps) {
  const locationDisplay = weather.district
    ? `${weather.location} ${weather.district}`
    : weather.location;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/80 to-purple-600/80 p-4 text-white shadow-xl backdrop-blur-sm sm:p-6">
      {/* 배경 장식 */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 sm:h-40 sm:w-40" />
      <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/5 sm:h-32 sm:w-32" />

      {/* 내 위치 배지 */}
      {isMyLocation && (
        <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-1 text-[10px] font-medium backdrop-blur-sm sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
          📍 내 위치
        </span>
      )}

      {/* 위치 정보 */}
      <div className="relative z-10">
        <h3 className="text-lg font-bold sm:text-xl">{locationDisplay}</h3>
        <p className="mt-1 text-xs text-white/80 sm:text-sm">{weather.description}</p>
      </div>

      {/* 메인 날씨 정보 */}
      <div className="relative z-10 mt-3 flex items-center justify-between gap-2 sm:mt-4 sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-4xl font-bold sm:text-5xl lg:text-6xl">{weather.temperature}°</p>
          <p className="mt-1 text-xs text-white/70 sm:text-sm">
            체감 {weather.feelsLike}° | {weather.tempMin}° / {weather.tempMax}°
          </p>
        </div>
        <div className="flex-shrink-0">
          <WeatherIcon icon={weather.icon} size="lg" description={weather.description} />
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 border-t border-white/20 pt-3 text-xs sm:mt-6 sm:gap-4 sm:pt-4 sm:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-base sm:text-lg">💧</span>
          <div className="min-w-0">
            <p className="text-white/60 text-[10px] sm:text-xs">습도</p>
            <p className="font-medium truncate">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-base sm:text-lg">💨</span>
          <div className="min-w-0">
            <p className="text-white/60 text-[10px] sm:text-xs">바람</p>
            <p className="font-medium truncate">{weather.windSpeed} m/s</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-base sm:text-lg">🌧️</span>
          <div className="min-w-0">
            <p className="text-white/60 text-[10px] sm:text-xs">강수확률</p>
            <p className="font-medium truncate">{weather.pop}%</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-base sm:text-lg">☔</span>
          <div className="min-w-0">
            <p className="text-white/60 text-[10px] sm:text-xs">강수량</p>
            <p className="font-medium truncate">{weather.precipitation}</p>
          </div>
        </div>
      </div>

      {/* 업데이트 시간 */}
      <p className="relative z-10 mt-4 text-right text-xs text-white/50">
        업데이트: {weather.updatedAt}
      </p>
    </div>
  );
}
