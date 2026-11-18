import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { ArrowRight, Send, MessageCircle } from 'lucide-react';

export function FinalCTASection() {
  return (
    <Section id="contact" spacing="default" className="border-b border-seam-subtle bg-surface-elevated/40">
      <Container>
        <div className="relative rounded-2xl bg-gradient-to-br from-[#121A22] to-[#1E2833] text-white p-8 sm:p-12 md:p-16 border border-[#394651] shadow-editorial-elevated overflow-hidden">
          {/* Subtle architectural background accents */}
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-accent-terracotta/15 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-accent-brass/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block text-xs font-heading font-semibold tracking-widest uppercase text-accent-brass mb-4">
              Begin Your Project Mentorship
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white tracking-tight leading-tight mb-6">
              Have an Idea{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                Worth Building?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#B9C1C8] leading-relaxed mb-8 max-w-2xl font-body">
              Submit your project title, university guidelines, or technical questions. Our engineering leads will review feasibility, recommend architecture trajectories, and provide a clear milestone scope.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="brass"
                size="lg"
                href="mailto:contact@ashkri.com?subject=Project%20Enquiry%20-%20ASHKRI%20Academic%20Solutions"
                className="w-full sm:w-auto"
              >
                <Send className="w-4 h-4 mr-1" />
                Submit Project Requirements
              </Button>
              <a
                href="https://t.me/Ashkri_Technologies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-heading font-medium tracking-normal transition-all duration-200 rounded-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action focus-visible:ring-offset-2 text-base md:text-lg px-6 py-3.5 min-h-[50px] gap-2.5 w-full sm:w-auto border border-white/20 text-white hover:bg-white/10 active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 mr-1 text-accent-brass" />
                Join Telegram Community
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#B9C1C8] font-heading">
              <span>Direct Response Window: <strong className="text-white">Within 24 Hours</strong></span>
              <span>·</span>
              <span>Confidentiality Guaranteed</span>
              <span>·</span>
              <span>Official Parent Brand: <strong className="text-white">ASHKRI Technologies</strong></span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
