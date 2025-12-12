'use client';

export function WeatherCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-gradient-to-br from-gray-400/50 to-gray-500/50 p-6 text-white shadow-xl">
      {/* 위치 정보 */}
      <div className="h-6 w-24 rounded bg-white/20" />
      <div className="mt-2 h-4 w-16 rounded bg-white/10" />

      {/* 메인 날씨 정보 */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="h-16 w-28 rounded bg-white/20" />
          <div className="mt-2 h-4 w-36 rounded bg-white/10" />
        </div>
        <div className="h-20 w-20 rounded-full bg-white/20" />
      </div>

      {/* 상세 정보 */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-white/20" />
            <div>
              <div className="h-3 w-8 rounded bg-white/10" />
              <div className="mt-1 h-4 w-12 rounded bg-white/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
