'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeMode } from '@/types/theme';

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a matching placeholder during SSR to prevent layout shifts
    return (
      <div 
        className="inline-flex items-center p-1 rounded-full border border-seam bg-surface-primary/80 backdrop-blur-sm"
        aria-hidden="true"
      >
        <div className="w-7 h-7 rounded-full" />
        <div className="w-7 h-7 rounded-full" />
        <div className="w-7 h-7 rounded-full" />
      </div>
    );
  }

  const modes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light mode', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'dark', label: 'Dark mode', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'system', label: 'System preference', icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selection"
      className="inline-flex items-center p-1 rounded-full border border-seam bg-surface-primary/80 backdrop-blur-sm transition-colors duration-200"
    >
      {modes.map((item) => {
        const isActive = mode === item.id;
        return (
          <button
            key={item.id}
            role="radio"
            aria-checked={isActive}
            aria-label={item.label}
            title={item.label}
            onClick={() => setMode(item.id)}
            className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action ${
              isActive
                ? 'bg-accent-action text-white shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-elevated'
            }`}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
}

