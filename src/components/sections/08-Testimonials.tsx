import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck, BookOpenCheck, GitPullRequest, Presentation } from 'lucide-react';

const MENTORSHIP_PILLARS = [
  {
    icon: BookOpenCheck,
    title: 'Requirement Deconstruction',
    description:
      'We review your department rubrics, IEEE base papers, and university guidelines to establish an unambiguous, achievable engineering roadmap.',
  },
  {
    icon: GitPullRequest,
    title: 'Incremental Code Reviews',
    description:
      'You develop alongside practicing engineers with modular Git branches, clean comments, and industry-standard design patterns.',
  },
  {
    icon: Presentation,
    title: 'Viva Defense Simulations',
    description:
      'Detailed oral exam coaching focusing on system bottlenecks, algorithm complexity, alternative architectures, and examiner defense.',
  },
  {
    icon: ShieldCheck,
    title: 'Strict Anti-Plagiarism Policy',
    description:
      'Every line of code and documentation report is custom-crafted to your specific requirements, adhering strictly to university academic ethics.',
  },
];

export function TestimonialsSection() {
  return (
    <Section id="mentorship-standards" spacing="default" className="border-b border-seam-subtle">
      <Container>
        <SectionHeading
          eyebrow="Pedagogical Integrity"
          title="Engineered for"
          serifAccent="Academic Excellence."
          description="Our structured mentorship methodology ensures that students genuinely understand and can confidently defend their technical systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MENTORSHIP_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.title}
                variant="default"
                hoverable
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-editorial bg-accent-terracotta/10 border border-accent-terracotta/20 flex items-center justify-center text-accent-action mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-heading font-bold text-ink-primary mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed font-body">
                    {pillar.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 p-5 rounded-editorial bg-surface-elevated border border-seam-subtle text-center max-w-2xl mx-auto">
          <p className="text-xs text-ink-secondary leading-relaxed font-body">
            <strong>Publication Ethics Charter:</strong> ASHKRI Academic Solutions does not publish simulated testimonials or fabricated academic marks. Genuine verified student case studies will appear following documented evaluation cycles and explicit student publication consent.
          </p>
        </div>
      </Container>
    </Section>
  );
}
