import { NextRequest, NextResponse } from 'next/server';
import type { KMAForecastResponse, KMAForecastItem, WeatherData } from '@/features/weather/types';
import { SKY_STATUS, PTY_STATUS } from '@/features/weather/types';
import { getCityCoordinates, findNearestDistrict, isInSeoul } from '@/features/weather/data/locations';
import { latLonToGrid } from '@/features/weather/utils/gridConverter';

const API_KEY = process.env.KMA_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
const USE_MOCK_DATA = process.env.USE_MOCK_WEATHER === 'true';

// Mock 날씨 데이터 생성 (개발용)
function getMockWeatherData(locationName: string, district?: string): WeatherData {
  // 현재 시간 기반 랜덤 데이터 생성
  const now = new Date();
  const hour = now.getHours();
  const isNight = hour < 6 || hour >= 20;

  // 도시별 기본 기온 설정
  const baseTemps: Record<string, number> = {
    '서울': 5, '부산': 10, '인천': 4, '대구': 8,
    '대전': 6, '광주': 9, '울산': 11, '세종': 5, '제주': 12,
    '현재 위치': 6
  };

  const baseTemp = baseTemps[locationName] ?? 7;
  const temp = baseTemp + Math.floor(Math.random() * 3) - 1;

  const skyConditions = [
    { sky: '1', description: '맑음', icon: isNight ? '01n' : '01d' },
    { sky: '3', description: '구름많음', icon: isNight ? '03n' : '03d' },
    { sky: '4', description: '흐림', icon: '04d' },
  ];

  const condition = skyConditions[Math.floor(Math.random() * skyConditions.length)];

  return {
    location: locationName,
    district,
    temperature: temp,
    feelsLike: temp - 2,
    tempMin: temp - 4,
    tempMax: temp + 3,
    humidity: 40 + Math.floor(Math.random() * 30),
    description: condition.description,
    icon: condition.icon,
    windSpeed: Math.round((1 + Math.random() * 4) * 10) / 10,
    precipitation: '강수없음',
    pop: Math.floor(Math.random() * 20),
    updatedAt: new Date().toLocaleString('ko-KR'),
  };
}

/**
 * 기상청 API 요청을 위한 기준 시간 계산
 * 단기예보는 02, 05, 08, 11, 14, 17, 20, 23시에 발표
 */
function getBaseDateTime(): { baseDate: string; baseTime: string } {
  const now = new Date();
  const kstOffset = 9 * 60; // KST는 UTC+9
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + kstOffset * 60000);

  let year = kst.getFullYear();
  let month = kst.getMonth() + 1;
  let day = kst.getDate();
  let hour = kst.getHours();

  // 발표 시간 배열 (02, 05, 08, 11, 14, 17, 20, 23)
  const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];

  // 현재 시간에서 가장 최근 발표 시간 찾기
  // API 제공 시간을 고려해 약 10분 여유를 둠
  let baseHour = baseTimes[0];
  for (let i = baseTimes.length - 1; i >= 0; i--) {
    if (hour >= baseTimes[i] + 0.17) {
      // 발표 후 약 10분
      baseHour = baseTimes[i];
      break;
    }
  }

  // 만약 현재 시간이 02시 이전이면 전날 23시 데이터 사용
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
 * 기상청 API 응답을 WeatherData로 변환
 */
function transformKMAData(
  items: KMAForecastItem[],
  locationName: string,
  district?: string
): WeatherData {
  // 현재 시간에 가장 가까운 예보 데이터 추출
  const now = new Date();
  const kstOffset = 9 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + kstOffset * 60000);

  const currentDate = `${kst.getFullYear()}${String(kst.getMonth() + 1).padStart(2, '0')}${String(kst.getDate()).padStart(2, '0')}`;
  const currentHour = String(kst.getHours()).padStart(2, '0') + '00';

  // 카테고리별 값 추출
  const dataMap: Record<string, string> = {};
  let minTemp = Infinity;
  let maxTemp = -Infinity;

  // 현재 시간과 가장 가까운 예보 데이터 찾기
  const targetItems = items.filter(
    (item) =>
      item.fcstDate === currentDate ||
      (item.fcstDate > currentDate && items.filter((i) => i.fcstDate === currentDate).length === 0)
  );

  // 시간별로 정렬하여 가장 가까운 시간 데이터 사용
  const sortedItems = targetItems.sort((a, b) => {
    const timeA = parseInt(a.fcstDate + a.fcstTime);
    const timeB = parseInt(b.fcstDate + b.fcstTime);
    const currentTime = parseInt(currentDate + currentHour);
    return Math.abs(timeA - currentTime) - Math.abs(timeB - currentTime);
  });

  // 가장 가까운 시간의 데이터만 사용
  const nearestTime = sortedItems[0]?.fcstTime;
  const nearestDate = sortedItems[0]?.fcstDate;

  for (const item of items) {
    // 현재 시간과 가장 가까운 예보값 사용
    if (item.fcstDate === nearestDate && item.fcstTime === nearestTime) {
      dataMap[item.category] = item.fcstValue;
    }

    // 오늘의 최저/최고 기온
    if (item.fcstDate === currentDate) {
      if (item.category === 'TMN') {
        minTemp = Math.min(minTemp, parseFloat(item.fcstValue));
      }
      if (item.category === 'TMX') {
        maxTemp = Math.max(maxTemp, parseFloat(item.fcstValue));
      }
    }
  }

  // 기본값 설정
  const temp = parseFloat(dataMap['TMP'] || '0');
  const humidity = parseInt(dataMap['REH'] || '0');
  const windSpeed = parseFloat(dataMap['WSD'] || '0');
  const sky = dataMap['SKY'] || '1';
  const pty = dataMap['PTY'] || '0';
  const pop = parseInt(dataMap['POP'] || '0');
  const pcp = dataMap['PCP'] || '강수없음';

  // 날씨 설명 및 아이콘 결정
  let description = SKY_STATUS[sky]?.description || '맑음';
  let icon = SKY_STATUS[sky]?.icon || '01d';

  // 강수가 있으면 강수 형태로 덮어쓰기
  if (pty !== '0' && PTY_STATUS[pty]) {
    description = PTY_STATUS[pty].description;
    icon = PTY_STATUS[pty].icon;
  }

  // 체감온도 계산 (간단한 풍속 기반 계산)
  const feelsLike = Math.round(
    temp - (windSpeed > 1.3 ? (windSpeed * 0.7) : 0)
  );

  return {
    location: locationName,
    district,
    temperature: Math.round(temp),
    feelsLike,
    tempMin: minTemp !== Infinity ? Math.round(minTemp) : Math.round(temp - 3),
    tempMax: maxTemp !== -Infinity ? Math.round(maxTemp) : Math.round(temp + 3),
    humidity,
    description,
    icon,
    windSpeed: Math.round(windSpeed * 10) / 10,
    precipitation: pcp,
    pop,
    updatedAt: new Date().toLocaleString('ko-KR'),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const city = searchParams.get('city');

  let locationName: string;
  let district: string | undefined;

  // 위치 정보 파싱
  if (lat && lon) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isInSeoul(latNum, lonNum)) {
      const nearestDistrict = findNearestDistrict(latNum, lonNum);
      if (nearestDistrict) {
        district = nearestDistrict.name;
        locationName = '서울';
      } else {
        locationName = '현재 위치';
      }
    } else {
      locationName = '현재 위치';
    }
  } else if (city) {
    const cityCoords = getCityCoordinates(city);
    if (cityCoords) {
      locationName = cityCoords.name;
    } else {
      return NextResponse.json(
        { error: `'${city}' 도시를 찾을 수 없습니다. 지원되는 도시: 서울, 부산, 인천, 대구, 대전, 광주, 울산, 세종, 제주` },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: '위치 정보가 필요합니다. lat/lon 또는 city 파라미터를 제공해주세요.' },
      { status: 400 }
    );
  }

  // Mock 데이터 사용 (API 키가 없거나 환경변수로 설정된 경우)
  if (USE_MOCK_DATA || !API_KEY) {
    console.log('[Weather API] Using mock data for:', locationName, district || '');
    const mockData = getMockWeatherData(locationName, district);
    return NextResponse.json(mockData);
  }

  let nx: number;
  let ny: number;

  if (lat && lon) {
    // 좌표 기반 요청
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    // 서울 범위 내면 구 정보 찾기
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
        locationName = '현재 위치';
      }
    } else {
      const grid = latLonToGrid(latNum, lonNum);
      nx = grid.nx;
      ny = grid.ny;
      locationName = '현재 위치';
    }
  } else if (city) {
    // 도시 이름 기반 요청
    const cityCoords = getCityCoordinates(city);
    if (cityCoords) {
      nx = cityCoords.nx;
      ny = cityCoords.ny;
      locationName = cityCoords.name;
    } else {
      return NextResponse.json(
        { error: `'${city}' 도시를 찾을 수 없습니다. 지원되는 도시: 서울, 부산, 인천, 대구, 대전, 광주, 울산, 세종, 제주` },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: '위치 정보가 필요합니다. lat/lon 또는 city 파라미터를 제공해주세요.' },
      { status: 400 }
    );
  }

  const { baseDate, baseTime } = getBaseDateTime();

  // 기상청 API는 이미 인코딩된 키를 사용하므로 직접 URL 구성
  const url = `${BASE_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 1800 }, // 30분 캐시
    });

    if (!response.ok) {
      console.error('KMA API HTTP Error:', response.status, response.statusText);
      return NextResponse.json(
        { error: '기상청 API 요청에 실패했습니다.' },
        { status: response.status }
      );
    }

    const data: KMAForecastResponse = await response.json();

    if (data.response.header.resultCode !== '00') {
      console.error('KMA API Error:', data.response.header.resultMsg);
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

    const weatherData = transformKMAData(items, locationName, district);

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { error: '날씨 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 개발용 Mock 데이터 엔드포인트
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city') || '서울';

  const mockData: WeatherData = {
    location: city,
    district: city === '서울' ? '강남구' : undefined,
    temperature: 5,
    feelsLike: 2,
    tempMin: -1,
    tempMax: 8,
    humidity: 45,
    description: '맑음',
    icon: '01d',
    windSpeed: 2.3,
    precipitation: '강수없음',
    pop: 10,
    updatedAt: new Date().toLocaleString('ko-KR'),
  };

  return NextResponse.json(mockData);
}
