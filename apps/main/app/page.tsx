import Link from 'next/link';
import { Button, Card, Layout } from '@cozy/ui';

const services = [
  {
    title: 'Worldcup',
    description: '이상형 월드컵 서비스',
    href: '/worldcup',
    emoji: '🏆',
  },
];

export default function HomePage() {
  return (
    <Layout
      header={
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-cozy-primary">
            Cozy
          </Link>
          <div className="flex gap-4">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="text-sm text-gray-600 hover:text-cozy-primary transition-colors"
              >
                {service.title}
              </Link>
            ))}
          </div>
        </nav>
      }
      footer={
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 Cozy. All rights reserved.</p>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-cozy-foreground sm:text-6xl">
            Welcome to <span className="text-cozy-primary">Cozy</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            다양한 서비스를 하나의 플랫폼에서 만나보세요
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.href} href={service.href} className="group">
              <Card
                className="h-full transition-all group-hover:border-cozy-primary group-hover:shadow-lg"
                title={`${service.emoji} ${service.title}`}
                description={service.description}
              >
                <Button variant="outline" size="sm" className="mt-2">
                  바로가기 →
                </Button>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
