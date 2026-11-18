import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Check, ArrowRight, HelpCircle, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Transparent Pricing & Milestones | ASHKRI Academic Solutions',
  description:
    'Transparent indicative pricing schedule for engineering projects: consultation, software, AI/ML, IoT, and documentation. Structured into 40% / 30% / 30% milestones.',
};

const ALL_NINE_PRICING_TIERS = [
  {
    tierNumber: '01',
    category: 'Project Idea Consultation',
    indicativeRange: '₹199 – ₹499',
    unit: 'per consultation session',
    description: '1-on-1 discussion to evaluate project feasibility, IEEE base paper viability, and academic evaluation criteria.',
    inclusions: ['Feasibility evaluation', 'Architecture recommendations', 'Q&A on expected examiner scrutiny'],
  },
  {
    tierNumber: '02',
    category: 'Project Title & Scope Formulation',
    indicativeRange: '₹299 – ₹599',
    unit: 'per formal proposal document',
    description: 'Refinement of project problem statement, technical abstract, objective breakdown, and system architecture flowchart.',
    inclusions: ['Formal problem statement', 'IEEE-style abstract draft', 'System block diagram'],
  },
  {
    tierNumber: '03',
    category: 'Technical Mentoring & Code Walkthrough',
    indicativeRange: '₹499 – ₹999',
    unit: 'per 60-min dedicated session',
    description: 'Line-by-line review of an existing project codebase to ensure the student thoroughly understands data flows and modules.',
    inclusions: ['Line-by-line code explanation', 'Mock viva defense cross-questioning', 'Debugging assistance'],
  },
  {
    tierNumber: '04',
    category: 'Presentation & Slide Deck Design',
    indicativeRange: '₹499 – ₹999',
    unit: 'per complete slide deck',
    description: 'Professionally structured PowerPoint slide decks formatted specifically for university project review vivas.',
    inclusions: ['15–25 structured presentation slides', 'Custom architectural flowcharts', 'Speaker defense notes'],
  },
  {
    tierNumber: '05',
    category: 'Comprehensive Documentation',
    indicativeRange: '₹799 – ₹1,499',
    unit: 'per full academic project report',
    description: 'Complete university-formatted thesis report or IEEE conference paper draft in Microsoft Word or LaTeX format.',
    inclusions: ['LaTeX / Word source files', 'Formatted references & citations', 'System diagrams & data tables'],
  },
  {
    tierNumber: '06',
    category: 'Basic Web & Prototype Assistance',
    indicativeRange: '₹3,000 – ₹5,000',
    unit: 'complete milestone lifecycle',
    description: 'Foundational web applications, frontend user interfaces, responsive landing prototypes, or static databases.',
    inclusions: ['Clean modular frontend codebase', 'Basic form validation & database writes', 'Live deployment guide'],
  },
  {
    tierNumber: '07',
    category: 'Full-Stack Software Assistance',
    indicativeRange: '₹6,000 – ₹10,000',
    unit: 'complete milestone lifecycle',
    description: 'Production-grade software architectures featuring relational databases, secure authentication, and REST/GraphQL APIs.',
    inclusions: ['Next.js / Node.js / PostgreSQL stack', 'Docker container configuration', 'Complete viva coaching session'],
  },
  {
    tierNumber: '08',
    category: 'AI & Machine Learning Guidance',
    indicativeRange: '₹7,000 – ₹15,000',
    unit: 'complete milestone lifecycle',
    description: 'Deep learning neural network design, custom dataset curation, model training pipelines, and web inference deployment.',
    inclusions: ['PyTorch / TensorFlow scripts', 'Evaluation benchmark graphs (F1, ROC)', 'Inference API & viva preparation'],
  },
  {
    tierNumber: '09',
    category: 'Hardware, Embedded & IoT Guidance',
    indicativeRange: '₹5,000 – ₹15,000+',
    unit: 'complete milestone lifecycle',
    description: 'Microcontroller firmware, sensor telemetry protocols, circuit schematic design, and cloud dashboard integration.',
    inclusions: ['Clean C/C++ firmware codebase', 'Wiring schematic diagram (KiCad)', 'Telemetry cloud dashboard configuration'],
  },
];

export default function PricingPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="brass" size="md" className="mb-4">
              Transparent Pricing Schedule
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-6">
              Clear Services.{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                Transparent Pricing.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-body">
              All project mentorship services are governed by transparent indicative ranges and a structured milestone payment schedule. You never pay for unverified work.
            </p>
          </div>
        </Container>
      </Section>

      {/* 40 / 30 / 30 Milestone Callout */}
      <Section spacing="compact" className="border-b border-seam-subtle bg-accent-terracotta/5">
        <Container>
          <div className="max-w-4xl mx-auto py-4">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-accent-action flex-shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink-primary">
                  The 40% / 30% / 30% Milestone Payment Structure
                </h2>
                <p className="text-xs sm:text-sm text-ink-secondary font-body mt-0.5">
                  Protecting both students and engineers through verified delivery checkpoints.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-editorial bg-surface-primary border border-seam-subtle shadow-sm">
                <div className="text-3xl font-heading font-extrabold text-accent-action mb-1">
                  40%
                </div>
                <h3 className="text-sm font-heading font-bold text-ink-primary mb-2">
                  Milestone 1: Project Booking
                </h3>
                <p className="text-xs text-ink-secondary font-body leading-relaxed">
                  Paid after agreeing on scope contract and architecture roadmap. Allocates dedicated engineering mentor and starts workspace development.
                </p>
              </div>

              <div className="p-5 rounded-editorial bg-surface-primary border border-seam-subtle shadow-sm">
                <div className="text-3xl font-heading font-extrabold text-accent-brass mb-1">
                  30%
                </div>
                <h3 className="text-sm font-heading font-bold text-ink-primary mb-2">
                  Milestone 2: Working Demo
                </h3>
                <p className="text-xs text-ink-secondary font-body leading-relaxed">
                  Paid only after you inspect a live, functional demonstration of the core modules and verify requirements compliance with your mentor.
                </p>
              </div>

              <div className="p-5 rounded-editorial bg-surface-primary border border-seam-subtle shadow-sm">
                <div className="text-3xl font-heading font-extrabold text-status-success mb-1">
                  30%
                </div>
                <h3 className="text-sm font-heading font-bold text-ink-primary mb-2">
                  Milestone 3: Final Handover
                </h3>
                <p className="text-xs text-ink-secondary font-body leading-relaxed">
                  Paid upon final source code transfer, report documentation delivery, and completion of the oral viva defense coaching session.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Nine Pricing Tiers Grid */}
      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink-primary mb-3">
              Complete Indicative Price Schedule
            </h2>
            <p className="text-sm text-ink-secondary font-body">
              Prices reflect individual student and project team engagements. Component hardware costs for IoT/Embedded are quoted separately based on bill-of-materials (BOM).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_NINE_PRICING_TIERS.map((tier) => (
              <Card
                key={tier.category}
                variant="default"
                hoverable
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-heading font-extrabold text-accent-brass">
                      TIER {tier.tierNumber}
                    </span>
                    <Badge variant="default" size="sm">
                      Indicative
                    </Badge>
                  </div>

                  <h3 className="text-base font-heading font-bold text-ink-primary mb-2">
                    {tier.category}
                  </h3>

                  <div className="mb-4">
                    <span className="text-2xl font-heading font-extrabold text-accent-action block">
                      {tier.indicativeRange}
                    </span>
                    <span className="text-xs text-ink-secondary/80 font-body">
                      {tier.unit}
                    </span>
                  </div>

                  <p className="text-xs text-ink-secondary font-body mb-5 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="pt-4 border-t border-seam-subtle mb-6">
                    <span className="text-[11px] uppercase tracking-wider font-heading font-semibold text-ink-secondary/70 block mb-2">
                      Deliverable Scope:
                    </span>
                    <ul className="space-y-1.5 text-xs text-ink-secondary font-body">
                      {tier.inclusions.map((inc) => (
                        <li key={inc} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-status-success flex-shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  href={`/contact?tier=${encodeURIComponent(tier.category)}`}
                  className="w-full text-xs"
                >
                  Request Exact Scope Quote
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-editorial bg-surface-elevated border border-seam-subtle max-w-3xl mx-auto flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-accent-brass flex-shrink-0 mt-0.5" />
            <div className="text-xs text-ink-secondary font-body leading-relaxed">
              <strong className="text-ink-primary font-heading">Hardware & Component Costs: </strong>
              For Embedded Systems and IoT projects requiring physical hardware, microcontroller boards (ESP32, STM32), sensors, and chassis components can either be procured directly by the student or purchased via an itemized bill-of-materials (BOM) invoice at retail cost.
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

