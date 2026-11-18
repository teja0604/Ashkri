import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, Layers } from 'lucide-react';

const FEATURED_PROJECTS = [
  {
    id: 'plant-pathology-node',
    title: 'Plant Pathology Telemetry & Edge Inference Node',
    badge: 'Conceptual Prototype',
    domain: 'AI & IoT',
    tech: ['PyTorch', 'ESP32', 'FastAPI', 'Next.js', 'MQTT'],
    summary:
      'Low-power microcontroller hardware running quantized neural inference for early crop blight detection, with offline flash telemetry and automated cloud dashboard synchronization.',
  },
  {
    id: 'medical-appointment-vault',
    title: 'Concurrent Appointment Vault & Queue Engine',
    badge: 'Proposed Architecture',
    domain: 'Full-Stack Software',
    tech: ['Next.js', 'PostgreSQL', 'Prisma', 'Redis', 'Docker'],
    summary:
      'High-throughput outpatient queue system utilizing Redis distributed token locks and PostgreSQL row-level optimistic concurrency to eliminate morning clinic database contention.',
  },
  {
    id: 'spectral-vibration-node',
    title: 'Industrial Motor Telemetry & Spectral Anomaly Node',
    badge: 'Conceptual Prototype',
    domain: 'Embedded & DSP',
    tech: ['STM32 ARM', 'FreeRTOS', 'FFT Spectral Analysis', 'CAN Bus'],
    summary:
      'On-chip hardware-accelerated Fast Fourier Transform (FFT) vibration harmonic sensing with FreeRTOS task scheduling and prioritized industrial CAN bus emergency alert frames.',
  },
];

export function FeaturedWorkSection() {
  return (
    <Section id="work" spacing="default" className="border-b border-seam-subtle bg-surface-elevated/30">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <SectionHeading
            eyebrow="Demonstration Portfolio"
            title="Curriculum Reference"
            serifAccent="Architectures."
            description="Representative conceptual engineering prototypes illustrating production design patterns, clean code standards, and viva-ready documentation."
            className="mb-0"
          />
          <Button variant="secondary" size="md" href="/our-work" className="flex-shrink-0 self-start md:self-end">
            View All Demonstrations →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PROJECTS.map((project) => (
            <Card
              key={project.id}
              variant="default"
              hoverable
              className="flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <Badge variant="brass" size="sm">
                    {project.badge}
                  </Badge>
                  <span className="text-xs font-heading font-medium text-accent-terracotta">
                    {project.domain}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-heading font-bold text-ink-primary mb-2.5 leading-snug group-hover:text-accent-action transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-body mb-4">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-ink-primary border border-seam-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-seam-subtle">
                <Link
                  href={`/our-work#${project.id}`}
                  className="inline-flex items-center text-xs font-heading font-semibold text-accent-action hover:text-accent-terracotta transition-colors gap-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect Architecture Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-ink-secondary font-body">
            All models above are pedagogical reference specifications designed by ASHKRI Technologies to demonstrate engineering standards. In accordance with our ethics policy, private student deliverables are never published.
          </p>
        </div>
      </Container>
    </Section>
  );
}
