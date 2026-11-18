'use client';

import React, { useRef, useCallback, useEffect } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
  hoverable?: boolean;
  tilt?: boolean;
  glow?: boolean;
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  hoverable = false,
  tilt = true,
  glow = true,
  className = '',
  style,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  ...props
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReducedMotion.current = mq.matches;
      const listener = (e: MediaQueryListEvent) => {
        isReducedMotion.current = e.matches;
      };
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(e);
      if (e.pointerType === 'touch' || !hoverable || isReducedMotion.current) return;
      if (cardRef.current) {
        cardRef.current.style.willChange = 'transform';
        cardRef.current.style.zIndex = '10';
      }
    },
    [hoverable, onPointerEnter]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e);
      if (e.pointerType === 'touch' || !hoverable || isReducedMotion.current || !tilt) return;

      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      const py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);

      // Relative offset from center (-0.5 to +0.5)
      const xOffset = px - 0.5;
      const yOffset = py - 0.5;

      // Controlled subtle directional tilt: 4.5 degrees max
      const maxTilt = 4.5;
      const rotY = Number((xOffset * maxTilt * 2).toFixed(2));
      const rotX = Number((-yOffset * maxTilt * 2).toFixed(2));

      // Direct DOM update for 60-120fps jank-free performance
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(var(--card-hover-lift, -3px))`;
      card.style.setProperty('--glow-x', `${Math.round(px * 100)}%`);
      card.style.setProperty('--glow-y', `${Math.round(py * 100)}%`);
    },
    [hoverable, tilt, onPointerMove]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(e);
      const card = cardRef.current;
      if (!card) return;

      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.willChange = 'auto';
      card.style.zIndex = '';
    },
    [onPointerLeave]
  );

  const variantStyles = {
    default: 'bg-surface-primary border border-seam-subtle shadow-editorial',
    elevated: 'bg-surface-elevated border border-seam-subtle shadow-editorial-elevated',
    bordered: 'bg-transparent border border-seam-strong',
  }[variant];

  const hoverClasses = hoverable
    ? 'relative group transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--card-border-hover)] hover:shadow-[var(--shadow-card-hover)]'
    : '';

  return (
    <div
      ref={cardRef}
      data-card="true"
      data-hoverable={hoverable ? 'true' : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`rounded-editorial p-6 sm:p-7 md:p-8 ${variantStyles} ${hoverClasses} ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      {/* Restrained directional glow backdrop (CSS-driven opacity via group-hover) */}
      {hoverable && glow && (
        <div
          className="absolute inset-0 rounded-editorial pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle 260px at var(--glow-x, 50%) var(--glow-y, 50%), var(--card-glow-color), transparent 75%)',
            zIndex: 0,
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
