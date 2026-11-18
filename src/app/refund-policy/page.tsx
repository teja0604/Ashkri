import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | ASHKRI Academic Solutions',
  description:
    'Milestone-based refund and cancellation terms for engineering project engagements at ASHKRI Academic Solutions.',
};

export default function RefundPolicyPage() {
  return (
    <div className="w-full">
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="default" size="sm" className="mb-4">
              Commercial Policy · Effective November 2026
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-4">
              Refund & Cancellation Policy
            </h1>
            <p className="text-sm text-ink-secondary font-body">
              Our milestone structure is designed specifically to prevent financial disputes by ensuring you only pay for verified, demonstrated progress.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8 text-sm text-ink-secondary font-body leading-relaxed">
            {/* Ratification Notice Banner */}
            <div className="p-4 rounded-editorial bg-surface-elevated border border-accent-brass/40 text-ink-primary text-xs sm:text-sm font-body leading-relaxed">
              <span className="font-heading font-bold text-accent-brass uppercase tracking-wider text-xs block mb-1">
                Notice of Commercial Policy Ratification
              </span>
              <p className="text-ink-secondary">
                Commercial refund percentages and timelines presented below are proposed terms subject to formal business ratification prior to commercial checkout activation in subsequent phases.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                1. Milestone-Gated Protection
              </h2>
              <p>
                Unlike generic commercial services that demand 100% upfront payment, ASHKRI operates on an explicit 40% / 30% / 30% milestone structure. This guarantees that payments are tied directly to tangible verification gates.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                2. Cancellation Prior to Engineering Commencement
              </h2>
              <p>
                If a student requests project cancellation within 48 hours of paying Milestone 1 and prior to active development or mentor allocation, a refund of 80% of Milestone 1 will be issued (20% retained for administrative feasibility evaluation and architectural assessment).
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                3. Milestone 1 (Active Development Stage)
              </h2>
              <p>
                Once active development and dedicated mentor hours have commenced, Milestone 1 (40% booking advance) is non-refundable, as engineering labor, code scaffolding, and mentor time have already been expended.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                4. Milestone 2 (Live Demonstration Verification Gate)
              </h2>
              <p>
                Milestone 2 (30%) is due only after you inspect a live, working demonstration of the core modules. If our engineering team is unable to demonstrate a working system conforming to the agreed scope document, you are under no obligation to pay Milestone 2, and the engagement may be terminated with zero further liability.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                5. Milestone 3 (Final Handover & Viva Coaching)
              </h2>
              <p>
                Once the final codebase, full LaTeX/Word documentation report, presentation slides, and viva coaching session have been completed and delivered, Milestone 3 (30%) is non-refundable.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                6. Refund Processing Timeline
              </h2>
              <p>
                Approved refunds are processed via the original payment method (UPI / Bank Transfer) within 5–7 business days. To request a cancellation or refund, contact our administrative coordinator in writing at <a href="mailto:contact@ashkri.com" className="text-accent-action underline">contact@ashkri.com</a> (or via our official Telegram coordination channel).
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

