import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CheckCircle } from 'lucide-react';

const FEATURED_PROJECTS = [
  {
    title: 'Plant Pathology Telemetry & Edge Inference Node',
    badge: 'Demonstration Architecture',
    domain: 'AI & IoT',
    tech: ['PyTorch', 'ESP32', 'FastAPI', 'Next.js', 'MQTT'],
    problem: 'Early crop blight identification without reliable internet connectivity in remote farm plots.',
    solution: 'Quantized lightweight neural network architecture deployed to a low-power microcontroller with fallback telemetry logging.',
    deliverables: [
      'Edge model quantization and deployment script',
      'ESP32 firmware and MQTT sensor circuit',
      'Full IEEE-compliant conference paper draft',
    ],
  },
  {
    title: 'Concurrent Appointment Vault & Queue Engine',
    badge: 'Demonstration Architecture',
    domain: 'Full-Stack Software',
    tech: ['Next.js', 'PostgreSQL', 'Prisma', 'Redis', 'Docker'],
    problem: 'Hospital OPD bottlenecks during morning token generation with concurrent database lockouts.',
    solution: 'Optimistic locking queue architecture backed by in-memory data store with atomic state transitions.',
    deliverables: [
      'Clean modular repository with Docker compose',
      'Database schema with relational constraints',
      'Viva defense architecture slide deck',
    ],
  },
  {
    title: 'Industrial Motor Telemetry & Spectral Anomaly Node',
    badge: 'Demonstration Architecture',
    domain: 'Embedded & DSP',
    tech: ['STM32 ARM', 'FreeRTOS', 'FFT Spectral Analysis', 'CAN Bus'],
    problem: 'Preventing catastrophic bearing failures in factory induction motors through vibration anomaly sensing.',
    solution: 'On-chip harmonic vibration spectrum analysis with prioritized CAN bus diagnostic frames.',
    deliverables: [
      'FreeRTOS task scheduler and ADC pipeline',
      'Hardware schematics and wiring diagram',
      'Oral examination code review guide',
    ],
  },
];

export function FeaturedWorkSection() {
  return (
    <Section id="work" spacing="default" className="border-b border-seam-subtle bg-surface-elevated/30">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <SectionHeading
            eyebrow="Demonstration Portfolio"
            title="Engineering Ideas Into"
            serifAccent="Practical Solutions."
            description="Representative architectural prototypes developed to illustrate real-world system design, clean code practices, and comprehensive academic deliverables."
            className="mb-0"
          />
          <Button variant="secondary" size="md" href="/our-work" className="flex-shrink-0 self-start md:self-end">
            View All Demonstrations →
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {FEATURED_PROJECTS.map((project) => (
            <Card
              key={project.title}
              variant="default"
              hoverable
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="brass" size="sm">
                    {project.badge}
                  </Badge>
                  <span className="text-xs font-heading font-medium text-accent-terracotta">
                    {project.domain}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-bold text-ink-primary mb-3 leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-ink-secondary mb-4 font-body leading-relaxed">
                  <strong className="text-ink-primary block font-heading mb-1">Problem Formulation:</strong>
                  {project.problem}
                </p>

                <p className="text-xs text-ink-secondary mb-5 font-body leading-relaxed">
                  <strong className="text-ink-primary block font-heading mb-1">Engineered Approach:</strong>
                  {project.solution}
                </p>

                <div className="flex flex-wrap gap-1 mb-5">
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

              <div className="pt-4 border-t border-seam-subtle">
                <span className="text-[11px] uppercase tracking-wider font-heading font-semibold text-ink-secondary/70 block mb-2">
                  Academic Deliverables:
                </span>
                <ul className="text-xs text-ink-secondary space-y-1.5 mb-6">
                  {project.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-status-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="secondary"
                  size="sm"
                  href="/contact"
                  className="w-full text-xs"
                >
                  Discuss a Similar Architecture
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
