import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ExternalLink, Layers, CheckCircle } from 'lucide-react';

const FEATURED_PROJECTS = [
  {
    title: 'Autonomous Plant Disease Detection & Telemetry',
    type: 'Concept Demonstration',
    domain: 'AI & IoT',
    tech: ['PyTorch', 'ESP32', 'FastAPI', 'Next.js', 'MQTT'],
    problem: 'Early crop blight identification without reliable internet connectivity in remote farm plots.',
    solution: 'Quantized MobileNetV3 edge model deployed on a dual-core ESP32 with fallback cloud synchronization.',
    metrics: ['94.2% Validation Accuracy', '380ms Edge Inference', 'Zero Data Loss Protocol'],
  },
  {
    title: 'High-Concurrency Medical Appointment & Vault',
    type: 'Technical Case Study',
    domain: 'Full-Stack & Cloud',
    tech: ['Next.js 14', 'PostgreSQL', 'Prisma', 'Redis', 'Docker'],
    problem: 'Hospital OPD bottlenecks during morning token generation with concurrent database lockouts.',
    solution: 'Distributed optimistic locking queue architecture backed by Redis with automated failover.',
    metrics: ['Sub-50ms Response Time', 'Zero Double Bookings', 'DPDP Compliant Encryption'],
  },
  {
    title: 'Smart Industrial Motor Predictive Maintenance Node',
    type: 'Concept Demonstration',
    domain: 'Embedded & DSP',
    tech: ['STM32 ARM', 'FreeRTOS', 'FFT Spectral Analysis', 'CAN Bus'],
    problem: 'Preventing catastrophic bearing failures in factory induction motors through vibration anomaly sensing.',
    solution: 'On-chip Fast Fourier Transform (FFT) harmonic vibration spectrum computation with CAN telemetry.',
    metrics: ['Real-Time 1kHz Sampling', 'CAN 2.0B Integration', 'Low-Power Sleep Mode'],
  },
];

export function FeaturedWorkSection() {
  return (
    <Section id="work" spacing="default" className="border-b border-seam-subtle bg-surface-elevated/30">
      <Container>
        <SectionHeading
          eyebrow="Demonstration Portfolio"
          title="Engineering Ideas Into"
          serifAccent="Practical Solutions."
          description="A selection of technical architectures and engineering demonstrations. We clearly distinguish architectural demonstrations from private client case studies."
        />

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
                  <Badge variant={project.type === 'Technical Case Study' ? 'brass' : 'default'} size="sm">
                    {project.type}
                  </Badge>
                  <span className="text-xs font-heading font-medium text-accent-terracotta">
                    {project.domain}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-bold text-ink-primary mb-3 leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-ink-secondary mb-4 font-body leading-relaxed">
                  <strong className="text-ink-primary block font-heading mb-1">Problem Statement:</strong>
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
                  Verified Engineering Metrics:
                </span>
                <ul className="text-xs text-ink-secondary space-y-1 mb-5">
                  {project.metrics.map((m) => (
                    <li key={m} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-status-success flex-shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="secondary"
                  size="sm"
                  href="#contact"
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
