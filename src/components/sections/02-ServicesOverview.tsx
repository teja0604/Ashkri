import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Lightbulb, 
  Code2, 
  BrainCircuit, 
  Cpu, 
  FileText, 
  GraduationCap,
  ArrowRight 
} from 'lucide-react';

const CONCISE_SERVICES = [
  {
    icon: Lightbulb,
    title: 'Project Consultation & Planning',
    domain: 'Architecture & Ideation',
    summary: 'Evaluate feasibility against university guidelines, resolve scope ambiguities, and design viable system architectures.',
    link: '/services#consultation',
  },
  {
    icon: Code2,
    title: 'Software & Full-Stack Development',
    domain: 'Web & Distributed',
    summary: 'End-to-end guidance with modern production stacks (Next.js, Node.js, PostgreSQL, Docker) and clean API contracts.',
    link: '/services#software',
  },
  {
    icon: BrainCircuit,
    title: 'AI, Machine Learning & Data Science',
    domain: 'Deep Learning & Analytics',
    summary: 'Custom neural network architectures, dataset curation, loss curve benchmarking, and defensible mathematical foundations.',
    link: '/services#ai-ml',
  },
  {
    icon: Cpu,
    title: 'Hardware, Embedded Systems & IoT',
    domain: 'Firmware & Telemetry',
    summary: 'Microcontroller firmware (ESP32, STM32), FreeRTOS task scheduling, sensor bus integration, and cloud telemetry.',
    link: '/services#hardware-iot',
  },
  {
    icon: FileText,
    title: 'Documentation & Presentation',
    domain: 'Academic Publishing',
    summary: 'Comprehensive thesis reports formatted to university standards, IEEE conference paper drafts, and viva presentation slide decks.',
    link: '/services#documentation',
  },
  {
    icon: GraduationCap,
    title: 'Technical Training & Viva Mentoring',
    domain: 'Oral Defense Coaching',
    summary: 'One-on-one code walkthroughs and viva defense simulations so you confidently explain every module to external examiners.',
    link: '/services#viva-mentoring',
  },
];

export function ServicesOverviewSection() {
  return (
    <Section id="services" spacing="default" className="border-b border-seam-subtle">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <SectionHeading
            eyebrow="Technical Capabilities"
            title="Technical Expertise."
            serifAccent="Practical Guidance."
            description="Engineering mentorship structured from initial concept validation through production development and final oral viva defense."
            className="mb-0"
          />
          <Button variant="secondary" size="md" href="/services" className="flex-shrink-0 self-start md:self-end">
            View All 7 Services →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONCISE_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                hoverable
                className="flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-editorial bg-accent-terracotta/10 border border-accent-terracotta/20 flex items-center justify-center text-accent-action group-hover:bg-accent-action group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="default" size="sm">
                      {service.domain}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-heading font-bold text-ink-primary mb-2.5 group-hover:text-accent-action transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-body mb-4">
                    {service.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-seam-subtle">
                  <Link
                    href={service.link}
                    className="inline-flex items-center text-xs font-heading font-semibold text-accent-action hover:text-accent-terracotta transition-colors gap-1"
                  >
                    <span>Detailed scope & deliverables</span>
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
