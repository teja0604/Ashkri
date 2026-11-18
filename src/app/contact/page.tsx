import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ContactForm } from './ContactForm';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle, Mail, Clock, ShieldCheck, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Project Enquiry | ASHKRI Academic Solutions',
  description:
    'Submit your final-year engineering project requirements for consultation, architecture review, and milestone quotations. Response within 24 hours.',
};

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="accent" size="md" className="mb-4">
              Project Consultation & Enquiries
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-6">
              Discuss Your Project With an{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                Engineer.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-body">
              Submit your project title, departmental guidelines, or technical challenges. Our technical coordinators and engineering leads evaluate every enquiry within 24 hours.
            </p>
          </div>
        </Container>
      </Section>

      {/* Main Two-Column Contact Section */}
      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Contact Channels & SLAs (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-editorial bg-surface-primary border border-seam-subtle p-6 shadow-editorial space-y-6">
                <div>
                  <h2 className="text-base font-heading font-bold text-ink-primary mb-1">
                    Direct Contact Channels
                  </h2>
                  <p className="text-xs text-ink-secondary font-body">
                    Connect directly with ASHKRI Academic Solutions coordinators.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-seam-subtle text-xs">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-accent-action flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-heading font-semibold text-ink-primary block">
                        Designated Corporate Email
                      </span>
                      <a
                        href="mailto:contact@ashkri.com"
                        className="text-ink-secondary hover:text-accent-action transition-colors"
                      >
                        contact@ashkri.com
                      </a>
                      <span className="block text-[11px] text-ink-secondary/70 mt-0.5">
                        (Designated contact mailbox; direct enquiries are also welcomed via Telegram)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-4 h-4 text-accent-brass flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-heading font-semibold text-ink-primary block">Official Telegram</span>
                      <a
                        href="https://t.me/Ashkri_Technologies"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-secondary hover:text-accent-action transition-colors"
                      >
                        @Ashkri_Technologies
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-heading font-semibold text-ink-primary block">Response Window</span>
                      <span className="text-ink-secondary">Within 24 Hours (Mon – Sat)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-editorial bg-surface-elevated/40 border border-seam-subtle p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-accent-brass">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confidentiality Guarantee</span>
                </div>
                <p className="text-xs text-ink-secondary font-body leading-relaxed">
                  Your project proposals, IEEE base papers, and university details are treated with strict academic confidentiality. We never disclose your project details to unauthorized third parties.
                </p>
              </div>
            </div>

            {/* Right Column: Complete 11-Field Enquiry Form UI (8 cols) */}
            <div className="lg:col-span-8">
              <div className="rounded-editorial bg-surface-primary border border-seam-subtle p-6 sm:p-8 md:p-10 shadow-editorial">
                <div className="mb-8 pb-6 border-b border-seam-subtle">
                  <h2 className="text-2xl font-heading font-bold text-ink-primary mb-2">
                    Project Consultation Request
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-secondary font-body">
                    Complete the structured form below. The more context you provide regarding your university rubrics and deliverables, the faster we can evaluate technical feasibility.
                  </p>
                </div>

                {/* Client-Side Validated Contact Form Component */}
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

