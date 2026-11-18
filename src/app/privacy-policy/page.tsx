import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Privacy Policy | ASHKRI Academic Solutions',
  description:
    'Privacy Policy for ASHKRI Academic Solutions. Learn how student enquiry data, project descriptions, and contact information are protected and managed.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full">
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="default" size="sm" className="mb-4">
              Legal Disclosure · Effective November 2026
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-ink-secondary font-body">
              This Privacy Policy explains how ASHKRI Academic Solutions (&ldquo;ASHKRI&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) collects, uses, and safeguards information provided by students and visitors.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8 text-sm text-ink-secondary font-body leading-relaxed">
            {/* Draft Policy Notice Banner */}
            <div className="p-4 rounded-editorial bg-surface-elevated border border-accent-brass/40 text-ink-primary text-xs sm:text-sm font-body leading-relaxed">
              <span className="font-heading font-bold text-accent-brass uppercase tracking-wider text-xs block mb-1">
                Notice: Policy Status & Phase 2 Architecture
              </span>
              <p className="text-ink-secondary">
                This document outlines proposed privacy standards and data management policies for ASHKRI Academic Solutions. In Phase 2, this website operates statically with client-side form compilation only; no automated database persistence is active. This draft policy is subject to formal legal review and business ratification prior to automated data processing in Phase 3.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                1. Information We Collect
              </h2>
              <p>
                When you submit a consultation enquiry or contact us via email or Telegram, we collect only the information necessary to evaluate your engineering project scope and coordinate mentoring:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Personal identification details: Student full name, email address, and WhatsApp/phone number.</li>
                <li>Academic details: College/institution name, department, engineering degree branch, and expected semester deadlines.</li>
                <li>Project scope details: Project domain, title, descriptive problem statement, IEEE reference papers, or university guidelines.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                2. Purpose of Information Use
              </h2>
              <p>
                We use collected information solely for legitimate operational purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Evaluating the technical feasibility of your proposed project scope.</li>
                <li>Preparing transparent, itemized milestone quotations.</li>
                <li>Scheduling consultation, code review, and viva defense coaching sessions.</li>
                <li>Communicating project milestone updates and deliverable handovers.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                3. Zero Commercial Data Selling
              </h2>
              <p>
                ASHKRI does not sell, lease, or rent student personal data, college affiliations, or project descriptions to third-party advertisers, recruiters, or data brokers under any circumstances.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                4. Data Confidentiality & Academic Protection
              </h2>
              <p>
                All student project briefs, proposed problem statements, and IEEE drafts shared with our engineering team are treated with academic confidentiality. We do not publish your private project work, client credentials, or academic documents without prior written consent.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                5. Data Retention & Deletion Requests
              </h2>
              <p>
                In subsequent phases, enquiry records and communications will be retained for the duration of your academic engagement cycle to support ongoing project revisions and viva preparation. You may request the permanent deletion of your contact records at any time by contacting our designated address at <a href="mailto:contact@ashkri.com" className="text-accent-action underline">contact@ashkri.com</a> or via our official Telegram channel.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-ink-primary">
                6. Contact for Privacy Inquiries
              </h2>
              <p>
                If you have questions regarding this draft Privacy Policy or our proposed data management practices, please contact our coordination team at <a href="mailto:contact@ashkri.com" className="text-accent-action underline">contact@ashkri.com</a> or via Telegram at <a href="https://t.me/Ashkri_Technologies" target="_blank" rel="noopener noreferrer" className="text-accent-action underline">@Ashkri_Technologies</a>.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

