import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { FaqAccordion } from './FaqAccordion';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | ASHKRI Academic Solutions',
  description:
    'Clear answers to common questions about engineering project consultation, pricing milestones, academic ethics, code revisions, and viva preparation.',
};

export default function FaqPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="brass" size="md" className="mb-4">
              Knowledge Base
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-6">
              Frequently Asked{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                Questions.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-body">
              Everything you need to know about our project guidance services, engagement milestones, revision policies, academic ethics, and viva defense coaching.
            </p>
          </div>
        </Container>
      </Section>

      {/* Accordion Sections */}
      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="max-w-4xl mx-auto">
            <FaqAccordion />
          </div>
        </Container>
      </Section>
    </div>
  );
}

