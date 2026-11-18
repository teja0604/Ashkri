'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'brass';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      href,
      target,
      rel,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-heading font-medium tracking-normal transition-all duration-200 rounded-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';

    const sizeStyles = {
      sm: 'text-xs md:text-sm px-3.5 py-2 min-h-[38px] gap-1.5',
      md: 'text-sm md:text-base px-5 py-2.5 min-h-[44px] gap-2',
      lg: 'text-base md:text-lg px-6 py-3.5 min-h-[50px] gap-2.5 font-semibold',
    }[size];

    const variantStyles = {
      primary:
        'bg-accent-action text-white dark:text-[#121A22] hover:bg-accent-action/90 shadow-sm hover:shadow active:scale-[0.99]',
      secondary:
        'bg-surface-primary/70 border border-seam-strong text-ink-primary hover:bg-surface-elevated hover:border-ink-secondary/40 active:scale-[0.99]',
      ghost:
        'bg-transparent text-ink-primary hover:bg-surface-elevated active:bg-surface-primary',
      brass:
        'bg-accent-brass text-[#121A22] hover:bg-accent-brass/90 shadow-sm hover:shadow active:scale-[0.99] font-semibold',
    }[variant];

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={target === '_blank' && !rel ? 'noopener noreferrer' : rel}
          className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
