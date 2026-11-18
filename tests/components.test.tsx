import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/layout/Container';

describe('UI Primitives & Design Tokens', () => {
  it('renders Button with primary variant and triggers click event', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Discuss Project</Button>);

    const button = screen.getByRole('button', { name: /discuss project/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('bg-accent-action');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled Button and does not trigger click event', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Action
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled action/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders Badge with correct styles', () => {
    render(<Badge variant="accent">CSE Domain</Badge>);
    const badge = screen.getByText('CSE Domain');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('text-accent-action');
  });

  it('renders Card with editorial styling', () => {
    render(
      <Card variant="default" data-testid="card">
        <p>Card Content</p>
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card.className).toContain('shadow-editorial');
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders SectionHeading with eyebrow, title, and serif accent', () => {
    render(
      <SectionHeading
        eyebrow="Specializations"
        title="Engineering"
        serifAccent="Excellence"
        description="Detailed description text"
      />
    );

    expect(screen.getByText('Specializations')).toBeInTheDocument();
    expect(screen.getByText(/Engineering/)).toBeInTheDocument();
    expect(screen.getByText('Excellence')).toHaveClass('font-serif');
    expect(screen.getByText('Detailed description text')).toBeInTheDocument();
  });

  it('renders Container with max-width content class', () => {
    render(
      <Container data-testid="container">
        <div>Inner Content</div>
      </Container>
    );

    const container = screen.getByTestId('container');
    expect(container.className).toContain('max-w-content');
  });
});

