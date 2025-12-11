/**
 * 월드컵 설정 타입 정의
 */

/** 월드컵 항목 (대결 아이템) */
export interface IWorldcupItem {
  id: string;
  name: string;
  imagePath: string;
  imageAlt?: string;
  description?: string;
}

/** 메타데이터 설정 (SEO/OG 태그용) */
export interface IWorldcupMetadata {
  title: string;
  description: string;
  ogImage: string;
  keywords?: string[];
}

/** 라운드 수 타입 (2의 거듭제곱) */
export type RoundCount = 8 | 16 | 32 | 64 | 128;

/** 월드컵 설정 */
export interface IWorldcupConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  roundCount: RoundCount;
  thumbnailImage?: string;
  items: IWorldcupItem[];
  isActive: boolean;
  createdAt: string;
  metadata: IWorldcupMetadata;
}

/** 월드컵 리스트용 요약 정보 */
export interface IWorldcupSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  roundCount: RoundCount;
  thumbnailImage?: string;
  metadata: IWorldcupMetadata;
}

/** 게임 상태 */
export type GamePhase = 'ready' | 'playing' | 'result';

/** 현재 라운드 정보 */
export interface IRoundInfo {
  currentRound: number;
  matchIndex: number;
  totalMatches: number;
}

/** 현재 매치 정보 */
export interface IMatch {
  left: IWorldcupItem;
  right: IWorldcupItem;
}

/** 게임 상태 */
export interface IGameState {
  phase: GamePhase;
  roundInfo: IRoundInfo | null;
  currentMatch: IMatch | null;
  winners: IWorldcupItem[];
  finalWinner: IWorldcupItem | null;
}
