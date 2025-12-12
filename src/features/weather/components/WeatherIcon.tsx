'use client';

interface WeatherIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  description?: string;
}

// 날씨 아이콘 매핑 (OpenWeatherMap 아이콘 코드 → 이모지)
const iconMap: Record<string, string> = {
  '01d': '☀️', // clear sky day
  '01n': '🌙', // clear sky night
  '02d': '⛅', // few clouds day
  '02n': '☁️', // few clouds night
  '03d': '☁️', // scattered clouds
  '03n': '☁️',
  '04d': '☁️', // broken clouds
  '04n': '☁️',
  '09d': '🌧️', // shower rain
  '09n': '🌧️',
  '10d': '🌦️', // rain day
  '10n': '🌧️', // rain night
  '11d': '⛈️', // thunderstorm
  '11n': '⛈️',
  '13d': '❄️', // snow
  '13n': '❄️',
  '50d': '🌫️', // mist
  '50n': '🌫️',
};

const sizeClasses = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-7xl',
};

export function WeatherIcon({ icon, size = 'md', description }: WeatherIconProps) {
  const emoji = iconMap[icon] || '🌤️';

  return (
    <span className={sizeClasses[size]} role="img" aria-label={description || '날씨'}>
      {emoji}
    </span>
  );
}
