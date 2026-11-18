import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className = '',
  as: Component = 'div',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`w-full max-w-content mx-auto px-5 md:px-8 lg:px-12 xl:px-16 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

