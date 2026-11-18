import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  serifAccent?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  serifAccent,
  description,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const alignClasses = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col max-w-3xl mb-10 md:mb-14 ${alignClasses} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs md:text-sm font-heading font-semibold tracking-widest uppercase text-accent-terracotta mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-[1.15] font-heading font-bold text-ink-primary tracking-tight">
        {title} {serifAccent && <span className="font-serif italic font-normal text-accent-brass">{serifAccent}</span>}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-ink-secondary leading-relaxed font-body">
          {description}
        </p>
      )}
    </div>
  );
}

