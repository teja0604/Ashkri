import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Target, Award, Compass, ArrowRight, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | ASHKRI Academic Solutions',
  description:
    'Learn about ASHKRI Academic Solutions, our parent organization ASHKRI Technologies, our engineering mentoring philosophy, and our academic ethics charter.',
};

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="accent" size="md" className="mb-4">
              Corporate & Academic Profile
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-6">
              Engineering Intelligence.{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                Enabling Innovation.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-body">
              ASHKRI Academic Solutions is an academic technology services initiative operated by ASHKRI Technologies, dedicated to providing final-year engineering students across India with genuine technical mentoring and architectural guidance.
            </p>
          </div>
        </Container>
      </Section>

      {/* Corporate Relationship & Mission */}
      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-7">
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-accent-brass mb-3 block">
                Parent Brand Identity
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink-primary mb-5">
                The Academic Engineering Arm of ASHKRI Technologies
              </h2>
              <p className="text-sm text-ink-secondary font-body leading-relaxed mb-4">
                ASHKRI Technologies was founded with the conviction that theoretical undergraduate coursework often leaves an avoidable gap between academic degree requirements and industry engineering expectations.
              </p>
              <p className="text-sm text-ink-secondary font-body leading-relaxed mb-6">
                ASHKRI Academic Solutions serves as the bridge: connecting final-year students with practicing software architects, machine learning engineers, and embedded firmware specialists. We guide students through the exact methodologies, tools, and design patterns used in real-world technology consultancies.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded bg-surface-elevated border border-seam-subtle">
                  <h3 className="text-xs font-heading font-bold text-ink-primary uppercase tracking-wider mb-1">
                    Pan-India Reach
                  </h3>
                  <p className="text-xs text-ink-secondary font-body">
                    Supporting undergraduate and postgraduate engineering candidates across premier state, central, and private engineering institutions.
                  </p>
                </div>
                <div className="p-4 rounded bg-surface-elevated border border-seam-subtle">
                  <h3 className="text-xs font-heading font-bold text-ink-primary uppercase tracking-wider mb-1">
                    Industry Toolchains
                  </h3>
                  <p className="text-xs text-ink-secondary font-body">
                    Instruction in modern stacks: Next.js, PyTorch, FreeRTOS, Docker, PostgreSQL, and IEEE standard LaTeX typesetting.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl bg-gradient-to-br from-[#100E0E] to-[#1C1718] border border-seam-strong p-8 flex flex-col justify-between shadow-editorial-elevated">
                <div className="flex items-center justify-between text-xs text-white/50 font-heading">
                  <span className="font-bold text-accent-brass">ASHKRI TECHNOLOGIES</span>
                  <span>EST. BRAND</span>
                </div>

                <div className="relative w-48 h-48 mx-auto my-auto">
                  <Image
                    src="/assets/brand/ashkri-logo.png"
                    alt="ASHKRI Technologies Official Monogram"
                    fill
                    className="object-contain"
                    sizes="200px"
                  />
                </div>

                <p className="text-[11px] text-center text-white/60 font-heading tracking-wide border-t border-white/10 pt-3">
                  Your Project Idea. Our Technical Guidance.
                </p>
              </div>
            </div>
          </div>

          {/* Academic Integrity Charter */}
          <div className="rounded-editorial bg-surface-primary border border-seam-subtle p-8 md:p-12 shadow-editorial">
            <div className="max-w-3xl mb-8">
              <Badge variant="accent" size="sm" className="mb-3">
                Ethical Service Boundaries
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink-primary mb-4">
                Our Academic Ethics & Integrity Charter
              </h2>
              <p className="text-sm text-ink-secondary font-body leading-relaxed">
                We believe that authentic engineering assistance must uphold the highest standards of academic honesty. We do not participate in predatory project sales or academic misrepresentation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded bg-surface-elevated/40 border border-seam-subtle">
                <ShieldCheck className="w-6 h-6 text-status-success mb-3" />
                <h3 className="text-sm font-heading font-bold text-ink-primary mb-2">
                  No Turnkey Project Downloads
                </h3>
                <p className="text-xs text-ink-secondary font-body leading-relaxed">
                  We strictly reject selling recycled, pre-compiled ZIP files. Every project engagement is tailored, custom-engineered, and mentored alongside the student.
                </p>
              </div>

              <div className="p-5 rounded bg-surface-elevated/40 border border-seam-subtle">
                <Compass className="w-6 h-6 text-accent-action mb-3" />
                <h3 className="text-sm font-heading font-bold text-ink-primary mb-2">
                  Student Mastery Obligation
                </h3>
                <p className="text-xs text-ink-secondary font-body leading-relaxed">
                  Our engagement requires students to participate in code walkthroughs and viva defense coaching. You must understand your project thoroughly.
                </p>
              </div>

              <div className="p-5 rounded bg-surface-elevated/40 border border-seam-subtle">
                <Award className="w-6 h-6 text-accent-brass mb-3" />
                <h3 className="text-sm font-heading font-bold text-ink-primary mb-2">
                  No Guaranteed Marks or Grades
                </h3>
                <p className="text-xs text-ink-secondary font-body leading-relaxed">
                  We guarantee rigorous technical architecture, clean code, and thorough preparation. Final evaluation marks are determined solely by your university examiners.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-seam-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-ink-secondary font-body">
                Have specific departmental rubrics or university requirements?
              </span>
              <Button variant="primary" size="md" href="/contact">
                Contact Our Academic Coordinators
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

