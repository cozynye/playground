import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@cozy/ui'],

  async rewrites() {
    // 개발 환경에서는 각 앱이 다른 포트에서 실행됨
    // 프로덕션에서는 Vercel이 각 앱을 별도 배포 후 연결
    const isDev = process.env.NODE_ENV === 'development';

    const worldcupUrl = isDev
      ? 'http://localhost:3001'
      : process.env.WORLDCUP_URL || '';

    return {
      beforeFiles: [
        {
          source: '/worldcup',
          destination: `${worldcupUrl}/worldcup`,
        },
        {
          source: '/worldcup/:path*',
          destination: `${worldcupUrl}/worldcup/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
