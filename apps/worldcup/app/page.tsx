import Link from 'next/link';
import { Button, Card, Layout } from '@cozy/ui';

export default function WorldcupPage() {
  return (
    <Layout
      header={
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-cozy-primary">
            Cozy
          </Link>
          <span className="text-lg font-semibold">🏆 Worldcup</span>
        </nav>
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-cozy-foreground">
            🏆 이상형 월드컵
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            나만의 이상형 월드컵을 만들고 참여해보세요
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="새 월드컵 만들기"
            description="나만의 이상형 월드컵을 만들어보세요"
          >
            <Button variant="primary" size="md">
              만들기
            </Button>
          </Card>

          <Card
            title="인기 월드컵"
            description="많은 사람들이 참여한 월드컵"
          >
            <Button variant="outline" size="md">
              참여하기
            </Button>
          </Card>

          <Card
            title="최신 월드컵"
            description="새로 만들어진 월드컵"
          >
            <Button variant="outline" size="md">
              둘러보기
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
