'use client';

const CITIES = [
  { name: '서울', emoji: '🏛️' },
  { name: '부산', emoji: '🌊' },
  { name: '인천', emoji: '✈️' },
  { name: '대구', emoji: '🍎' },
  { name: '대전', emoji: '🔬' },
  { name: '광주', emoji: '🎨' },
  { name: '울산', emoji: '🏭' },
  { name: '세종', emoji: '🏢' },
  { name: '제주', emoji: '🏝️' },
];

interface CitySelectorProps {
  selectedCity: string | null;
  onCitySelect: (city: string) => void;
}

export function CitySelector({ selectedCity, onCitySelect }: CitySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2">
      {CITIES.map((city) => (
        <button
          key={city.name}
          onClick={() => onCitySelect(city.name)}
          className={`rounded-full px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
            selectedCity === city.name
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
          }`}
        >
          {city.emoji} {city.name}
        </button>
      ))}
    </div>
  );
}
