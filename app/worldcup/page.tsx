import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/ui";
import { WorldcupCard, getActiveWorldcups } from "@/features/worldcup";

export const metadata: Metadata = {
  title: "이상형 월드컵 - 다양한 월드컵 게임 | Cozy",
  description:
    "음식, 색상, 동물 등 다양한 이상형 월드컵 게임을 즐겨보세요! 친구들과 결과를 공유하고 비교해보세요.",
  keywords: [
    "이상형 월드컵",
    "월드컵 게임",
    "음식 월드컵",
    "동물 월드컵",
    "Cozy",
  ],
  openGraph: {
    title: "이상형 월드컵 - 다양한 월드컵 게임 | Cozy",
    description:
      "음식, 색상, 동물 등 다양한 이상형 월드컵 게임을 즐겨보세요! 친구들과 결과를 공유하고 비교해보세요.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "이상형 월드컵",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "이상형 월드컵 - 다양한 월드컵 게임 | Cozy",
    description: "음식, 색상, 동물 등 다양한 이상형 월드컵 게임을 즐겨보세요!",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
};

export default function WorldcupListPage() {
  const worldcups = getActiveWorldcups();

  return (
    <Layout
      header={
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/worldcup"
            className="text-xl font-bold text-cozy-primary"
          >
            🏆 월드컵
          </Link>
        </nav>
      }
      footer={
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 Cozy. All rights reserved.</p>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            이상형 월드컵
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            다양한 월드컵 중 관심있는 것을 선택해 플레이해보세요!
          </p>
        </div>

        {worldcups.length > 0 ? (
          <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {worldcups.map((worldcup) => (
              <WorldcupCard key={worldcup.id} worldcup={worldcup} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-gray-500">아직 등록된 월드컵이 없습니다.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
