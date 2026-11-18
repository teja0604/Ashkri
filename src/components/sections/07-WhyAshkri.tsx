import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { BookOpen, CodeXml, Milestone, MessageCircleCode } from 'lucide-react';

const DIFFERENTIATORS = [
  {
    icon: BookOpen,
    title: 'Strict Academic Integrity',
    description:
      'We do not sell pre-packaged ZIP files or generic turnkey projects. Every project is developed with the student so you deeply understand the mathematics, architecture, and code.',
  },
  {
    icon: CodeXml,
    title: 'Industry-Grade Engineering',
    description:
      'Engineered with modern, production-grade frameworks (Next.js, PyTorch, Docker, FreeRTOS). You learn real industry patterns that prepare you for tech interviews and career placements.',
  },
  {
    icon: Milestone,
    title: 'Milestone Verification',
    description:
      'We protect students through a transparent 40% booking, 30% live demonstration, and 30% final handover structure. You never pay for unverified promises.',
  },
  {
    icon: MessageCircleCode,
    title: 'Direct Engineering Mentorship',
    description:
      'Communicate directly with practicing software architects and embedded systems engineers via dedicated sessions, telegram channels, and structured code reviews.',
  },
];

export function WhyAshkriSection() {
  return (
    <Section id="why-ashkri" spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
      <Container>
        <SectionHeading
          eyebrow="The Engineering Standard"
          title="Why Final-Year Students"
          serifAccent="Trust ASHKRI."
          description="ASHKRI Academic Solutions operates on engineering rigor rather than commercial shortcuts. Here is our commitment to every engineering student."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIATORS.map((diff) => {
            const Icon = diff.icon;
            return (
              <Card
                key={diff.title}
                variant="default"
                hoverable
                className="flex flex-col justify-start"
              >
                <div className="w-11 h-11 rounded-editorial bg-accent-brass/10 border border-accent-brass/20 flex items-center justify-center text-accent-brass mb-5">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-heading font-bold text-ink-primary mb-2.5">
                  {diff.title}
                </h3>

                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-body">
                  {diff.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

