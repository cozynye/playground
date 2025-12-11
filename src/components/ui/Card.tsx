import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function Card({
  title,
  description,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-cozy-foreground">{title}</h3>
      )}
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
