# Cozy 프로젝트 완전 가이드

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

---

## 1. 이 프로젝트가 뭔가요?

### 한 줄 요약
**하나의 도메인(cozy.com)에서 여러 개의 독립적인 서비스를 운영**하기 위한 프로젝트입니다.

### 예시
```
cozy.com/           → 메인 랜딩 페이지
cozy.com/worldcup   → 이상형 월드컵 서비스
cozy.com/weather    → 날씨 서비스 (나중에 추가)
cozy.com/manage     → 관리자 페이지 (나중에 추가)
```

### 왜 이렇게?
- 각 서비스(`worldcup`, `weather` 등)는 **완전히 다른 기능**을 합니다
- 하지만 **하나의 브랜드(Cozy)** 아래에서 운영하고 싶습니다
- 그래서 URL은 하나의 도메인을 쓰지만, 내부적으로는 각각 독립된 앱입니다

### 중요: 도메인은 하나!

```
✅ 우리가 원하는 것:
cozy.com/worldcup
cozy.com/weather
cozy.com/manage
→ 도메인은 cozy.com 하나, 경로만 다름

❌ 이런 거 아님:
worldcup.com
weather.com
manage.com
→ 여러 도메인 운영 (이건 아님!)
```

**도메인 하나 + 경로로 서비스 구분**이 핵심입니다.

---

## 2. 왜 이런 구조인가요?

### 문제 상황
일반적인 Next.js 프로젝트는 **하나의 앱 = 하나의 프로젝트**입니다.

```
my-app/
├── app/
├── package.json
└── ...
```

그런데 우리는 여러 개의 **완전히 다른 서비스**를 만들고 싶습니다.

### 해결책: Monorepo (모노레포)

**Monorepo = 하나의 저장소에 여러 프로젝트를 넣는 것**

```
cozy/                    ← 하나의 저장소
├── apps/
│   ├── main/           ← 프로젝트 1
│   └── worldcup/       ← 프로젝트 2
└── packages/           ← 공유 코드
```

### Monorepo의 장점

| 장점 | 설명 |
|------|------|
| 코드 공유 | 버튼, 카드 같은 UI를 한 번만 만들고 모든 앱에서 사용 |
| 일관성 | ESLint, TypeScript 설정을 한 곳에서 관리 |
| 의존성 관리 | 패키지 버전을 한 곳에서 통일 |
| 빌드 최적화 | 변경된 앱만 다시 빌드 (시간 절약) |

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

#### 왜 pnpm을 쓰나요?
이 프로젝트는 **여러 개의 앱**이 있어서 의존성이 많습니다.
pnpm은 이런 Monorepo 환경에서 훨씬 효율적입니다.

---

### 3.2 Turborepo(터보)가 뭔가요?

**Turborepo = Monorepo를 효율적으로 관리해주는 도구**

#### 문제 상황
앱이 여러 개면 빌드도 여러 번 해야 합니다:
```bash
cd apps/main && npm run build
cd apps/worldcup && npm run build
# 앱이 10개면 10번...
```

#### Turborepo의 해결책
```bash
# 한 번에 모든 앱 빌드
pnpm build

# Turborepo가 알아서:
# 1. 병렬로 빌드 (동시에 여러 개)
# 2. 변경된 것만 빌드 (캐싱)
# 3. 의존성 순서 맞춰서 빌드
```

#### 캐싱이란?
한번 빌드한 결과를 저장해둡니다.
코드가 안 바뀌면 다시 빌드 안 하고 저장된 결과를 씁니다.
→ **빌드 시간 90% 이상 단축** 가능

---

### 3.3 Next.js가 뭔가요?

**Next.js = React로 웹사이트 만드는 프레임워크**

React만 쓰면 직접 설정할 게 많습니다:
- 라우팅 (페이지 이동)
- 서버 사이드 렌더링
- 이미지 최적화
- 빌드 설정
- ...

Next.js는 이걸 다 해결해줍니다.

#### 파일 기반 라우팅
```
app/
├── page.tsx        → cozy.com/
├── about/
│   └── page.tsx    → cozy.com/about
└── contact/
    └── page.tsx    → cozy.com/contact
```

파일만 만들면 자동으로 URL이 생깁니다!

---

### 3.4 basePath가 뭔가요?

각 앱의 **기본 경로**를 설정하는 것입니다.

```typescript
// apps/worldcup/next.config.ts
const nextConfig = {
  basePath: '/worldcup',  // ← 이 설정
};
```

이렇게 하면:
- `worldcup` 앱의 `/` 페이지가 `/worldcup`이 됩니다
- `worldcup` 앱의 `/game` 페이지가 `/worldcup/game`이 됩니다

---

## 4. 폴더 구조 상세 설명

```
cozy/
├── apps/                    # 실제 웹 애플리케이션들
│   ├── main/               # 메인 앱 (라우팅 허브)
│   └── worldcup/           # 월드컵 서비스
│
├── packages/                # 공유 코드 (라이브러리)
│   ├── ui/                 # 공유 UI 컴포넌트
│   ├── config-eslint/      # ESLint 설정
│   ├── config-typescript/  # TypeScript 설정
│   └── config-tailwind/    # Tailwind CSS 설정
│
├── node_modules/            # 설치된 패키지들 (건드리지 마세요)
├── package.json             # 프로젝트 설정 파일
├── pnpm-workspace.yaml      # pnpm 워크스페이스 설정
├── pnpm-lock.yaml           # 패키지 버전 잠금 파일
└── turbo.json               # Turborepo 설정
```

### 4.1 apps/ 폴더

**실제로 브라우저에서 보이는 웹사이트들**입니다.

#### apps/main/ - 라우팅 허브

```
apps/main/
├── app/
│   ├── layout.tsx      # 전체 레이아웃 (HTML, body 태그)
│   ├── page.tsx        # 메인 페이지 (cozy.com/)
│   └── globals.css     # 전역 스타일
├── next.config.ts      # Next.js 설정 (중요!)
├── package.json        # 이 앱의 의존성
├── tailwind.config.ts  # Tailwind 설정
└── tsconfig.json       # TypeScript 설정
```

**왜 "라우팅 허브"인가요?**

`main` 앱은 다른 앱들로 연결해주는 역할을 합니다.

```typescript
// apps/main/next.config.ts
async rewrites() {
  return {
    beforeFiles: [
      {
        source: '/worldcup/:path*',           // 이 URL로 요청이 오면
        destination: 'http://localhost:3001/worldcup/:path*',  // 여기로 보내줘
      },
    ],
  };
}
```

사용자가 `cozy.com/worldcup`에 접속하면:
1. `main` 앱이 요청을 받음
2. "아, worldcup이네?" 하고 `worldcup` 앱으로 넘김
3. `worldcup` 앱이 실제 페이지를 보여줌

#### apps/worldcup/ - 월드컵 서비스

```
apps/worldcup/
├── app/
│   ├── layout.tsx      # 월드컵 서비스 레이아웃
│   ├── page.tsx        # 월드컵 메인 페이지
│   └── globals.css     # 월드컵 전용 스타일
├── next.config.ts      # basePath: '/worldcup' 설정
├── package.json        # 월드컵 앱 의존성
└── ...
```

**완전히 독립된 앱**입니다.
- 자기만의 페이지가 있고
- 자기만의 스타일이 있고
- 자기만의 로직이 있습니다

---

### 4.2 packages/ 폴더

**앱들이 공유해서 쓰는 코드**입니다.

#### packages/ui/ - 공유 UI 컴포넌트

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
- `main` 앱에서도 버튼이 필요
- `worldcup` 앱에서도 버튼이 필요
- `weather` 앱에서도 버튼이 필요

매번 새로 만들면 낭비! 한 번 만들어서 공유합니다.

```tsx
// apps/worldcup/app/page.tsx
import { Button, Card } from '@cozy/ui';  // 공유 컴포넌트 가져오기

export default function Page() {
  return (
    <Card title="이상형 월드컵">
      <Button>시작하기</Button>
    </Card>
  );
}
```

#### packages/config-*/ - 설정 공유

```
packages/config-typescript/   # TypeScript 설정
packages/config-eslint/       # 코드 스타일 규칙
packages/config-tailwind/     # CSS 설정
```

**왜 설정도 공유하나요?**

앱이 10개인데 각각 다른 설정을 쓰면 혼란스럽습니다.
설정을 한 곳에서 관리하면:
- 모든 앱이 같은 코드 스타일
- 모든 앱이 같은 TypeScript 규칙
- 변경할 때 한 곳만 수정

---

### 4.3 루트 파일들

#### package.json

```json
{
  "name": "cozy",
  "scripts": {
    "dev": "turbo dev",           // 개발 서버 실행
    "build": "turbo build",       // 프로덕션 빌드
    "dev:main": "turbo dev --filter=main",        // main만 실행
    "dev:worldcup": "turbo dev --filter=worldcup" // worldcup만 실행
  },
  "devDependencies": {
    "turbo": "^2.3.3",            // Turborepo
    "typescript": "^5.7.2"        // TypeScript
  },
  "packageManager": "pnpm@9.15.1" // pnpm 사용 선언
}
```

#### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"      # apps 폴더의 모든 것을 워크스페이스로
  - "packages/*"  # packages 폴더의 모든 것을 워크스페이스로
```

pnpm에게 "이 폴더들이 하나의 프로젝트야"라고 알려줍니다.

#### turbo.json

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],    // 의존하는 것 먼저 빌드
      "outputs": [".next/**"]     // 빌드 결과물 위치
    },
    "dev": {
      "cache": false,             // 개발 서버는 캐시 안 함
      "persistent": true          // 계속 실행
    }
  }
}
```

Turborepo에게 "빌드는 이렇게, 개발은 이렇게 해"라고 알려줍니다.

---

## 5. 개발 서버 실행 방법

### 기존에 쓰던 방식 (일반 프로젝트)

```bash
npm run dev
```

### 이 프로젝트에서는

```bash
# 1. 먼저 pnpm이 있어야 합니다 (없으면 npx로 실행)
npx pnpm dev
```

또는

```bash
# pnpm을 전역 설치하면
npm install -g pnpm

# 그 다음부터는
pnpm dev
```

### 실행하면 무슨 일이?

```
$ pnpm dev

main:dev: ▲ Next.js 15.x
main:dev: - Local: http://localhost:3000    ← 메인 앱

worldcup:dev: ▲ Next.js 15.x
worldcup:dev: - Local: http://localhost:3001  ← 월드컵 앱
```

**두 개의 서버가 동시에 실행됩니다!**

### 특정 앱만 실행하고 싶으면

```bash
# main만 실행
pnpm dev:main
# 또는
npx pnpm dev --filter=main

# worldcup만 실행
pnpm dev:worldcup
# 또는
npx pnpm dev --filter=worldcup
```

### 접속해서 확인하기

1. 브라우저에서 `http://localhost:3000` 열기 → 메인 페이지
2. 브라우저에서 `http://localhost:3000/worldcup` 열기 → 월드컵 페이지

> 주의: `localhost:3001/worldcup`도 되지만, 실제 운영할 때는 `localhost:3000/worldcup`처럼 main을 통해 접근합니다.

---

## 6. @cozy/xxx는 뭔가요?

### 이게 뭔가요?

```tsx
import { Button } from '@cozy/ui';
```

`@cozy/ui`는 **패키지 이름**입니다.

### 왜 @가 붙나요?

`@`는 **스코프(scope)**를 나타냅니다.
npm에는 수많은 패키지가 있어서 이름이 겹칠 수 있습니다.

```
ui          → 누군가 이미 만들어놨을 수 있음
@cozy/ui    → "cozy"라는 그룹의 "ui" (우리 것!)
```

### 어디서 정의하나요?

```json
// packages/ui/package.json
{
  "name": "@cozy/ui",  // ← 여기서 이름 정의
  ...
}
```

### 어떻게 가져다 쓰나요?

```json
// apps/worldcup/package.json
{
  "dependencies": {
    "@cozy/ui": "workspace:*"  // ← 워크스페이스에서 가져와
  }
}
```

`workspace:*`는 "같은 워크스페이스(프로젝트) 안에 있는 @cozy/ui를 써"라는 의미입니다.

npm에서 다운받는 게 아니라, 바로 옆 `packages/ui` 폴더를 참조합니다.

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

### Step 1: worldcup 복사

```bash
cp -r apps/worldcup apps/weather
```

### Step 2: package.json 수정

```json
// apps/weather/package.json
{
  "name": "weather",  // worldcup → weather
  "scripts": {
    "dev": "next dev --port 3002",  // 포트 변경 (3001 → 3002)
    ...
  }
}
```

### Step 3: next.config.ts 수정

```typescript
// apps/weather/next.config.ts
const nextConfig = {
  basePath: '/weather',  // '/worldcup' → '/weather'
  ...
};
```

### Step 4: main에 라우팅 추가

```typescript
// apps/main/next.config.ts
async rewrites() {
  const weatherUrl = isDev ? 'http://localhost:3002' : process.env.WEATHER_URL;

  return {
    beforeFiles: [
      // 기존 worldcup 설정...
      {
        source: '/weather',
        destination: `${weatherUrl}/weather`,
      },
      {
        source: '/weather/:path*',
        destination: `${weatherUrl}/weather/:path*`,
      },
    ],
  };
}
```

### Step 5: 의존성 설치

```bash
pnpm install
```

### Step 6: 실행

```bash
pnpm dev
# 또는
pnpm dev --filter=weather
```

---

## 8. 자주 쓰는 명령어 모음

### 기본 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm install` | 모든 패키지 설치 |
| `pnpm dev` | 모든 앱 개발 서버 실행 |
| `pnpm build` | 모든 앱 빌드 |
| `pnpm dev:main` | main 앱만 실행 |
| `pnpm dev:worldcup` | worldcup 앱만 실행 |

### pnpm이 설치 안 됐을 때

| 명령어 | 설명 |
|--------|------|
| `npx pnpm install` | 패키지 설치 |
| `npx pnpm dev` | 개발 서버 실행 |
| `npx pnpm build` | 빌드 |

### 특정 앱에 패키지 추가

```bash
# worldcup 앱에 axios 추가
pnpm add axios --filter=worldcup

# main 앱에 date-fns 추가
pnpm add date-fns --filter=main

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

## 요약

```
┌─────────────────────────────────────────────────────────────┐
│                         cozy.com                             │
│                    (main 앱 - port 3000)                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐   ┌───────────┐   ┌───────────┐
    │ /worldcup │   │ /weather  │   │ /manage   │
    │ port 3001 │   │ port 3002 │   │ port 3003 │
    └──────────┘   └───────────┘   └───────────┘
          │               │               │
          └───────────────┴───────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  @cozy/ui   │  ← 모두가 공유
                   └─────────────┘
```

1. **사용자**가 `cozy.com/worldcup` 접속
2. **main 앱**이 요청 받음
3. `/worldcup`이니까 **worldcup 앱**으로 넘김
4. worldcup 앱이 **@cozy/ui** 컴포넌트로 화면 그림
5. 사용자에게 보여줌

끝!
