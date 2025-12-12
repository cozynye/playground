import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      // 모바일 퍼스트: sm=400px (초소형 모바일 ~ 일반 모바일)
      sm: '400px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        cozy: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#f59e0b',
          background: '#f8fafc',
          foreground: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float-cloud': 'floatCloud 25s linear infinite',
        'rain': 'rain 1s linear infinite',
        'snow': 'snow 5s linear infinite',
      },
      keyframes: {
        floatCloud: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        rain: {
          '0%': { transform: 'translateY(-20px)', opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0.3' },
        },
        snow: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
