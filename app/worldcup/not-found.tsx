import Link from 'next/link';
import { Button, Layout } from '@/components/ui';

export default function NotFound() {
  return (
    <Layout
      header={
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/worldcup" className="text-xl font-bold text-cozy-primary">
            🏆 월드컵
          </Link>
        </nav>
      }
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-6xl">🤔</p>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          월드컵을 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-gray-600">
          요청하신 월드컵이 존재하지 않거나 비활성화되었습니다.
        </p>
        <Link href="/worldcup" className="mt-8">
          <Button>월드컵 목록으로</Button>
        </Link>
      </div>
    </Layout>
  );
}
