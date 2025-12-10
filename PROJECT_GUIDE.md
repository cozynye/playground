# Playground 프로젝트 완전 가이드

이 문서는 프로젝트 구조와 사용된 기술들을 **1도 모르는 사람**도 이해할 수 있도록 상세히 설명합니다.

---

## 목차

1. [이 프로젝트가 뭔가요?](#1-이-프로젝트가-뭔가요)
2. [왜 이런 구조인가요?](#2-왜-이런-구조인가요)
3. [핵심 기술 설명](#3-핵심-기술-설명)
4. [폴더 구조 상세 설명](#4-폴더-구조-상세-설명)
5. [개발 서버 실행 방법](#5-개발-서버-실행-방법)
6. [@cozy/xxx는 뭔가요?](#6-cozyxxx는-뭔가요)
7. [새 서비스 추가하는 방법](#7-새-서비스-추가하는-방법)
8. [자주 쓰는 명령어 모음](#8-자주-쓰는-명령어-모음)
9. [Vercel 배포](#9-vercel-배포)

---

## 1. 이 프로젝트가 뭔가요?

### 한 줄 요약
**하나의 도메인에서 여러 개의 서비스를 경로(/)로 구분**해서 운영하기 위한 프로젝트입니다.

### 예시
```
playground.vercel.app/           → 메인 랜딩 페이지
playground.vercel.app/worldcup   → 이상형 월드컵 서비스
playground.vercel.app/weather    → 날씨 서비스 (나중에 추가)
playground.vercel.app/manage     → 관리자 페이지 (나중에 추가)
```

### 핵심 개념
- **하나의 앱(main)** 안에 여러 서비스가 **폴더(라우트)**로 구분됩니다
- 모든 서비스는 **같은 기술 스택**을 공유합니다
- **공유 컴포넌트(@cozy/ui)**를 사용해 일관된 디자인을 유지합니다

---

## 2. 왜 이런 구조인가요?

### 구조: 단일 앱 + 라우트 분리

```
apps/main/
├── app/
│   ├── page.tsx           # / (메인)
│   ├── worldcup/
│   │   └── page.tsx       # /worldcup
│   ├── weather/
│   │   └── page.tsx       # /weather (나중에 추가)
│   └── manage/
│       └── page.tsx       # /manage (나중에 추가)
```

### 장점

| 장점 | 설명 |
|------|------|
| 간단한 배포 | Vercel에 하나의 앱만 배포하면 끝 |
| 코드 공유 | 버튼, 카드 같은 UI를 한 번만 만들고 모든 페이지에서 사용 |
| 일관성 | ESLint, TypeScript 설정을 한 곳에서 관리 |
| 빌드 최적화 | Turborepo가 변경된 부분만 다시 빌드 (시간 절약) |

---

## 3. 핵심 기술 설명

### 3.1 pnpm이 뭔가요?

**pnpm = npm의 더 빠른 버전**

npm을 알고 계시죠? `npm install` 하면 패키지 설치하는 그것.

```bash
# 기존에 쓰던 방식
npm install

# pnpm 방식 (더 빠르고 디스크 절약)
pnpm install
```

#### npm vs pnpm 차이

| 비교 | npm | pnpm |
|------|-----|------|
| 속도 | 느림 | 빠름 (2~3배) |
| 디스크 | 프로젝트마다 중복 저장 | 공유해서 저장 |
| Monorepo 지원 | 약함 | 강력함 |

---

### 3.2 Turborepo(터보)가 뭔가요?

**Turborepo = Monorepo를 효율적으로 관리해주는 도구**

#### 캐싱이란?
한번 빌드한 결과를 저장해둡니다.
코드가 안 바뀌면 다시 빌드 안 하고 저장된 결과를 씁니다.
→ **빌드 시간 90% 이상 단축** 가능

---

### 3.3 Next.js가 뭔가요?

**Next.js = React로 웹사이트 만드는 프레임워크**

#### 파일 기반 라우팅
```
app/
├── page.tsx           → /
├── worldcup/
│   └── page.tsx       → /worldcup
└── weather/
    └── page.tsx       → /weather
```

파일만 만들면 자동으로 URL이 생깁니다!

---

## 4. 폴더 구조 상세 설명

```
playground/
├── apps/                    # 실제 웹 애플리케이션
│   └── main/               # 메인 앱 (모든 서비스 포함)
│       └── app/
│           ├── page.tsx        # / 메인 페이지
│           └── worldcup/
│               └── page.tsx    # /worldcup 페이지
│
├── packages/                # 공유 코드 (라이브러리)
│   ├── ui/                 # 공유 UI 컴포넌트
│   ├── config-eslint/      # ESLint 설정
│   ├── config-typescript/  # TypeScript 설정
│   └── config-tailwind/    # Tailwind CSS 설정
│
├── package.json             # 프로젝트 설정 파일
├── pnpm-workspace.yaml      # pnpm 워크스페이스 설정
├── turbo.json               # Turborepo 설정
└── vercel.json              # Vercel 배포 설정
```

### 4.1 apps/main/ - 메인 앱

```
apps/main/
├── app/
│   ├── layout.tsx      # 전체 레이아웃 (HTML, body 태그)
│   ├── page.tsx        # 메인 페이지 (/)
│   ├── globals.css     # 전역 스타일
│   └── worldcup/
│       └── page.tsx    # 월드컵 페이지 (/worldcup)
├── next.config.ts      # Next.js 설정
├── package.json        # 이 앱의 의존성
├── tailwind.config.ts  # Tailwind 설정
└── tsconfig.json       # TypeScript 설정
```

### 4.2 packages/ui/ - 공유 UI 컴포넌트

```
packages/ui/
├── src/
│   ├── index.ts        # 내보내기 모음
│   ├── button.tsx      # 버튼 컴포넌트
│   ├── card.tsx        # 카드 컴포넌트
│   └── layout.tsx      # 레이아웃 컴포넌트
├── package.json
└── tsconfig.json
```

**왜 공유하나요?**

버튼을 예로 들면:
- `/` 메인 페이지에서도 버튼이 필요
- `/worldcup` 페이지에서도 버튼이 필요
- `/weather` 페이지에서도 버튼이 필요

매번 새로 만들면 낭비! 한 번 만들어서 공유합니다.

```tsx
// apps/main/app/worldcup/page.tsx
import { Button } from '@cozy/ui/button';

export default function WorldcupPage() {
  return <Button>시작하기</Button>;
}
```

---

## 5. 개발 서버 실행 방법

### 실행 명령어

```bash
# pnpm이 전역 설치되어 있다면
pnpm dev

# 없다면 npx로 실행
npx pnpm dev
```

### 실행 결과

```
$ pnpm dev

main:dev: ▲ Next.js 15.x
main:dev: - Local: http://localhost:3000
```

### 접속해서 확인하기

1. 브라우저에서 `http://localhost:3000` 열기 → 메인 페이지
2. 브라우저에서 `http://localhost:3000/worldcup` 열기 → 월드컵 페이지

---

## 6. @cozy/xxx는 뭔가요?

### 이게 뭔가요?

```tsx
import { Button } from '@cozy/ui/button';
```

`@cozy/ui`는 **패키지 이름**입니다.

### 왜 @가 붙나요?

`@`는 **스코프(scope)**를 나타냅니다.
npm에는 수많은 패키지가 있어서 이름이 겹칠 수 있습니다.

```
ui          → 누군가 이미 만들어놨을 수 있음
@cozy/ui    → "cozy"라는 그룹의 "ui" (우리 것!)
```

### 정리

| 패키지 이름 | 실제 위치 | 설명 |
|------------|----------|------|
| `@cozy/ui` | `packages/ui/` | 공유 UI 컴포넌트 |
| `@cozy/config-eslint` | `packages/config-eslint/` | ESLint 설정 |
| `@cozy/config-typescript` | `packages/config-typescript/` | TypeScript 설정 |
| `@cozy/config-tailwind` | `packages/config-tailwind/` | Tailwind 설정 |

---

## 7. 새 서비스 추가하는 방법

예: `/weather` 서비스 추가하기

### Step 1: 폴더 생성

```bash
mkdir -p apps/main/app/weather
```

### Step 2: 페이지 파일 생성

```tsx
// apps/main/app/weather/page.tsx
import { Button } from "@cozy/ui/button";

export default function WeatherPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Weather</h1>
      <p className="text-gray-600 mb-4">날씨 서비스</p>
      <Button>확인하기</Button>
    </main>
  );
}
```

### Step 3: 확인

```bash
pnpm dev
# http://localhost:3000/weather 접속
```

끝! 폴더 하나 만들면 자동으로 라우트가 생깁니다.

---

## 8. 자주 쓰는 명령어 모음

### 기본 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm install` | 모든 패키지 설치 |
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm lint` | 코드 스타일 검사 |
| `pnpm typecheck` | 타입 검사 |

### pnpm이 설치 안 됐을 때

| 명령어 | 설명 |
|--------|------|
| `npx pnpm install` | 패키지 설치 |
| `npx pnpm dev` | 개발 서버 실행 |
| `npx pnpm build` | 빌드 |

### 특정 앱에 패키지 추가

```bash
# main 앱에 axios 추가
pnpm add axios --filter=main

# 공유 UI 패키지에 clsx 추가
pnpm add clsx --filter=@cozy/ui
```

### 캐시 삭제 (문제 생겼을 때)

```bash
pnpm clean
# 또는
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

---

## 9. Vercel 배포

### 설정

프로젝트 루트에 `vercel.json` 파일이 있습니다:

```json
{
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build --filter=main",
  "outputDirectory": "apps/main/.next"
}
```

### 배포 방법

1. [Vercel](https://vercel.com)에 GitHub 레포 연결
2. 자동으로 `vercel.json` 설정을 읽어서 배포

### 배포 결과

```
your-domain.vercel.app/           → 메인 페이지
your-domain.vercel.app/worldcup   → 월드컵 페이지
your-domain.vercel.app/weather    → 날씨 페이지 (추가 시)
```

---

## 요약

```
┌─────────────────────────────────────────────────────────────┐
│                    playground.vercel.app                     │
│                      (main 앱 - port 3000)                   │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
      ┌──────────┐     ┌───────────┐     ┌───────────┐
      │    /     │     │ /worldcup │     │ /weather  │
      │  메인    │     │  월드컵   │     │   날씨    │
      └──────────┘     └───────────┘     └───────────┘
            │                 │                 │
            └─────────────────┴─────────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │  @cozy/ui   │  ← 모두가 공유
                       └─────────────┘
```

1. **사용자**가 `playground.vercel.app/worldcup` 접속
2. **main 앱**이 요청 받음
3. `app/worldcup/page.tsx` 파일이 렌더링
4. **@cozy/ui** 공유 컴포넌트로 화면 그림
5. 사용자에게 보여줌

끝!
