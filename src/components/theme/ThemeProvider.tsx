'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeMode, ThemeContextType } from '@/types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read initial mode from document attribute (set by ThemeScript or fallback)
    const initialMode = (document.documentElement.getAttribute('data-theme-mode') as ThemeMode) || 'system';
    let initialResolved = document.documentElement.getAttribute('data-theme') as Theme | null;
    
    if (!initialResolved) {
      if (initialMode === 'dark') {
        initialResolved = 'dark';
      } else if (initialMode === 'light') {
        initialResolved = 'light';
      } else {
        initialResolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', initialResolved);
      document.documentElement.setAttribute('data-theme-mode', initialMode);
    }
    
    setModeState(initialMode);
    setResolvedTheme(initialResolved);
    setMounted(true);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const currentMode = localStorage.getItem('ashkri-theme-mode') || 'system';
      if (currentMode === 'system') {
        const nextTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('ashkri-theme-mode', newMode);
    } catch {}

    let nextResolved: Theme = 'light';
    if (newMode === 'dark') {
      nextResolved = 'dark';
    } else if (newMode === 'light') {
      nextResolved = 'light';
    } else {
      nextResolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setResolvedTheme(nextResolved);
    document.documentElement.setAttribute('data-theme', nextResolved);
    document.documentElement.setAttribute('data-theme-mode', newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
