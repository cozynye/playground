# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 코드 작업 시 참고하는 가이드입니다.

## 프로젝트 개요

**Turborepo + pnpm 기반 Monorepo 프로젝트**입니다.
하나의 도메인에서 여러 독립적인 서비스를 운영합니다.

- **구조**: Turborepo Monorepo
- **프레임워크**: Next.js 15 (App Router)
- **스타일**: Tailwind CSS
- **언어**: TypeScript
- **패키지 매니저**: pnpm

## 개발 명령어

### 필수 명령어

```bash
pnpm dev              # 전체 개발 서버 실행
pnpm build            # 전체 빌드
pnpm dev:main         # main 앱만 실행 (port 3000)
pnpm dev:worldcup     # worldcup 앱만 실행 (port 3001)
```

### ⚠️ Claude Code 실행 시 포트 번호

**중요**: Claude Code에서 개발 서버를 실행할 때는 **포트 3005번부터** 사용해야 합니다.

```bash
# Claude Code에서 실행 시
npx next dev --port 3005   # 또는 필요한 포트 번호 (3005, 3006, 3007, ...)
```

**이유**:
- 사용자의 로컬 개발 환경과 충돌 방지
- 포트 3000-3004는 다른 서비스에서 사용 중일 수 있음

### 패키지 추가

```bash
# 특정 앱에 패키지 추가
pnpm add [패키지명] --filter=[앱이름]

# 예시
pnpm add axios --filter=worldcup
pnpm add clsx --filter=@cozy/ui
```

## 프로젝트 구조

```
cozy/
├── apps/
│   ├── main/              # 메인 앱 (라우팅 허브) - port 3000
│   │   └── app/           # Next.js App Router 페이지
│   └── worldcup/          # 월드컵 서비스 - port 3001
│       └── app/           # basePath: '/worldcup'
│
├── packages/
│   ├── ui/                # 공유 UI 컴포넌트 (@cozy/ui)
│   ├── config-eslint/     # ESLint 설정
│   ├── config-typescript/ # TypeScript 설정
│   └── config-tailwind/   # Tailwind 설정
│
├── turbo.json             # Turborepo 설정
├── pnpm-workspace.yaml    # pnpm 워크스페이스
└── package.json           # 루트 패키지
```

### 앱 구조 설명

- **main**: 라우팅 허브 역할, `/worldcup` 요청을 worldcup 앱으로 전달
- **worldcup**: `basePath: '/worldcup'` 설정으로 독립 운영
- 새 서비스 추가 시 `apps/` 아래에 새 폴더 생성

### 공유 패키지 (@cozy/*)

```tsx
// 공유 UI 컴포넌트 사용
import { Button, Card, Layout } from '@cozy/ui';
```

## 코드 컨벤션

### Import 순서

```tsx
// 1. React/Next.js
import { useState, useCallback } from 'react';
import Link from 'next/link';

// 2. 외부 라이브러리
import { clsx } from 'clsx';

// 3. 공유 패키지
import { Button, Card } from '@cozy/ui';

// 4. 내부 컴포넌트/훅
import { useCustomHook } from '@/hooks/useCustomHook';

// 5. 타입
import type { PageProps } from '@/types';
```

### 네이밍 규칙

- **컴포넌트**: PascalCase (`WorldcupPage`)
- **파일**: PascalCase for 컴포넌트, camelCase for 유틸리티
- **타입/인터페이스**: I 접두사 (`IProductData`)
- **상수**: UPPER_SNAKE_CASE (`API_URL`)

### 컴포넌트 Props 패턴

**중요**: setState를 직접 props로 전달하지 마세요. 항상 핸들러 함수로 감싸세요.

```typescript
// ❌ 잘못된 방식 - setState 직접 전달
interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
}

// ✅ 올바른 방식 - 핸들러 함수 전달
interface ModalProps {
  onClose: () => void;
}

// 부모 컴포넌트
const handleCloseModal = useCallback(() => {
  setIsModalOpen(false);
}, []);

<Modal onClose={handleCloseModal} />;
```

**Props 네이밍**:
- 이벤트 핸들러: `on[Action]` (`onClose`, `onClick`, `onSubmit`)
- 내부 핸들러: `handle[Action]` (`handleClose`, `handleClick`)

---

## 관심사의 분리 (Separation of Concerns)

### 핵심 원칙: 준비과정과 런타임 로직 분리

소프트웨어 시스템은 **설정(Setup)**과 **사용(Runtime)**이 분리된 구조여야 한다.

### 3계층 분리 패턴

```
┌─────────────────────────────────────────────────┐
│  Component (UI Layer)                           │
│  - 화면 렌더링만 담당                              │
│  - 비즈니스 로직 없음                              │
│  - Props와 상태를 받아 UI만 표현                   │
└─────────────────────────────────────────────────┘
                      ↓ uses
┌─────────────────────────────────────────────────┐
│  Custom Hook (Logic Layer)                      │
│  - 데이터 fetching, 상태 관리                      │
│  - 비즈니스 로직 처리                              │
│  - 이벤트 핸들러 로직                              │
└─────────────────────────────────────────────────┘
                      ↓ calls
┌─────────────────────────────────────────────────┐
│  API Module (Data Layer)                        │
│  - HTTP 요청/응답 처리                            │
│  - 엔드포인트 정의                                │
│  - 데이터 변환/정규화                              │
└─────────────────────────────────────────────────┘
```

### 적용 예시

**❌ BAD - 모든 로직이 컴포넌트에 혼재**

```tsx
function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // API 호출 로직이 컴포넌트에 직접 존재
    fetch("/api/products").then((res) => res.json()).then(setProducts);
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return <div>{/* UI 렌더링 */}</div>;
}
```

**✅ GOOD - 3계층으로 분리**

```tsx
// 1. API Module
export const getProducts = () => fetch("/api/products").then(res => res.json());
export const deleteProduct = (id: number) => fetch(`/api/products/${id}`, { method: 'DELETE' });

// 2. Custom Hook
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  // 로직 처리
  return { products, deleteProduct };
};

// 3. Component
function ProductList() {
  const { products, deleteProduct } = useProducts();
  return <div>{/* UI 렌더링만 담당 */}</div>;
}
```

### 분리 기준

| 계층 | 역할 | 위치 | 예시 |
|------|------|------|------|
| **UI Layer** | 렌더링, 사용자 인터랙션 | `app/`, `components/` | 버튼, 폼, 리스트 |
| **Logic Layer** | 상태관리, 비즈니스 로직 | `hooks/` | useProducts |
| **Data Layer** | API 통신, 데이터 변환 | `api/`, `services/` | getProducts |

### 적용해야 하는 상황

- 컴포넌트가 100줄 이상일 때
- API 호출이 컴포넌트 내부에 있을 때
- 동일한 로직이 여러 컴포넌트에서 반복될 때
- 테스트 작성이 어려울 때

---

## Clean Code 원칙

### 핵심 설계 원칙 (필수 준수)

#### 1. TDD - 테스트 주도 개발

코드 작성 전 테스트를 먼저 작성하는 개발 방법론

**TDD 사이클: Red → Green → Refactor**

1. **Red**: 실패하는 테스트 먼저 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 코드 개선 (테스트는 계속 통과해야 함)

```typescript
// 1. Red - 실패하는 테스트 작성
describe("calculateDiscount", () => {
  it("10% 할인을 적용한다", () => {
    expect(calculateDiscount(1000, 10)).toBe(900);
  });
});

// 2. Green - 테스트 통과하는 최소 코드
function calculateDiscount(price: number, percent: number): number {
  return price - (price * percent) / 100;
}

// 3. Refactor - 코드 개선
function calculateDiscount(price: number, discountPercent: number): number {
  const discountAmount = price * (discountPercent / 100);
  return price - discountAmount;
}
```

**TDD 적용 기준**:
- 새로운 유틸리티 함수 작성 시
- 비즈니스 로직 구현 시
- 버그 수정 시 (버그 재현 테스트 먼저 작성)
- 복잡한 상태 관리 로직

#### 2. SRP - 단일 책임 원칙

**클래스/함수/컴포넌트는 단 하나의 책임만 가져야 한다**

"변경의 이유가 하나뿐이어야 한다"

```typescript
// ❌ BAD - 여러 책임을 가진 컴포넌트
function UserProfile({ userId }) {
  // 책임 1: 데이터 fetching
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser(userId).then(setUser); }, [userId]);

  // 책임 2: 폼 유효성 검사
  const validateEmail = (email) => { ... };

  // 책임 3: UI 렌더링
  return <div>...</div>;
}

// ✅ GOOD - 책임 분리
// 1. 데이터 fetching → Custom Hook
function useUser(userId) {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser(userId).then(setUser); }, [userId]);
  return user;
}

// 2. 유효성 검사 → 유틸리티
function validateEmail(email: string): boolean { ... }

// 3. UI 렌더링 → 컴포넌트
function UserProfile({ userId }) {
  const user = useUser(userId);
  return <div>...</div>;
}
```

**SRP 적용 체크리스트**:
- [ ] 이 컴포넌트/함수가 하는 일을 한 문장으로 설명할 수 있는가?
- [ ] 변경해야 할 이유가 하나뿐인가?
- [ ] 100줄을 넘지 않는가? (넘으면 분리 고려)

#### 3. OCP - 개방-폐쇄 원칙

**확장에는 열려 있고, 수정에는 닫혀 있어야 한다**

기존 코드를 수정하지 않고 새로운 기능을 추가할 수 있어야 함

```typescript
// ❌ BAD - 새 타입 추가 시 기존 코드 수정 필요
function processPayment(type: string, amount: number) {
  if (type === "card") {
    // 카드 결제 로직
  } else if (type === "bank") {
    // 계좌이체 로직
  } else if (type === "kakao") {
    // 새 결제 수단 추가 = 기존 함수 수정!
  }
}

// ✅ GOOD - 확장에 열림, 수정에 닫힘
interface PaymentProcessor {
  process(amount: number): Promise<PaymentResult>;
}

class CardPayment implements PaymentProcessor {
  process(amount: number) { /* 카드 결제 */ }
}

// 새 결제 수단 추가 = 새 클래스 생성 (기존 코드 수정 없음!)
class KakaoPayment implements PaymentProcessor {
  process(amount: number) { /* 카카오페이 */ }
}
```

**OCP 적용 체크리스트**:
- [ ] 새 기능 추가 시 기존 코드를 수정해야 하는가?
- [ ] if-else / switch 문이 계속 늘어나는가?
- [ ] 인터페이스/추상화로 확장 가능하게 설계되었는가?

---

### 네이밍 규칙

#### 1. 의미 있는 이름 (Meaningful Names)

- **의도가 분명한 이름**: 변수, 함수의 존재 이유, 수행 기능이 이름만으로 드러나야 함
- **읽는 사람이 차이를 알도록**: 비슷한 개념은 비슷한 표기법 사용

```typescript
// ❌ BAD - 의도가 불분명
const d = new Date();
const list = [...];

// ✅ GOOD - 의도가 명확
const createdAt = new Date();
const worldcupList = [...];
```

```typescript
// ❌ BAD - 차이를 알 수 없음
const productInfo = {...};
const productData = {...};

// ✅ GOOD - 명확한 차이
const productDisplayInfo = {...};  // UI 표시용
const productApiResponse = {...};  // API 응답 데이터
```

#### 2. 한 개념에 한 단어 (One Word per Concept)

- 같은 개념에는 일관된 단어 사용
- fetch, retrieve, get 중 하나만 선택해서 일관되게 사용

```typescript
// ❌ BAD - 같은 개념에 다른 단어
function getUser() {...}
function fetchProduct() {...}
function retrieveOrder() {...}

// ✅ GOOD - 일관된 단어 사용
function getUser() {...}
function getProduct() {...}
function getOrder() {...}
```

### 함수 규칙

#### 1. 작게, 더 작게 (Small Functions)

- 함수는 한 화면에 들어올 정도로 작아야 함
- 들여쓰기 수준은 1단 또는 2단을 넘어서면 안 됨

```typescript
// ❌ BAD - 너무 긴 함수
function handleSubmit() {
  if (validation) {
    // 50줄의 코드
  } else {
    // 30줄의 코드
  }
}

// ✅ GOOD - 작은 함수로 분리
function handleSubmit() {
  if (!isValid()) {
    showValidationError();
    return;
  }
  submitData();
}

function isValid() {...}
function showValidationError() {...}
function submitData() {...}
```

#### 2. 한 가지만 하자 (Do One Thing)

- 함수는 한 가지 작업만 수행해야 함

```typescript
// ❌ BAD - 여러 가지 일을 함
function processUserData(userData) {
  // 1. 검증
  if (!userData.email) return false;
  // 2. 변환
  const formatted = formatData(userData);
  // 3. 저장
  saveToDatabase(formatted);
  // 4. 알림
  sendEmail(userData.email);
}

// ✅ GOOD - 한 가지 일만
function processUserData(userData) {
  const validatedData = validateUserData(userData);
  const formattedData = formatUserData(validatedData);
  saveUserData(formattedData);
  notifyUser(validatedData.email);
}
```

#### 3. 함수 인수는 적을수록 좋다 (Minimize Arguments)

- **이상적인 인수 개수: 0개**
- 3개 이상은 가능한 피할 것

```typescript
// ❌ BAD - 너무 많은 인수
function createUser(name, email, age, address, phone, role) {...}

// ✅ GOOD - 객체로 묶기
interface CreateUserParams {
  name: string;
  email: string;
  age: number;
  address: string;
}

function createUser(params: CreateUserParams) {...}
```

#### 4. 부수 효과를 피하자 (Avoid Side Effects)

- 함수 이름에서 약속한 것 외에 다른 일을 하지 말 것

```typescript
// ❌ BAD - 부수 효과 있음
function checkPassword(username: string, password: string): boolean {
  const user = findUser(username);
  if (user && user.password === password) {
    Session.initialize(); // 부수 효과!
    return true;
  }
  return false;
}

// ✅ GOOD - 부수 효과 없음
function checkPassword(username: string, password: string): boolean {
  const user = findUser(username);
  return user && user.password === password;
}

function loginUser(username: string, password: string): boolean {
  if (checkPassword(username, password)) {
    Session.initialize(); // 명시적으로 분리
    return true;
  }
  return false;
}
```

---

## 모바일 우선 반응형 디자인 (Mobile-First Responsive)

### 핵심 원칙

**모든 UI 컴포넌트는 반드시 모바일 환경을 고려하여 작성해야 한다.**

### 반응형 브레이크포인트

```typescript
// Tailwind CSS 기본 브레이크포인트 사용
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

// Mobile First 접근법 - 모바일 스타일을 기본으로, 큰 화면에서 확장
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
className="p-4 md:p-6 lg:p-8"
```

### 반응형 체크리스트

모든 UI 작업 시 다음을 확인해야 한다:

- [ ] **모바일 (< 640px)**: 터치 친화적, 세로 스크롤, 큰 터치 타겟
- [ ] **태블릿 (640px - 1024px)**: 중간 레이아웃, 적절한 여백
- [ ] **데스크탑 (> 1024px)**: 넓은 레이아웃, 호버 효과 활용

### 필수 적용 사항

#### 1. 터치 타겟 크기
```tsx
// ❌ BAD - 터치하기 어려움
<button className="p-1 text-xs">클릭</button>

// ✅ GOOD - 최소 44x44px 터치 영역
<button className="p-3 min-h-[44px] min-w-[44px]">클릭</button>
```

#### 2. 유연한 레이아웃
```tsx
// ❌ BAD - 고정 너비
<div className="w-[800px]">콘텐츠</div>

// ✅ GOOD - 반응형 너비
<div className="w-full max-w-4xl mx-auto px-4">콘텐츠</div>
```

#### 3. 반응형 그리드
```tsx
// ❌ BAD - 고정 그리드
<div className="grid grid-cols-4 gap-8">

// ✅ GOOD - 반응형 그리드
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
```

#### 4. 반응형 텍스트
```tsx
// ❌ BAD - 고정 크기
<h1 className="text-4xl">제목</h1>

// ✅ GOOD - 반응형 크기
<h1 className="text-2xl md:text-3xl lg:text-4xl">제목</h1>
```

#### 5. 이미지 반응형
```tsx
// ❌ BAD - 고정 크기 이미지
<img src="..." width={800} height={600} />

// ✅ GOOD - 반응형 이미지
<img src="..." className="w-full h-auto object-cover" />
```

### 3D/Canvas 반응형 (Three.js / React Three Fiber)

```tsx
// viewport 기반 반응형 적용
const { viewport } = useThree();

useEffect(() => {
  const isMobile = viewport.width < 8;
  const isTablet = viewport.width >= 8 && viewport.width < 12;

  // 화면 크기에 따른 위치/크기 조정
  if (isMobile) {
    setScale(0.6);
    setCameraDistance(16);
  } else if (isTablet) {
    setScale(0.8);
    setCameraDistance(14);
  } else {
    setScale(1);
    setCameraDistance(12);
  }
}, [viewport.width]);
```

### 모바일 인터랙션 지원

```tsx
// 터치 이벤트 지원
useEffect(() => {
  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    // 터치 좌표 처리
  };

  window.addEventListener('touchmove', handleTouchMove, { passive: true });
  return () => window.removeEventListener('touchmove', handleTouchMove);
}, []);
```

---

## Meta OG (Open Graph) 필수 규칙

**모든 페이지를 만들 때 반드시 Meta OG 정보를 포함해야 합니다.**

### 필수 메타 태그

Next.js App Router에서는 `metadata` 객체 또는 `generateMetadata` 함수를 사용합니다.

```typescript
// app/page.tsx 또는 app/[slug]/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지 제목 | Cozy',
  description: '페이지에 대한 설명 (150자 이내 권장)',
  keywords: ['키워드1', '키워드2', '키워드3'],
  openGraph: {
    title: '페이지 제목 | Cozy',
    description: '페이지에 대한 설명',
    url: 'https://cozy.example.com/page-path',
    siteName: 'Cozy',
    images: [
      {
        url: '/og-image.png', // 1200x630px 권장
        width: 1200,
        height: 630,
        alt: '이미지 설명',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '페이지 제목 | Cozy',
    description: '페이지에 대한 설명',
    images: ['/og-image.png'],
  },
};
```

### 동적 메타데이터 (Dynamic Routes)

```typescript
// app/[slug]/page.tsx
import { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await fetchData(params.slug);

  return {
    title: `${data.title} | Cozy`,
    description: data.description,
    openGraph: {
      title: `${data.title} | Cozy`,
      description: data.description,
      images: [data.ogImage || '/og-default.png'],
    },
  };
}
```

### 체크리스트

페이지 작성 시 반드시 확인:
- [ ] `title` - 페이지 제목 (60자 이내 권장)
- [ ] `description` - 페이지 설명 (150자 이내 권장)
- [ ] `openGraph.title` - OG 제목
- [ ] `openGraph.description` - OG 설명
- [ ] `openGraph.image` - OG 이미지 (1200x630px)
- [ ] `twitter.card` - Twitter 카드 타입

### OG 이미지 가이드라인

- **크기**: 1200 x 630px (권장)
- **형식**: PNG 또는 JPG
- **위치**: `public/` 폴더
- **파일명**: 페이지별 구분 (예: `og-home.png`, `og-worldcup.png`)

---

## 새 서비스 추가 방법

1. `apps/worldcup/` 복사
2. `package.json`의 name, port 수정
3. `next.config.ts`의 `basePath` 수정
4. `apps/main/next.config.ts`에 rewrite 규칙 추가
5. `pnpm install` 실행

자세한 내용은 `PROJECT_GUIDE.md` 참고
