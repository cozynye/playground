// 기상청 단기예보 API 응답 타입
export interface KMAForecastResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: KMAForecastItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

// 기상청 예보 항목
export interface KMAForecastItem {
  baseDate: string; // 발표일자 (예: 20241212)
  baseTime: string; // 발표시각 (예: 0500)
  category: string; // 자료구분코드
  fcstDate: string; // 예보일자
  fcstTime: string; // 예보시각
  fcstValue: string; // 예보값
  nx: number; // 격자 X
  ny: number; // 격자 Y
}

// 기상청 카테고리 코드
export type KMACategoryCode =
  | 'POP' // 강수확률 (%)
  | 'PTY' // 강수형태 (0:없음, 1:비, 2:비/눈, 3:눈, 4:소나기)
  | 'PCP' // 1시간 강수량 (mm)
  | 'REH' // 습도 (%)
  | 'SNO' // 1시간 신적설 (cm)
  | 'SKY' // 하늘상태 (1:맑음, 3:구름많음, 4:흐림)
  | 'TMP' // 1시간 기온 (℃)
  | 'TMN' // 일 최저기온 (℃)
  | 'TMX' // 일 최고기온 (℃)
  | 'UUU' // 풍속(동서) (m/s)
  | 'VVV' // 풍속(남북) (m/s)
  | 'WAV' // 파고 (M)
  | 'VEC' // 풍향 (deg)
  | 'WSD'; // 풍속 (m/s)

// 앱 내부에서 사용하는 날씨 데이터 타입
export interface WeatherData {
  location: string;
  district?: string; // 서울 구 이름
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  precipitation: string; // 강수량
  pop: number; // 강수확률
  updatedAt: string;
}

// 위치 정보 타입
export interface LocationInfo {
  lat: number;
  lon: number;
  name: string;
  district?: string;
}

// 서울 구 정보 타입
export interface SeoulDistrict {
  name: string;
  nameEn: string;
  lat: number;
  lon: number;
}

// API 요청 파라미터 타입
export interface WeatherRequestParams {
  lat?: number;
  lon?: number;
  city?: string;
}

// 시간별 예보 데이터
export interface HourlyForecast {
  time: string; // "14:00"
  date: string; // "12일"
  temperature: number;
  description: string;
  icon: string;
  pop: number; // 강수확률
}

// 시간별 예보 응답
export interface HourlyForecastResponse {
  location: string;
  district?: string;
  forecasts: HourlyForecast[];
}

// 하늘 상태 매핑
export const SKY_STATUS: Record<string, { description: string; icon: string }> = {
  '1': { description: '맑음', icon: '01d' },
  '3': { description: '구름많음', icon: '03d' },
  '4': { description: '흐림', icon: '04d' },
};

// 강수 형태 매핑
export const PTY_STATUS: Record<string, { description: string; icon: string }> = {
  '0': { description: '', icon: '' }, // 없음
  '1': { description: '비', icon: '10d' },
  '2': { description: '비/눈', icon: '13d' },
  '3': { description: '눈', icon: '13d' },
  '4': { description: '소나기', icon: '09d' },
};
