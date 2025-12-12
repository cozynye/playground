'use client';

import type { HourlyForecast } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  forecasts: HourlyForecast[];
}

export function HourlyForecastList({ forecasts }: HourlyForecastProps) {
  if (forecasts.length === 0) return null;

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex gap-3 pb-2">
        {forecasts.map((forecast, index) => (
          <div
            key={`${forecast.date}-${forecast.time}-${index}`}
            className="flex min-w-[70px] flex-col items-center rounded-xl bg-white/30 px-3 py-3 backdrop-blur-sm"
          >
            <span className="text-xs text-white/70">{forecast.date}</span>
            <span className="text-sm font-medium text-white">{forecast.time}</span>
            <WeatherIcon icon={forecast.icon} size="sm" description={forecast.description} />
            <span className="mt-1 text-lg font-bold text-white">{forecast.temperature}°</span>
            {forecast.pop > 0 && (
              <span className="mt-1 text-xs text-blue-200">💧{forecast.pop}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
