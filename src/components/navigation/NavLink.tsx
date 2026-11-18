import React from 'react';
import Link from 'next/link';

export interface NavLinkProps {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NavLink({
  href,
  label,
  isActive = false,
  onClick,
  className = '',
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative inline-flex items-center text-sm font-heading font-medium transition-colors duration-200 py-1.5 px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action ${
        isActive
          ? 'text-accent-action font-semibold'
          : 'text-ink-secondary hover:text-ink-primary'
      } ${className}`}
    >
      {label}
      {isActive && (
        <span
          className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent-action rounded-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

