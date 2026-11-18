import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Check, ShieldCheck } from 'lucide-react';

const PRICING_TIERS = [
  {
    category: 'Consultation & Planning',
    price: '₹199 – ₹599',
    unit: 'per session / scope',
    description: 'Initial project feasibility, IEEE base paper review, problem formulation, and architecture roadmap.',
    inclusions: ['Feasibility evaluation', 'Architecture diagram', 'Guidance on viva expectations'],
  },
  {
    category: 'Documentation & Slide Decks',
    price: '₹499 – ₹1,499',
    unit: 'per deliverable',
    description: 'Complete academic project reports adhering strictly to your university formatting guidelines and IEEE templates.',
    inclusions: ['LaTeX / Word source files', 'System diagrams', 'Plagiarism verification report'],
  },
  {
    category: 'Full-Stack Software Assistance',
    price: '₹6,000 – ₹10,000',
    unit: 'complete project lifecycle',
    description: 'Comprehensive software development mentoring with modern relational databases, clean APIs, and cloud deployment.',
    inclusions: ['End-to-end source code', 'Live demo deployment', 'Code walkthrough sessions'],
  },
  {
    category: 'AI / ML & Deep Learning',
    price: '₹7,000 – ₹15,000',
    unit: 'complete project lifecycle',
    description: 'Specialized guidance in training custom neural networks, dataset curation, validation benchmarking, and model serving.',
    inclusions: ['Jupyter / Python pipelines', 'Trained weights & graphs', 'Detailed viva defense coaching'],
  },
];

export function PricingOverviewSection() {
  return (
    <Section id="pricing" spacing="default" className="border-b border-seam-subtle">
      <Container>
        <SectionHeading
          eyebrow="Transparent Investment"
          title="Clear Services."
          serifAccent="Transparent Pricing."
          description="No hidden fees or unexpected costs. All project engagements follow clear indicative ranges, with milestone-based billing tied directly to verifiable progress."
        />

        {/* Milestone Payment Callout */}
        <div className="mb-12 p-6 rounded-editorial bg-accent-terracotta/5 border border-accent-terracotta/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-accent-action flex-shrink-0" />
            <div>
              <h4 className="text-base font-heading font-bold text-ink-primary">
                Predictable 40% / 30% / 30% Milestone Framework
              </h4>
              <p className="text-xs sm:text-sm text-ink-secondary font-body">
                Pay 40% at booking, 30% only after inspecting a live working demonstration, and 30% upon final source code and documentation handover.
              </p>
            </div>
          </div>
          <Badge variant="accent" size="md" className="flex-shrink-0">
            Zero Unverified Payments
          </Badge>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.category}
              variant="default"
              hoverable
              className="flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-heading font-bold text-ink-primary mb-2">
                  {tier.category}
                </h3>
                <div className="mb-3">
                  <span className="text-2xl font-heading font-extrabold text-accent-action">
                    {tier.price}
                  </span>
                  <span className="text-xs text-ink-secondary/80 block font-body">
                    {tier.unit}
                  </span>
                </div>
                <p className="text-xs text-ink-secondary font-body mb-5 leading-relaxed">
                  {tier.description}
                </p>

                <div className="pt-4 border-t border-seam-subtle">
                  <span className="text-[11px] uppercase tracking-wider font-heading font-semibold text-ink-secondary/70 block mb-2">
                    Inclusions:
                  </span>
                  <ul className="text-xs text-ink-secondary space-y-1.5 mb-6">
                    {tier.inclusions.map((inc) => (
                      <li key={inc} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-status-success flex-shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                href="#contact"
                className="w-full text-xs"
              >
                Request Exact Scope Quote
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
