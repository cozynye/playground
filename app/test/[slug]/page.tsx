import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTestBySlug, testConfigs } from '@/features/test/config/tests';

interface TestIntroPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return testConfigs.map((test) => ({
    slug: test.slug,
  }));
}

export async function generateMetadata({ params }: TestIntroPageProps): Promise<Metadata> {
  const test = getTestBySlug(params.slug);

  if (!test) {
    return {
      title: '테스트를 찾을 수 없습니다 | Cozy',
    };
  }

  return {
    title: test.metadata.title,
    description: test.metadata.description,
    keywords: test.metadata.keywords,
    openGraph: {
      title: test.metadata.title,
      description: test.metadata.description,
      images: [test.metadata.ogImage],
      url: `https://cozy.example.com/test/${test.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: test.metadata.title,
      description: test.metadata.description,
      images: [test.metadata.ogImage],
    },
  };
}

export default function TestIntroPage({ params }: TestIntroPageProps) {
  const test = getTestBySlug(params.slug);

  if (!test) {
    notFound();
  }

  return (
    <main
      className="min-h-screen py-8 md:py-12"
      style={{
        background: `linear-gradient(135deg, ${test.colors.background} 0%, white 100%)`,
      }}
    >
      {/* 헤더 */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <Link
          href="/test"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← 테스트 목록으로
        </Link>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4">
        <div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          style={{
            borderTop: `6px solid ${test.colors.primary}`,
          }}
        >
          {/* 썸네일 이미지 */}
          <div className="relative w-full aspect-[2/1] bg-gray-100">
            <Image
              src={test.thumbnailImage}
              alt={test.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 0%, ${test.colors.primary}20 100%)`,
              }}
            />
          </div>

          {/* 콘텐츠 */}
          <div className="p-8 md:p-12">
            {/* 카테고리 뱃지 */}
            <div className="mb-4">
              <span
                className="inline-block px-4 py-2 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: test.colors.primary }}
              >
                {getCategoryLabel(test.category)}
              </span>
            </div>

            {/* 제목 */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: test.colors.text }}
            >
              {test.title}
            </h1>

            {/* 설명 */}
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              {test.description}
            </p>

            {/* 정보 */}
            <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">❓</span>
                <span className="font-medium">총 {test.questions.length}문항</span>
              </div>
              {test.estimatedTime && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-2xl">⏱️</span>
                  <span className="font-medium">약 {test.estimatedTime}분 소요</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">💯</span>
                <span className="font-medium">무료</span>
              </div>
            </div>

            {/* 시작 버튼 */}
            <Link href={`/test/${test.slug}/quiz`} className="block">
              <button
                className="w-full py-5 rounded-2xl text-white font-bold text-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${test.colors.primary}, ${test.colors.secondary})`,
                }}
              >
                테스트 시작하기 →
              </button>
            </Link>

            {/* 주의사항 */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                <span>안내사항</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 솔직하게 답변할수록 정확한 결과를 얻을 수 있어요</li>
                <li>• 정답은 없으니 편하게 선택해주세요</li>
                <li>• 재미로 즐기는 테스트입니다 😊</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    personality: '성격',
    love: '연애',
    psychology: '심리',
    fun: '재미',
    career: '진로',
  };
  return labels[category] || category;
}
