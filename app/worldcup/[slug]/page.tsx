import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/ui';
import { WorldcupGame, getWorldcupBySlug, getAllWorldcupSlugs } from '@/features/worldcup';

export async function generateStaticParams() {
  const slugs = getAllWorldcupSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getWorldcupBySlug(slug);

  if (!config) {
    return { title: '월드컵을 찾을 수 없습니다' };
  }

  const { metadata } = config;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      images: [{ url: metadata.ogImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [metadata.ogImage],
    },
  };
}

interface WorldcupPlayPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ autostart?: string }>;
}

export default async function WorldcupPlayPage({ params, searchParams }: WorldcupPlayPageProps) {
  const { slug } = await params;
  const { autostart } = await searchParams;
  const config = getWorldcupBySlug(slug);
  const shouldAutoStart = autostart === 'true';

  if (!config) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cozy.example.com';
  const currentUrl = `${baseUrl}/worldcup/${slug}`;

  return (
    <Layout
      header={
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/worldcup" className="text-xl font-bold text-cozy-primary">
            🏆 월드컵
          </Link>
          <Link
            href="/worldcup"
            className="text-sm text-gray-600 transition-colors hover:text-cozy-primary"
          >
            목록으로
          </Link>
        </nav>
      }
      footer={
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 Cozy. All rights reserved.</p>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl px-6 py-8">
        <WorldcupGame config={config} currentUrl={currentUrl} autoStart={shouldAutoStart} />
      </div>
    </Layout>
  );
}
