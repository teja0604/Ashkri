'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';
import { Button } from '../ui/Button';
import { ALL_NAV_ITEMS } from '@/types/navigation';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileDrawer({ isOpen, onClose, triggerRef }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
      id="mobile-navigation-drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-sm h-full bg-surface-primary border-l border-seam-subtle shadow-2xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-seam-subtle">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded overflow-hidden bg-black flex-shrink-0">
                <Image
                  src="/assets/brand/ashkri-logo.png"
                  alt="ASHKRI Logo"
                  fill
                  className="object-contain p-0.5"
                  sizes="32px"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-sm tracking-wider text-ink-primary leading-tight">
                  ASHKRI
                </span>
                <span className="text-[10px] uppercase tracking-widest text-accent-brass font-medium leading-none">
                  Academic Solutions
                </span>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col py-6 space-y-1" aria-label="Mobile main navigation">
            {ALL_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center text-base font-heading font-medium text-ink-primary hover:text-accent-action py-2.5 px-3 rounded-editorial transition-colors min-h-[44px] hover:bg-surface-elevated"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-seam-subtle flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-heading font-medium text-ink-secondary">Theme</span>
            <ThemeSwitcher />
          </div>

          <Button
            variant="primary"
            size="lg"
            href="/contact"
            className="w-full"
            onClick={onClose}
          >
            Get Project Assistance
          </Button>

          <p className="text-xs text-center text-ink-secondary/70">
            A division of <span className="font-semibold text-ink-secondary">ASHKRI Technologies</span>
          </p>
        </div>
      </div>
    </div>
  );
}
