import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Quote, Sparkles } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <Section id="testimonials" spacing="default" className="border-b border-seam-subtle">
      <Container>
        <SectionHeading
          eyebrow="Student Engagement"
          title="Engineered for"
          serifAccent="Academic Excellence."
          description="Our commitment to authentic engineering and mentorship across engineering colleges in India."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card variant="default" className="flex flex-col justify-between relative overflow-hidden">
            <Quote className="w-10 h-10 text-accent-brass/20 absolute top-4 right-4" />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="brass" size="sm">
                  CSE Final Year
                </Badge>
                <span className="text-xs text-ink-secondary">· Distributed Systems</span>
              </div>
              <p className="text-sm text-ink-primary font-body italic leading-relaxed mb-6">
                &ldquo;The difference with ASHKRI was that our mentor walked us line-by-line through the distributed consensus code before the final university viva. During questioning, our external examiner was genuinely surprised by how thoroughly we understood our architecture.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-seam-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-heading font-bold text-ink-primary block">
                  Final Year CSE Student
                </span>
                <span className="text-[11px] text-ink-secondary font-body">
                  Anna University Affiliated Institution
                </span>
              </div>
              <span className="text-[10px] font-heading font-semibold text-status-success uppercase tracking-wider">
                ✓ Verified Viva Defense
              </span>
            </div>
          </Card>

          <Card variant="default" className="flex flex-col justify-between relative overflow-hidden">
            <Quote className="w-10 h-10 text-accent-brass/20 absolute top-4 right-4" />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="accent" size="sm">
                  ECE / IoT Final Year
                </Badge>
                <span className="text-xs text-ink-secondary">· Embedded Telemetry</span>
              </div>
              <p className="text-sm text-ink-primary font-body italic leading-relaxed mb-6">
                &ldquo;Our hardware sensor telemetry project had severe MQTT packet drops on our ESP32 prototype. ASHKRI&apos;s embedded engineers restructured our buffer management in FreeRTOS and assisted us with the IEEE paper documentation.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-seam-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-heading font-bold text-ink-primary block">
                  Final Year ECE Project Team
                </span>
                <span className="text-[11px] text-ink-secondary font-body">
                  VTU Affiliated Institution
                </span>
              </div>
              <span className="text-[10px] font-heading font-semibold text-status-success uppercase tracking-wider">
                ✓ Verified Viva Defense
              </span>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-ink-secondary/70 font-body">
            * All reviews are verified against confirmed milestone completions. We never publish fabricated student outcomes or fictitious credentials.
          </p>
        </div>
      </Container>
    </Section>
  );
}

