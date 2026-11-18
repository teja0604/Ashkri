import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Terms & Conditions | ASHKRI Academic Solutions',
  description:
    'Terms and Conditions governing engineering project consultation, technical mentorship, academic ethics, and milestone deliverables.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="w-full">
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="default" size="sm" className="mb-4">
              Service Agreement · Effective November 2026
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-4">
              Terms & Conditions
            </h1>
            <p className="text-sm text-ink-secondary font-body">
              These Terms and Conditions govern project consultation, software guidance, and technical mentoring services provided by ASHKRI Academic Solutions (&ldquo;ASHKRI&rdquo;), a division of ASHKRI Technologies.
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
                Notice of Proposed Commercial Terms
              </span>
              <p className="text-ink-secondary">
                The milestone schedule and commercial engagement terms outlined below represent proposed terms subject to formal legal review and business ratification prior to automated billing activation in subsequent phases.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                1. Nature of Services
              </h2>
              <p>
                ASHKRI provides technical mentoring, engineering design consultation, software implementation tutoring, hardware schematic verification, and academic documentation formatting. All engagements are structured as technical educational guidance to assist students in understanding and completing their academic degree requirements.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                2. Academic Integrity & Student Responsibility
              </h2>
              <p>
                The student acknowledges that university project evaluation requires personal understanding of the project. The student agrees to participate in code review walkthroughs and viva defense coaching sessions. ASHKRI explicitly prohibits using its technical guidance for fraudulent academic misrepresentation.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                3. Milestone Structure & Engagement Scope
              </h2>
              <p>
                Project services follow an agreed 40% / 30% / 30% milestone structure as detailed in the formal scope quotation:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li><strong>Milestone 1 (40%):</strong> Booking advance initiating architectural design and workspace setup.</li>
                <li><strong>Milestone 2 (30%):</strong> Payable only upon student verification of a live working demonstration of core modules.</li>
                <li><strong>Milestone 3 (30%):</strong> Payable upon final deliverable transfer, complete report documentation, and oral viva coaching.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                4. Scope Boundaries & Revisions
              </h2>
              <p>
                Each engagement is bounded by the approved written scope specification. Reasonable minor revisions requested by university project guides that fall within the original architectural scope are accommodated at zero additional charge. Substantial deviations or replacement of completed modules will be quoted separately as scope addenda.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                5. Intellectual Property
              </h2>
              <p>
                Upon complete payment of all agreed project milestones, the customized project codebase, documentation reports, and presentation slides are transferred to the student for their personal academic evaluation. ASHKRI retains rights to its proprietary foundational libraries and generic architectural templates.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                6. Evaluation Marks Disclaimer
              </h2>
              <p>
                ASHKRI provides professional technical mentoring, production-grade code architecture, and thorough oral examination coaching. However, final marks, grades, and project acceptance remain solely at the discretion of the student&apos;s university evaluation committee. ASHKRI does not warrant or guarantee specific academic grades.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

