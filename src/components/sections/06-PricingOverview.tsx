import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const MILESTONE_PILLARS = [
  {
    percentage: '40%',
    title: 'Milestone 1: Booking',
    description: 'Scope bounding, technical feasibility review, and architecture roadmap.',
    color: 'text-accent-action',
  },
  {
    percentage: '30%',
    title: 'Milestone 2: Working Demo',
    description: 'Paid only after inspecting a live, functioning prototype of core modules.',
    color: 'text-accent-brass',
  },
  {
    percentage: '30%',
    title: 'Milestone 3: Final Handover',
    description: 'Source code transfer, full thesis report, and 1-on-1 viva defense coaching.',
    color: 'text-status-success',
  },
];

const COMPACT_PRICE_RANGES = [
  { category: 'Idea Consultation & Planning', range: '₹199 – ₹599', note: 'per session' },
  { category: 'Documentation & Slide Decks', range: '₹499 – ₹1,499', note: 'per deliverable' },
  { category: 'Full-Stack Software Assistance', range: '₹6,000 – ₹10,000', note: 'complete project' },
  { category: 'AI, ML & Embedded / IoT', range: '₹5,000 – ₹15,000+', note: 'complete project' },
];

export function PricingOverviewSection() {
  return (
    <Section id="pricing" spacing="default" className="border-b border-seam-subtle">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <SectionHeading
            eyebrow="Transparent Investment"
            title="Clear Services."
            serifAccent="Transparent Pricing."
            description="No hidden fees or unexpected costs. All project engagements follow clear indicative ranges, with milestone-based billing tied directly to verifiable progress."
            className="mb-0"
          />
          <Button variant="secondary" size="md" href="/pricing" className="flex-shrink-0 self-start md:self-end">
            View All 9 Pricing Tiers →
          </Button>
        </div>

        {/* Milestone Payment Framework Card */}
        <div className="mb-10 p-6 sm:p-8 rounded-editorial bg-accent-terracotta/5 border border-accent-terracotta/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-seam-subtle">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-accent-action flex-shrink-0" />
              <div>
                <h3 className="text-lg font-heading font-bold text-ink-primary">
                  The 40% / 30% / 30% Milestone Framework
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary font-body">
                  Protecting students through verified delivery checkpoints. You never pay for unverified promises.
                </p>
              </div>
            </div>
            <Badge variant="accent" size="md" className="self-start sm:self-auto flex-shrink-0">
              Milestone Protected
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MILESTONE_PILLARS.map((m) => (
              <div key={m.title} className="p-4 rounded-editorial bg-surface-primary border border-seam-subtle">
                <span className={`text-2xl font-heading font-extrabold ${m.color} block mb-1`}>
                  {m.percentage}
                </span>
                <h4 className="text-sm font-heading font-bold text-ink-primary mb-1.5">
                  {m.title}
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed font-body">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Indicative Range Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {COMPACT_PRICE_RANGES.map((tier) => (
            <Card key={tier.category} hoverable className="p-5 flex flex-col justify-between group">
              <div>
                <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-accent-brass block mb-1">
                  {tier.note}
                </span>
                <h4 className="text-sm font-heading font-bold text-ink-primary mb-2">
                  {tier.category}
                </h4>
              </div>
              <div className="pt-3 border-t border-seam-subtle flex items-baseline justify-between">
                <span className="text-lg font-heading font-extrabold text-accent-action">
                  {tier.range}
                </span>
                <Link
                  href="/pricing"
                  className="text-xs text-ink-secondary hover:text-accent-action font-heading font-medium flex items-center gap-0.5"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-editorial bg-surface-elevated/40 border border-seam-subtle gap-3 sm:gap-4 text-left">
          <p className="text-xs sm:text-sm text-ink-secondary font-body">
            Need an itemized scope quotation based on your university guidelines and hardware needs?
          </p>
          <div className="w-full sm:w-auto flex items-center justify-start flex-shrink-0">
            <Button variant="primary" size="sm" href="/contact" className="w-full sm:w-auto">
              Request Scope Quote
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
