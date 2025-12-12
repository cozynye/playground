import { Metadata } from 'next';
import { TestList } from '@/features/test/components/TestList';
import { activeTests } from '@/features/test/config/tests';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '심리 테스트 모음 - 성격, 연애, MBTI 테스트 | Cozy',
  description:
    '무료 심리 테스트 모음! 사랑의 언어 테스트, MBTI 테스트, 퍼스널 컬러 테스트 등 다양한 성격 및 연애 심리 테스트를 즐겨보세요.',
  keywords: [
    '심리 테스트',
    '성격 테스트',
    'MBTI',
    '연애 테스트',
    '무료 테스트',
    '사랑의 언어',
    '퍼스널 컬러',
    '재미있는 테스트',
  ],
  openGraph: {
    title: '심리 테스트 모음 - 성격, 연애, MBTI 테스트 | Cozy',
    description:
      '사랑의 언어, MBTI, 퍼스널 컬러 등 다양한 무료 심리 테스트를 즐겨보세요!',
    url: 'https://cozy.example.com/test',
    siteName: 'Cozy',
    images: [
      {
        url: '/og-test.png',
        width: 1200,
        height: 630,
        alt: 'Cozy 심리 테스트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '심리 테스트 모음 - Cozy',
    description: '무료 심리 테스트로 나를 알아가는 시간!',
    images: ['/og-test.png'],
  },
};

export default function TestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Cozy
          </Link>
          <nav className="flex gap-4">
            <Link href="/worldcup" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              월드컵
            </Link>
            <Link href="/test" className="text-purple-600 font-semibold">
              테스트
            </Link>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* 타이틀 섹션 */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            심리 테스트
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-2">
            재미있는 심리 테스트로 나를 알아가는 시간 ✨
          </p>
          <p className="text-sm md:text-base text-gray-600">
            성격, 연애, MBTI 등 다양한 테스트를 무료로 즐겨보세요!
          </p>
        </div>

        {/* 테스트 목록 */}
        <TestList tests={activeTests} />
      </div>

      {/* 푸터 */}
      <footer className="bg-white/50 backdrop-blur-sm mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 Cozy. All rights reserved.</p>
          <p className="mt-2">재미로 즐기는 심리 테스트입니다 💝</p>
        </div>
      </footer>
    </main>
  );
}
