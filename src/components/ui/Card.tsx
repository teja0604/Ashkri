import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
  hoverable?: boolean;
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-surface-primary border border-seam-subtle shadow-editorial',
    elevated: 'bg-surface-elevated border border-seam-subtle shadow-editorial-elevated',
    bordered: 'bg-transparent border border-seam-strong',
  }[variant];

  const hoverStyles = hoverable
    ? 'hover:border-accent-terracotta/40 hover:shadow-editorial-elevated hover:-translate-y-0.5 transition-all duration-300'
    : '';

  return (
    <div
      className={`rounded-editorial p-6 sm:p-7 md:p-8 ${variantStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

