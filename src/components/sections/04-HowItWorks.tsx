import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { FileCheck, Users, Calculator, Code, Award } from 'lucide-react';

const HOMEPAGE_STEPS = [
  {
    step: '01',
    title: 'Submit Requirements',
    icon: FileCheck,
    description:
      'Provide your project title, college department, proposed domain, and any existing departmental guidelines or IEEE base papers.',
  },
  {
    step: '02',
    title: 'Architecture Review',
    icon: Users,
    description:
      'Our engineering lead reviews feasibility, suggests optimal modern tech stacks, and resolves scope ambiguities in an initial consultation.',
  },
  {
    step: '03',
    title: 'Transparent Milestone Quote',
    icon: Calculator,
    description:
      'Receive a transparent quotation broken into predictable 40% (booking), 30% (working demo), and 30% (final handover) milestones.',
  },
  {
    step: '04',
    title: 'Structured Implementation',
    icon: Code,
    description:
      'Work alongside experienced engineers. Regular code reviews and milestone check-ins ensure you master every technical component.',
  },
  {
    step: '05',
    title: 'Demonstration & Viva Prep',
    icon: Award,
    description:
      'Receive complete deliverables, full documentation, and personalized viva defense coaching to confidently address academic examiners.',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" spacing="default" className="border-b border-seam-subtle">
      <Container>
        <SectionHeading
          eyebrow="The Mentorship Lifecycle"
          title="Predictable. Transparent."
          serifAccent="Step-by-Step."
          description="A proven engineering lifecycle designed to eliminate last-minute project panic and ensure genuine mastery of your technical deliverables."
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {HOMEPAGE_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col p-6 rounded-editorial bg-surface-primary border border-seam-subtle shadow-editorial group hover:border-accent-brass transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading font-extrabold text-2xl text-accent-brass">
                    {item.step}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-surface-elevated border border-seam-subtle flex items-center justify-center text-ink-primary group-hover:text-accent-action transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-heading font-bold text-ink-primary mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-ink-secondary leading-relaxed font-body">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-ink-secondary font-body">
            Need the comprehensive 6-stage lifecycle detailing deliverables and milestones?{' '}
            <Link href="/how-it-works" className="text-accent-action font-semibold hover:underline">
              Explore the full How It Works guide →
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
