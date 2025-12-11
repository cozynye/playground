import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-cozy-primary text-white hover:bg-cozy-primary/90 focus:ring-cozy-primary',
    secondary:
      'bg-cozy-secondary text-white hover:bg-cozy-secondary/90 focus:ring-cozy-secondary',
    outline:
      'border-2 border-cozy-primary text-cozy-primary hover:bg-cozy-primary/10 focus:ring-cozy-primary',
    ghost:
      'text-cozy-foreground hover:bg-cozy-foreground/10 focus:ring-cozy-foreground',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
