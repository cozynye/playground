'use client';

import type { HourlyForecast } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  forecasts: HourlyForecast[];
}

export function HourlyForecastList({ forecasts }: HourlyForecastProps) {
  if (forecasts.length === 0) return null;

  return (
    <div className="mt-3 overflow-x-auto scrollbar-hide sm:mt-4" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="flex gap-2 pb-2 sm:gap-3">
        {forecasts.map((forecast, index) => (
          <div
            key={`${forecast.date}-${forecast.time}-${index}`}
            className="flex min-w-[60px] flex-col items-center rounded-xl bg-white/30 px-2 py-2 backdrop-blur-sm sm:min-w-[70px] sm:px-3 sm:py-3"
          >
            <span className="text-[10px] text-white/70 sm:text-xs">{forecast.date}</span>
            <span className="text-xs font-medium text-white sm:text-sm">{forecast.time}</span>
            <WeatherIcon icon={forecast.icon} size="sm" description={forecast.description} />
            <span className="mt-1 text-base font-bold text-white sm:text-lg">{forecast.temperature}°</span>
            {forecast.pop > 0 && (
              <span className="mt-1 text-[10px] text-blue-200 sm:text-xs">💧{forecast.pop}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
