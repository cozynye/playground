import type { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Layout({
  children,
  header,
  footer,
  className = '',
}: LayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {header && (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          {header}
        </header>
      )}
      <main className="flex-1">{children}</main>
      {footer && (
        <footer className="border-t border-gray-200 bg-gray-50">{footer}</footer>
      )}
    </div>
  );
}
