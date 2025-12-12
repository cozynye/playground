import { NextRequest, NextResponse } from 'next/server';
import type { KMAForecastResponse, HourlyForecast, HourlyForecastResponse } from '@/features/weather/types';
import { SKY_STATUS, PTY_STATUS } from '@/features/weather/types';
import { findNearestDistrict, isInSeoul } from '@/features/weather/data/locations';
import { latLonToGrid } from '@/features/weather/utils/gridConverter';

const API_KEY = process.env.KMA_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

/**
 * 기상청 API 요청을 위한 기준 시간 계산
 */
function getBaseDateTime(): { baseDate: string; baseTime: string } {
  const now = new Date();
  const kstOffset = 9 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + kstOffset * 60000);

  let year = kst.getFullYear();
  let month = kst.getMonth() + 1;
  let day = kst.getDate();
  let hour = kst.getHours();

  const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];

  let baseHour = baseTimes[0];
  for (let i = baseTimes.length - 1; i >= 0; i--) {
    if (hour >= baseTimes[i] + 0.17) {
      baseHour = baseTimes[i];
      break;
    }
  }

  if (hour < 2 || (hour === 2 && kst.getMinutes() < 10)) {
    const yesterday = new Date(kst);
    yesterday.setDate(yesterday.getDate() - 1);
    year = yesterday.getFullYear();
    month = yesterday.getMonth() + 1;
    day = yesterday.getDate();
    baseHour = 23;
  }

  const baseDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  const baseTime = `${String(baseHour).padStart(2, '0')}00`;

  return { baseDate, baseTime };
}

/**
 * 시간별 예보 데이터 추출 (24시간)
 */
function extractHourlyForecasts(items: KMAForecastResponse['response']['body']['items']['item']): HourlyForecast[] {
  const now = new Date();
  const kstOffset = 9 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + kstOffset * 60000);

  const currentHour = kst.getHours();
  const currentDate = `${kst.getFullYear()}${String(kst.getMonth() + 1).padStart(2, '0')}${String(kst.getDate()).padStart(2, '0')}`;

  // 시간별 데이터를 그룹화
  const hourlyData: Map<string, Record<string, string>> = new Map();

  for (const item of items) {
    const key = `${item.fcstDate}-${item.fcstTime}`;
    if (!hourlyData.has(key)) {
      hourlyData.set(key, {});
    }
    hourlyData.get(key)![item.category] = item.fcstValue;
  }

  // 현재 시간부터 24시간 예보 추출
  const forecasts: HourlyForecast[] = [];
  const sortedKeys = Array.from(hourlyData.keys()).sort();

  for (const key of sortedKeys) {
    if (forecasts.length >= 24) break;

    const [date, time] = key.split('-');
    const hour = parseInt(time.slice(0, 2));

    // 현재 시간 이후의 데이터만
    if (date < currentDate) continue;
    if (date === currentDate && hour < currentHour) continue;

    const data = hourlyData.get(key)!;
    const temp = parseFloat(data['TMP'] || '0');
    const sky = data['SKY'] || '1';
    const pty = data['PTY'] || '0';
    const pop = parseInt(data['POP'] || '0');

    let description = SKY_STATUS[sky]?.description || '맑음';
    let icon = SKY_STATUS[sky]?.icon || '01d';

    if (pty !== '0' && PTY_STATUS[pty]) {
      description = PTY_STATUS[pty].description;
      icon = PTY_STATUS[pty].icon;
    }

    // 밤 시간 아이콘 처리
    if (hour >= 18 || hour < 6) {
      icon = icon.replace('d', 'n');
    }

    const dateObj = new Date(
      parseInt(date.slice(0, 4)),
      parseInt(date.slice(4, 6)) - 1,
      parseInt(date.slice(6, 8))
    );

    forecasts.push({
      time: `${hour}시`,
      date: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
      temperature: Math.round(temp),
      description,
      icon,
      pop,
    });
  }

  return forecasts;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const city = searchParams.get('city');

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  let nx: number;
  let ny: number;
  let locationName = '현재 위치';
  let district: string | undefined;

  // 도시 이름으로 검색하는 경우
  if (city) {
    const { getCityCoordinates } = await import('@/features/weather/data/locations');
    const cityInfo = getCityCoordinates(city);
    if (!cityInfo) {
      return NextResponse.json(
        { error: `'${city}' 도시를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }
    nx = cityInfo.nx;
    ny = cityInfo.ny;
    locationName = cityInfo.name;
  } else if (lat && lon) {
    // 좌표로 검색하는 경우
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isInSeoul(latNum, lonNum)) {
      const nearestDistrict = findNearestDistrict(latNum, lonNum);
      if (nearestDistrict) {
        district = nearestDistrict.name;
        nx = nearestDistrict.nx;
        ny = nearestDistrict.ny;
        locationName = '서울';
      } else {
        const grid = latLonToGrid(latNum, lonNum);
        nx = grid.nx;
        ny = grid.ny;
      }
    } else {
      const grid = latLonToGrid(latNum, lonNum);
      nx = grid.nx;
      ny = grid.ny;
    }
  } else {
    return NextResponse.json(
      { error: '도시 이름(city) 또는 위도(lat)/경도(lon)가 필요합니다.' },
      { status: 400 }
    );
  }

  const { baseDate, baseTime } = getBaseDateTime();
  const url = `${BASE_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: '기상청 API 요청에 실패했습니다.' },
        { status: response.status }
      );
    }

    const data: KMAForecastResponse = await response.json();

    if (data.response.header.resultCode !== '00') {
      return NextResponse.json(
        { error: data.response.header.resultMsg || '날씨 정보를 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    const items = data.response.body.items.item;
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: '날씨 데이터가 없습니다.' },
        { status: 404 }
      );
    }

    const forecasts = extractHourlyForecasts(items);

    const result: HourlyForecastResponse = {
      location: locationName,
      district,
      forecasts,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Hourly Forecast API Error:', error);
    return NextResponse.json(
      { error: '시간별 예보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
