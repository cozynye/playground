import type { SeoulDistrict, LocationInfo } from '../types';

// 서울 25개 구 좌표 데이터 (기상청 격자 좌표 포함)
export const SEOUL_DISTRICTS: (SeoulDistrict & { nx: number; ny: number })[] = [
  { name: '강남구', nameEn: 'Gangnam-gu', lat: 37.5172, lon: 127.0473, nx: 61, ny: 126 },
  { name: '강동구', nameEn: 'Gangdong-gu', lat: 37.5301, lon: 127.1238, nx: 62, ny: 126 },
  { name: '강북구', nameEn: 'Gangbuk-gu', lat: 37.6396, lon: 127.0257, nx: 61, ny: 128 },
  { name: '강서구', nameEn: 'Gangseo-gu', lat: 37.5509, lon: 126.8495, nx: 58, ny: 126 },
  { name: '관악구', nameEn: 'Gwanak-gu', lat: 37.4784, lon: 126.9516, nx: 59, ny: 125 },
  { name: '광진구', nameEn: 'Gwangjin-gu', lat: 37.5385, lon: 127.0823, nx: 62, ny: 126 },
  { name: '구로구', nameEn: 'Guro-gu', lat: 37.4954, lon: 126.8874, nx: 58, ny: 125 },
  { name: '금천구', nameEn: 'Geumcheon-gu', lat: 37.4519, lon: 126.9020, nx: 59, ny: 124 },
  { name: '노원구', nameEn: 'Nowon-gu', lat: 37.6542, lon: 127.0568, nx: 61, ny: 129 },
  { name: '도봉구', nameEn: 'Dobong-gu', lat: 37.6688, lon: 127.0471, nx: 61, ny: 129 },
  { name: '동대문구', nameEn: 'Dongdaemun-gu', lat: 37.5744, lon: 127.0396, nx: 61, ny: 127 },
  { name: '동작구', nameEn: 'Dongjak-gu', lat: 37.5124, lon: 126.9393, nx: 59, ny: 125 },
  { name: '마포구', nameEn: 'Mapo-gu', lat: 37.5663, lon: 126.9014, nx: 59, ny: 127 },
  { name: '서대문구', nameEn: 'Seodaemun-gu', lat: 37.5791, lon: 126.9368, nx: 59, ny: 127 },
  { name: '서초구', nameEn: 'Seocho-gu', lat: 37.4837, lon: 127.0324, nx: 61, ny: 125 },
  { name: '성동구', nameEn: 'Seongdong-gu', lat: 37.5633, lon: 127.0371, nx: 61, ny: 127 },
  { name: '성북구', nameEn: 'Seongbuk-gu', lat: 37.5894, lon: 127.0167, nx: 61, ny: 127 },
  { name: '송파구', nameEn: 'Songpa-gu', lat: 37.5145, lon: 127.1050, nx: 62, ny: 126 },
  { name: '양천구', nameEn: 'Yangcheon-gu', lat: 37.5270, lon: 126.8561, nx: 58, ny: 126 },
  { name: '영등포구', nameEn: 'Yeongdeungpo-gu', lat: 37.5264, lon: 126.8963, nx: 58, ny: 126 },
  { name: '용산구', nameEn: 'Yongsan-gu', lat: 37.5324, lon: 126.9906, nx: 60, ny: 126 },
  { name: '은평구', nameEn: 'Eunpyeong-gu', lat: 37.6027, lon: 126.9291, nx: 59, ny: 127 },
  { name: '종로구', nameEn: 'Jongno-gu', lat: 37.5735, lon: 126.9790, nx: 60, ny: 127 },
  { name: '중구', nameEn: 'Jung-gu', lat: 37.5641, lon: 126.9979, nx: 60, ny: 127 },
  { name: '중랑구', nameEn: 'Jungnang-gu', lat: 37.6065, lon: 127.0927, nx: 62, ny: 128 },
];

// 메인 도시 좌표 (기상청 격자 좌표 포함)
export const MAIN_CITIES: (LocationInfo & { nx: number; ny: number })[] = [
  { name: '서울', lat: 37.5665, lon: 126.9780, nx: 60, ny: 127 },
  { name: '부산', lat: 35.1796, lon: 129.0756, nx: 98, ny: 76 },
  { name: '인천', lat: 37.4563, lon: 126.7052, nx: 55, ny: 124 },
  { name: '대구', lat: 35.8714, lon: 128.6014, nx: 89, ny: 90 },
  { name: '대전', lat: 36.3504, lon: 127.3845, nx: 67, ny: 100 },
  { name: '광주', lat: 35.1595, lon: 126.8526, nx: 58, ny: 74 },
  { name: '울산', lat: 35.5384, lon: 129.3114, nx: 102, ny: 84 },
  { name: '세종', lat: 36.4800, lon: 127.2890, nx: 66, ny: 103 },
  { name: '제주', lat: 33.4996, lon: 126.5312, nx: 52, ny: 38 },
];

// 서울 경계 좌표 (대략적)
const SEOUL_BOUNDS = {
  minLat: 37.4133,
  maxLat: 37.7151,
  minLon: 126.7341,
  maxLon: 127.1834,
};

// 두 좌표 간 거리 계산 (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 좌표가 서울 범위 내인지 확인
export function isInSeoul(lat: number, lon: number): boolean {
  return (
    lat >= SEOUL_BOUNDS.minLat &&
    lat <= SEOUL_BOUNDS.maxLat &&
    lon >= SEOUL_BOUNDS.minLon &&
    lon <= SEOUL_BOUNDS.maxLon
  );
}

// 가장 가까운 서울 구 찾기
export function findNearestDistrict(lat: number, lon: number): (SeoulDistrict & { nx: number; ny: number }) | null {
  if (!isInSeoul(lat, lon)) {
    return null;
  }

  let nearest: (SeoulDistrict & { nx: number; ny: number }) | null = null;
  let minDistance = Infinity;

  for (const district of SEOUL_DISTRICTS) {
    const distance = calculateDistance(lat, lon, district.lat, district.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = district;
    }
  }

  return nearest;
}

// 도시 이름으로 좌표 찾기
export function getCityCoordinates(cityName: string): (LocationInfo & { nx: number; ny: number }) | null {
  const city = MAIN_CITIES.find(
    (c) => c.name === cityName || c.name.toLowerCase() === cityName.toLowerCase()
  );
  return city || null;
}
