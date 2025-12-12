'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  WeatherCard,
  WeatherCardSkeleton,
  LocationButton,
  HourlyForecastList,
  CitySelector,
  WeatherAnimation,
} from '@/features/weather/components';
import type { WeatherData, HourlyForecast } from '@/features/weather/types';

type LocationPermission = 'pending' | 'granted' | 'denied' | 'unavailable' | 'timeout';

export default function WeatherPage() {
  // 위치 권한 상태
  const [locationPermission, setLocationPermission] = useState<LocationPermission>('pending');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  // 내 위치 날씨
  const [myWeather, setMyWeather] = useState<WeatherData | null>(null);
  const [myWeatherLoading, setMyWeatherLoading] = useState(false);
  const [myWeatherError, setMyWeatherError] = useState<string | null>(null);

  // 시간별 예보
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyForecast[]>([]);
  const [hourlyLoading, setHourlyLoading] = useState(false);

  // 선택된 도시 날씨 (기본값: 서울)
  const [selectedCity, setSelectedCity] = useState<string | null>('서울');
  const [cityWeather, setCityWeather] = useState<WeatherData | null>(null);
  const [cityLoading, setCityLoading] = useState(false);

  // 도시별 시간별 예보
  const [cityHourlyForecasts, setCityHourlyForecasts] = useState<HourlyForecast[]>([]);
  const [cityHourlyLoading, setCityHourlyLoading] = useState(false);

  // 페이지 로드 시 서울 날씨 먼저 가져오기 (위치 권한 대기 중에도 표시)
  useEffect(() => {
    const fetchSeoulWeather = async () => {
      setCityLoading(true);
      setCityHourlyLoading(true);

      try {
        const [weatherRes, hourlyRes] = await Promise.all([
          fetch('/api/weather?city=서울'),
          fetch('/api/weather/hourly?city=서울'),
        ]);

        const weatherData = await weatherRes.json();
        const hourlyData = await hourlyRes.json();

        if (weatherRes.ok) {
          setCityWeather(weatherData);
        }
        if (hourlyRes.ok && hourlyData.forecasts) {
          setCityHourlyForecasts(hourlyData.forecasts);
        }
      } catch (err) {
        console.error('Seoul weather error:', err);
      } finally {
        setCityLoading(false);
        setCityHourlyLoading(false);
      }
    };

    fetchSeoulWeather();
  }, []);

  // 위치 에러 처리 함수
  const handleGeolocationError = useCallback((error: GeolocationPositionError) => {
    console.error('Geolocation error:', error);

    switch (error.code) {
      case error.PERMISSION_DENIED:
        setLocationPermission('denied');
        setLocationError('위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.');
        break;
      case error.POSITION_UNAVAILABLE:
        setLocationPermission('unavailable');
        setLocationError('위치 정보를 가져올 수 없습니다. GPS 신호를 확인해주세요.');
        break;
      case error.TIMEOUT:
        setLocationPermission('timeout');
        setLocationError('위치 정보를 가져오는데 시간이 초과되었습니다. 다시 시도해주세요.');
        break;
      default:
        setLocationPermission('unavailable');
        setLocationError('위치 정보를 가져올 수 없습니다.');
    }
  }, []);

  // 페이지 진입 시 자동으로 위치 권한 요청
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationPermission('unavailable');
      setLocationError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }

    // 위치 권한 요청
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermission('granted');
        setLocationError('');
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      handleGeolocationError,
      {
        enableHighAccuracy: true,
        timeout: 15000, // 15초로 증가
        maximumAge: 300000, // 5분 캐시
      }
    );
  }, [handleGeolocationError]);

  // 내 위치 날씨 가져오기
  useEffect(() => {
    if (!coords) return;

    const fetchMyWeather = async () => {
      setMyWeatherLoading(true);
      setMyWeatherError(null);

      try {
        const res = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || '날씨 정보를 가져오는데 실패했습니다.');
        }

        setMyWeather(data);
      } catch (err) {
        setMyWeatherError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        setMyWeatherLoading(false);
      }
    };

    fetchMyWeather();
  }, [coords]);

  // 시간별 예보 가져오기
  useEffect(() => {
    if (!coords) return;

    const fetchHourlyForecast = async () => {
      setHourlyLoading(true);

      try {
        const res = await fetch(`/api/weather/hourly?lat=${coords.lat}&lon=${coords.lon}`);
        const data = await res.json();

        if (res.ok && data.forecasts) {
          setHourlyForecasts(data.forecasts);
        }
      } catch (err) {
        console.error('Hourly forecast error:', err);
      } finally {
        setHourlyLoading(false);
      }
    };

    fetchHourlyForecast();
  }, [coords]);

  // 도시 선택 시 날씨 가져오기
  const handleCitySelect = useCallback(async (city: string) => {
    setSelectedCity(city);
    setCityLoading(true);
    setCityHourlyLoading(true);
    setCityWeather(null);
    setCityHourlyForecasts([]);

    try {
      // 날씨와 시간별 예보 동시에 가져오기
      const [weatherRes, hourlyRes] = await Promise.all([
        fetch(`/api/weather?city=${encodeURIComponent(city)}`),
        fetch(`/api/weather/hourly?city=${encodeURIComponent(city)}`),
      ]);

      const weatherData = await weatherRes.json();
      const hourlyData = await hourlyRes.json();

      if (weatherRes.ok) {
        setCityWeather(weatherData);
      }

      if (hourlyRes.ok && hourlyData.forecasts) {
        setCityHourlyForecasts(hourlyData.forecasts);
      }
    } catch (err) {
      console.error('City weather error:', err);
    } finally {
      setCityLoading(false);
      setCityHourlyLoading(false);
    }
  }, []);

  // 현재 표시중인 날씨 (애니메이션용)
  const currentWeather = useMemo(() => {
    // 도시 선택된 경우 도시 날씨 우선
    if (cityWeather) return cityWeather;
    // 내 위치 날씨
    if (myWeather) return myWeather;
    return null;
  }, [cityWeather, myWeather]);

  // body 배경색을 날씨에 맞게 설정 (푸터 아래 배경 노출 방지)
  useEffect(() => {
    // 기본 하늘색 배경 적용
    document.body.style.background = 'linear-gradient(to bottom, #7dd3fc, #3b82f6)';
    return () => {
      // 페이지 떠날 때 원래 배경으로 복원
      document.body.style.background = '';
    };
  }, []);

  // 위치 재요청
  const handleRetryLocation = useCallback(() => {
    setLocationPermission('pending');
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationPermission('unavailable');
      setLocationError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermission('granted');
        setLocationError('');
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      handleGeolocationError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0, // 재시도 시에는 캐시 사용 안함
      }
    );
  }, [handleGeolocationError]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* 날씨 배경 애니메이션 */}
      <WeatherAnimation
        weatherDescription={currentWeather?.description}
        icon={currentWeather?.icon}
      />

      {/* 헤더 */}
      <header className="bg-white/80 shadow-sm backdrop-blur-sm">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-gray-800 transition-colors hover:text-blue-600"
          >
            🌤️ 날씨
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            홈으로
          </Link>
        </nav>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        {/* 타이틀 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">오늘의 날씨</h1>
          <p className="mt-2 text-gray-600">전국 주요 도시의 실시간 날씨를 확인하세요</p>
        </div>

        {/* 내 위치 섹션 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-700 sm:mb-4 sm:text-xl">📍 내 위치</h2>

          {/* 내 위치 날씨 표시 - 권한 허락 시 실제 위치, 아니면 서울 */}
          {locationPermission === 'granted' ? (
            // 위치 권한 허락됨 - 실제 내 위치 날씨
            <>
              {myWeatherLoading && <WeatherCardSkeleton />}
              {myWeatherError && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:p-4">
                  {myWeatherError}
                </div>
              )}
              {myWeather && (
                <div>
                  <WeatherCard weather={myWeather} isMyLocation />
                  {/* 시간별 예보 */}
                  {hourlyLoading ? (
                    <div className="mt-3 animate-pulse rounded-xl bg-white/30 p-3 sm:mt-4 sm:p-4">
                      <p className="text-center text-sm text-gray-500">시간별 예보 로딩 중...</p>
                    </div>
                  ) : hourlyForecasts.length > 0 ? (
                    <div className="mt-3 rounded-xl bg-gradient-to-br from-blue-500/80 to-purple-600/80 p-3 sm:mt-4 sm:p-4">
                      <h3 className="mb-2 text-xs font-medium text-white/80 sm:text-sm">⏰ 시간별 예보 (24시간)</h3>
                      <HourlyForecastList forecasts={hourlyForecasts} />
                    </div>
                  ) : null}
                </div>
              )}
            </>
          ) : (
            // 위치 권한 대기/거부/불가 - 서울 날씨 표시
            <>
              {/* 위치 권한 상태 안내 */}
              {locationPermission === 'pending' && (
                <div className="mb-3 rounded-lg bg-blue-50/80 px-3 py-2 text-center text-xs text-blue-600 sm:mb-4 sm:px-4 sm:text-sm">
                  📍 위치 권한을 확인 중입니다... (기본 서울 날씨 표시)
                </div>
              )}
              {locationPermission === 'denied' && (
                <div className="mb-3 flex flex-col items-center gap-2 rounded-lg bg-yellow-50/80 px-3 py-2 sm:mb-4 sm:flex-row sm:justify-between sm:px-4">
                  <p className="text-center text-xs text-gray-700 sm:text-left sm:text-sm">
                    ⚠️ {locationError}
                  </p>
                  <div className="flex-shrink-0">
                    <LocationButton onClick={handleRetryLocation} loading={false} />
                  </div>
                </div>
              )}
              {locationPermission === 'unavailable' && (
                <div className="mb-3 flex flex-col items-center gap-2 rounded-lg bg-gray-100/80 px-3 py-2 sm:mb-4 sm:flex-row sm:justify-between sm:px-4">
                  <p className="text-center text-xs text-gray-600 sm:text-left sm:text-sm">
                    📍 {locationError || '위치 서비스를 사용할 수 없어 서울 날씨를 표시합니다.'}
                  </p>
                  <div className="flex-shrink-0">
                    <LocationButton onClick={handleRetryLocation} loading={false} />
                  </div>
                </div>
              )}
              {locationPermission === 'timeout' && (
                <div className="mb-3 flex flex-col items-center gap-2 rounded-lg bg-orange-50/80 px-3 py-2 sm:mb-4 sm:flex-row sm:justify-between sm:px-4">
                  <p className="text-center text-xs text-orange-700 sm:text-left sm:text-sm">
                    ⏱️ {locationError}
                  </p>
                  <div className="flex-shrink-0">
                    <LocationButton onClick={handleRetryLocation} loading={false} />
                  </div>
                </div>
              )}

              {/* 서울 날씨 표시 (cityWeather 재사용) */}
              {cityLoading && <WeatherCardSkeleton />}
              {cityWeather && (
                <div>
                  <WeatherCard weather={cityWeather} />
                  {/* 서울 시간별 예보 */}
                  {cityHourlyLoading ? (
                    <div className="mt-3 animate-pulse rounded-xl bg-white/30 p-3 sm:mt-4 sm:p-4">
                      <p className="text-center text-sm text-gray-500">시간별 예보 로딩 중...</p>
                    </div>
                  ) : cityHourlyForecasts.length > 0 ? (
                    <div className="mt-3 rounded-xl bg-gradient-to-br from-blue-500/80 to-purple-600/80 p-3 sm:mt-4 sm:p-4">
                      <h3 className="mb-2 text-xs font-medium text-white/80 sm:text-sm">⏰ 서울 시간별 예보 (24시간)</h3>
                      <HourlyForecastList forecasts={cityHourlyForecasts} />
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </section>

        {/* 도시 선택 섹션 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-700 sm:mb-4 sm:text-xl">🏙️ 도시별 날씨</h2>
          <CitySelector selectedCity={selectedCity} onCitySelect={handleCitySelect} />

          {/* 선택된 도시 날씨 */}
          {selectedCity && (
            <div className="mt-4 sm:mt-6">
              {cityLoading && <WeatherCardSkeleton />}
              {cityWeather && (
                <div>
                  <WeatherCard weather={cityWeather} />
                  {/* 도시별 시간별 예보 */}
                  {cityHourlyLoading ? (
                    <div className="mt-3 animate-pulse rounded-xl bg-white/30 p-3 sm:mt-4 sm:p-4">
                      <p className="text-center text-sm text-gray-500">시간별 예보 로딩 중...</p>
                    </div>
                  ) : cityHourlyForecasts.length > 0 ? (
                    <div className="mt-3 rounded-xl bg-gradient-to-br from-blue-500/80 to-purple-600/80 p-3 sm:mt-4 sm:p-4">
                      <h3 className="mb-2 text-xs font-medium text-white/80 sm:text-sm">⏰ {selectedCity} 시간별 예보 (24시간)</h3>
                      <HourlyForecastList forecasts={cityHourlyForecasts} />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </section>

        {/* 안내 문구 */}
        <div className="mt-8 rounded-xl bg-white/50 p-4 text-center backdrop-blur-sm sm:mt-12 sm:p-6">
          <p className="text-xs text-gray-600 sm:text-sm">
            💡 도시 버튼을 클릭하면 해당 지역의 날씨를 확인할 수 있습니다.
            <br />
            서울 지역은 25개 구별 상세 날씨를 제공합니다.
          </p>
        </div>
      </main>

      {/* 푸터 - flex-col 구조에서 mt-auto로 하단 고정 */}
      <footer className="mt-auto border-t border-gray-200 bg-white/80 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-center text-xs text-gray-500">
            날씨 정보 제공: 기상청 단기예보 API (data.go.kr)
          </p>
          <p className="mt-1 text-center text-xs text-gray-400">
            &copy; 2024 Cozy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
