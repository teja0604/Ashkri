import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  spacing?: 'default' | 'compact' | 'none';
}

export function Section({
  children,
  className = '',
  id,
  spacing = 'default',
  ...props
}: SectionProps) {
  const spacingClasses = {
    default: 'py-14 sm:py-16 md:py-20 lg:py-24',
    compact: 'py-8 sm:py-10 md:py-12',
    none: 'py-0',
  }[spacing];

  return (
    <section
      id={id}
      className={`relative w-full ${spacingClasses} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

