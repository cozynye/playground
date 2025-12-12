import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cozy - Multi-Service Platform',
  description: '다양한 서비스를 하나의 공간에서 즐기세요. 이상형 월드컵과 더 많은 서비스가 준비되어 있습니다.',
  keywords: ['Cozy', '월드컵', '이상형월드컵', '서비스 플랫폼', '게임'],
  authors: [{ name: 'Cozy Team' }],
  creator: 'Cozy Team',
  publisher: 'Cozy',
  metadataBase: new URL('https://cozy.example.com'),
  openGraph: {
    title: 'Cozy - Multi-Service Platform',
    description: '다양한 서비스를 하나의 공간에서 즐기세요. 이상형 월드컵과 더 많은 서비스가 준비되어 있습니다.',
    url: 'https://cozy.example.com',
    siteName: 'Cozy',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Cozy - 다양한 서비스 플랫폼',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cozy - Multi-Service Platform',
    description: '다양한 서비스를 하나의 공간에서 즐기세요.',
    images: ['/og-home.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'mJkJTBBd_7dbU9mLZXwirvRk_8r34RENokY5OZPTz4A',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
