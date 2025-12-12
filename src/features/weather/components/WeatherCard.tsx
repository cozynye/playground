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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/80 to-purple-600/80 p-6 text-white shadow-xl backdrop-blur-sm">
      {/* 배경 장식 */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />

      {/* 내 위치 배지 */}
      {isMyLocation && (
        <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          📍 내 위치
        </span>
      )}

      {/* 위치 정보 */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold">{locationDisplay}</h3>
        <p className="mt-1 text-sm text-white/80">{weather.description}</p>
      </div>

      {/* 메인 날씨 정보 */}
      <div className="relative z-10 mt-4 flex items-center justify-between">
        <div>
          <p className="text-6xl font-bold">{weather.temperature}°</p>
          <p className="mt-1 text-sm text-white/70">
            체감 {weather.feelsLike}° | {weather.tempMin}° / {weather.tempMax}°
          </p>
        </div>
        <WeatherIcon icon={weather.icon} size="lg" description={weather.description} />
      </div>

      {/* 상세 정보 */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">💧</span>
          <div>
            <p className="text-white/60">습도</p>
            <p className="font-medium">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">💨</span>
          <div>
            <p className="text-white/60">바람</p>
            <p className="font-medium">{weather.windSpeed} m/s</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🌧️</span>
          <div>
            <p className="text-white/60">강수확률</p>
            <p className="font-medium">{weather.pop}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">☔</span>
          <div>
            <p className="text-white/60">강수량</p>
            <p className="font-medium">{weather.precipitation}</p>
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
