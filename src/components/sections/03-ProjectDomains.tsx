import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Terminal, Database, Sparkles, Radio, Zap, Wifi, Cpu, ArrowRight } from 'lucide-react';

const HOMEPAGE_DOMAINS = [
  {
    code: 'CSE',
    title: 'Computer Science & Engineering',
    icon: Terminal,
    focus: 'Distributed systems, microservices, cloud computing, and cryptographic security protocols.',
    technologies: ['Next.js', 'Python', 'Go', 'Docker', 'PostgreSQL'],
    anchor: 'cse',
  },
  {
    code: 'IT',
    title: 'Information Technology',
    icon: Database,
    focus: 'Enterprise transactional applications, multi-tenant databases, API layers, and data pipelines.',
    technologies: ['React', 'Node.js', 'Spring Boot', 'GraphQL', 'PostgreSQL'],
    anchor: 'it',
  },
  {
    code: 'AI & DS',
    title: 'Artificial Intelligence & Data Science',
    icon: Sparkles,
    focus: 'Computer vision, natural language processing (NLP), time-series forecasting, and deep neural networks.',
    technologies: ['PyTorch', 'TensorFlow', 'FastAPI', 'OpenCV', 'Pandas'],
    anchor: 'ai---ds',
  },
  {
    code: 'ECE',
    title: 'Electronics & Communication',
    icon: Radio,
    focus: 'Digital signal processing (DSP), FPGA hardware acceleration, wireless communications, and SDR.',
    technologies: ['MATLAB', 'Simulink', 'Verilog', 'FPGA', 'GNU Radio'],
    anchor: 'ece',
  },
  {
    code: 'EEE',
    title: 'Electrical & Electronics',
    icon: Zap,
    focus: 'Power electronics, microgrid simulation, EV battery management systems, and motor control.',
    technologies: ['Simulink', 'PowerWorld', 'PLC / SCADA', 'BLDC Motor Drives'],
    anchor: 'eee',
  },
  {
    code: 'IoT',
    title: 'Internet of Things',
    icon: Wifi,
    focus: 'Low-power sensor telemetry, LoRaWAN wireless backhaul, MQTT brokers, and cloud dashboards.',
    technologies: ['ESP32', 'MQTT', 'LoRaWAN', 'ThingsBoard', 'AWS IoT'],
    anchor: 'iot',
  },
  {
    code: 'Embedded',
    title: 'Embedded Systems & Hardware',
    icon: Cpu,
    focus: 'ARM Cortex microcontrollers, FreeRTOS task scheduling, automotive CAN bus, and custom PCB design.',
    technologies: ['STM32', 'FreeRTOS', 'Embedded C++', 'CAN Bus', 'KiCad'],
    anchor: 'embedded',
  },
];

export function ProjectDomainsSection() {
  return (
    <Section id="domains" spacing="default" className="border-b border-seam-subtle bg-surface-elevated/30">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <SectionHeading
            eyebrow="Engineering Specializations"
            title="Find the Right Direction"
            serifAccent="for Your Project."
            description="Mentorship across seven university engineering disciplines. We support architectures where rigorous technical delivery capability is verified."
            className="mb-0"
          />
          <Button variant="secondary" size="md" href="/project-domains" className="flex-shrink-0 self-start md:self-end">
            Explore All 7 Domains →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOMEPAGE_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            return (
              <Card
                key={domain.code}
                variant="default"
                hoverable
                className="flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-heading font-extrabold px-2.5 py-0.5 rounded bg-accent-terracotta/10 text-accent-action border border-accent-terracotta/20">
                      {domain.code}
                    </span>
                    <Icon className="w-5 h-5 text-accent-brass group-hover:text-accent-action transition-colors" />
                  </div>

                  <h3 className="text-base font-heading font-bold text-ink-primary mb-2 group-hover:text-accent-action transition-colors">
                    {domain.title}
                  </h3>

                  <p className="text-xs text-ink-secondary leading-relaxed font-body mb-4">
                    {domain.focus}
                  </p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {domain.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-ink-primary border border-seam-subtle"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-seam-subtle">
                  <Link
                    href={`/project-domains#${domain.anchor}`}
                    className="inline-flex items-center text-xs font-heading font-semibold text-ink-secondary group-hover:text-accent-action transition-colors gap-1"
                  >
                    <span>View project tracks & architectures</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
