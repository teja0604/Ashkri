import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/theme/ThemeProvider';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';

function ThemeConsumer() {
  const { mode, resolvedTheme, setMode } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setMode('dark')}>Set Dark</button>
      <button onClick={() => setMode('light')}>Set Light</button>
      <button onClick={() => setMode('system')}>Set System</button>
    </div>
  );
}

describe('Theme Engine & Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-mode');
  });

  it('renders with system mode by default and resolves to light when OS is not dark', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode').textContent).toBe('system');
    expect(screen.getByTestId('resolved').textContent).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('switches to dark mode and updates document attributes and localStorage', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Set Dark'));
    });

    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('dark');
    expect(localStorage.getItem('ashkri-theme-mode')).toBe('dark');
  });

  it('switches to light mode and updates document attributes and localStorage', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Set Dark'));
      fireEvent.click(screen.getByText('Set Light'));
    });

    expect(screen.getByTestId('mode').textContent).toBe('light');
    expect(screen.getByTestId('resolved').textContent).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('light');
    expect(localStorage.getItem('ashkri-theme-mode')).toBe('light');
  });

  it('ThemeSwitcher radio buttons change theme correctly', async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const darkRadio = await screen.findByRole('radio', { name: /dark mode/i });
    await act(async () => {
      fireEvent.click(darkRadio);
    });

    expect(darkRadio).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('ashkri-theme-mode')).toBe('dark');
  });
});

