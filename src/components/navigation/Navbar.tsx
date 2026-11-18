'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { NavLink } from './NavLink';
import { MobileDrawer } from './MobileDrawer';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';
import { MAIN_NAV_ITEMS } from '@/types/navigation';

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-bg-primary/90 backdrop-blur-md border-b border-seam-subtle transition-colors duration-200">
        <Container>
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Title */}
            <Link
              href="/"
              className="flex items-center gap-3.5 group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action py-1 px-1 -ml-1"
              aria-label="ASHKRI Academic Solutions - Homepage"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-editorial overflow-hidden bg-[#100E0E] border border-seam-strong flex-shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/assets/brand/ashkri-logo.png"
                  alt="ASHKRI Technologies Emblem"
                  fill
                  priority
                  className="object-contain p-0.5"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-base sm:text-lg tracking-wider text-ink-primary leading-tight">
                  ASHKRI
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-accent-brass font-medium leading-none">
                  Academic Solutions
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden lg:flex items-center gap-6 xl:gap-8"
              aria-label="Desktop primary navigation"
            >
              {MAIN_NAV_ITEMS.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </nav>

            {/* Desktop Right Actions (Theme Switcher + CTA) */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeSwitcher />
              <Button
                variant="primary"
                size="md"
                onClick={scrollToContact}
                className="shadow-sm"
              >
                Get Assistance
              </Button>
            </div>

            {/* Mobile Controls (Theme Switcher + Hamburger) */}
            <div className="flex lg:hidden items-center gap-2.5">
              <ThemeSwitcher />
              <button
                ref={triggerRef}
                onClick={() => setIsMobileOpen(true)}
                className="p-2 rounded-editorial text-ink-primary hover:bg-surface-elevated transition-colors border border-seam-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Open mobile navigation menu"
                aria-expanded={isMobileOpen}
                aria-controls="mobile-navigation-drawer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Accessible Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        triggerRef={triggerRef}
      />
    </>
  );
}

