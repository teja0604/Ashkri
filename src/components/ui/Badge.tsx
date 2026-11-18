import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'brass' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide',
  }[size];

  const variantStyles = {
    default: 'bg-surface-elevated text-ink-secondary border border-seam-subtle',
    accent: 'bg-accent-terracotta/10 text-accent-action border border-accent-terracotta/20 font-medium',
    brass: 'bg-accent-brass/10 text-accent-brass border border-accent-brass/25 font-medium',
    outline: 'bg-transparent text-ink-primary border border-seam-strong',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-heading uppercase font-semibold rounded-full select-none ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

