import React, { useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileDrawer } from '@/components/navigation/MobileDrawer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

function TestDrawerHarness({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <ThemeProvider>
      <button ref={triggerRef} onClick={() => setIsOpen(true)}>
        Open Menu
      </button>
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
      />
    </ThemeProvider>
  );
}

describe('MobileDrawer Accessibility & Interactions', () => {
  it('renders drawer dialog with aria-modal when open', () => {
    render(<TestDrawerHarness defaultOpen={true} />);

    const dialog = screen.getByRole('dialog', { name: /mobile navigation drawer/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('closes when close button is clicked', () => {
    render(<TestDrawerHarness defaultOpen={true} />);

    const closeBtn = screen.getByRole('button', { name: /close navigation menu/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when Escape key is pressed', () => {
    render(<TestDrawerHarness defaultOpen={true} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('restores focus to trigger button after closing', () => {
    render(<TestDrawerHarness defaultOpen={true} />);

    const triggerBtn = screen.getByRole('button', { name: /open menu/i });
    const closeBtn = screen.getByRole('button', { name: /close navigation menu/i });

    fireEvent.click(closeBtn);

    expect(document.activeElement).toBe(triggerBtn);
  });
});

