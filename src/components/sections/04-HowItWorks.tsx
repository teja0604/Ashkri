import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileCheck, Users, Calculator, Code, Award, ArrowRight } from 'lucide-react';

const HOMEPAGE_STEPS = [
  {
    step: '01',
    title: 'Submit Requirements',
    icon: FileCheck,
    summary: 'Share your proposed project topic, university guidelines, syllabus rubrics, or IEEE base paper.',
  },
  {
    step: '02',
    title: 'Architecture Consultation',
    icon: Users,
    summary: '1-on-1 discussion with an engineering lead to validate feasibility, design system flows, and choose modern stacks.',
  },
  {
    step: '03',
    title: 'Milestone Scope Quote',
    icon: Calculator,
    summary: 'Receive an itemized scope contract governed by a protected 40% booking, 30% demo, and 30% handover structure.',
  },
  {
    step: '04',
    title: 'Guided Implementation',
    icon: Code,
    summary: 'Develop alongside practicing engineers with regular code reviews, clean architecture, and modular Git commits.',
  },
  {
    step: '05',
    title: 'Live Demo & Viva Coaching',
    icon: Award,
    summary: 'Verify running system outputs, receive complete thesis documentation, and prepare through mock viva defense sessions.',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" spacing="default" className="border-b border-seam-subtle">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <SectionHeading
            eyebrow="The Mentorship Lifecycle"
            title="Predictable. Transparent."
            serifAccent="Step-by-Step."
            description="A structured engineering process engineered to eliminate last-minute project panic and ensure complete technical mastery."
            className="mb-0"
          />
          <Button variant="secondary" size="md" href="/how-it-works" className="flex-shrink-0 self-start md:self-end">
            View Full 6-Stage Process →
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {HOMEPAGE_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.step}
                hoverable
                className="flex flex-col justify-between p-5 sm:p-6 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading font-extrabold text-2xl text-accent-brass group-hover:text-accent-action transition-colors">
                      {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-surface-elevated border border-seam-subtle flex items-center justify-center text-ink-primary group-hover:text-accent-action transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-heading font-bold text-ink-primary mb-2 group-hover:text-accent-action transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ink-secondary leading-relaxed font-body">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-seam-subtle">
                  <span className="text-[11px] font-heading font-semibold text-accent-brass uppercase tracking-wider">
                    Stage {item.step}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 sm:p-5 rounded-editorial bg-surface-elevated/60 border border-seam-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-left">
          <p className="text-xs sm:text-sm text-ink-secondary font-body">
            Want to see what you provide vs what ASHKRI delivers at each stage?
          </p>
          <Link
            href="/how-it-works"
            className="inline-flex items-center text-xs sm:text-sm font-heading font-semibold text-accent-action hover:underline gap-1 text-balance"
          >
            <span>Explore the complete 6-stage lifecycle guide</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
