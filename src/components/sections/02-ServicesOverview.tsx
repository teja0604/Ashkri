import React from 'react';
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
  ArrowUpRight 
} from 'lucide-react';

const HOMEPAGE_SERVICES = [
  {
    icon: Lightbulb,
    title: 'Project Consultation & Planning',
    domain: 'Architecture & Ideation',
    description:
      'Refine your project proposal, evaluate technical feasibility, establish viable system architecture, and map deliverables against university rubrics.',
    deliverables: ['System Architecture Diagram', 'Feasibility Assessment', 'Scope Document'],
  },
  {
    icon: Code2,
    title: 'Software & Full-Stack Development',
    domain: 'Web, Cloud & Distributed',
    description:
      'End-to-end guidance for robust software systems using modern stacks (Next.js, React, Node.js, Python, PostgreSQL, Docker).',
    deliverables: ['Production-grade Codebase', 'API Integration', 'Deployment Pipeline'],
  },
  {
    icon: BrainCircuit,
    title: 'AI, Machine Learning & Data Science',
    domain: 'Deep Learning & Analytics',
    description:
      'Structured support in dataset preparation, model training (PyTorch, TensorFlow), computer vision, NLP, and analytical pipelines.',
    deliverables: ['Trained Model Weights', 'Validation Benchmarks', 'Evaluation Metrics'],
  },
  {
    icon: Cpu,
    title: 'Hardware, Embedded Systems & IoT',
    domain: 'Electronics & Firmware',
    description:
      'Guidance across microcontroller architectures (ESP32, STM32, Arduino, Raspberry Pi), sensor integration, MQTT protocols, and circuit design.',
    deliverables: ['Schematic Verification', 'Firmware Codebase', 'Hardware Demonstration'],
  },
  {
    icon: FileText,
    title: 'Documentation & Presentation',
    domain: 'Academic Publishing',
    description:
      'Professional project reports, IEEE format conference papers, architecture specifications, and viva presentation slide decks.',
    deliverables: ['LaTeX / Word Reports', 'IEEE Standard Papers', 'Viva Slide Deck'],
  },
  {
    icon: GraduationCap,
    title: 'Technical Training & Viva Mentoring',
    domain: 'Oral Defense Preparation',
    description:
      'One-on-one code walkthroughs and viva defense coaching so you thoroughly understand and confidently defend every module in your system.',
    deliverables: ['Line-by-line Code Review', 'Viva Mock Q&A', 'Concept Explanations'],
  },
];

export function ServicesOverviewSection() {
  return (
    <Section id="services" spacing="default" className="border-b border-seam-subtle">
      <Container>
        <SectionHeading
          eyebrow="Technical Services"
          title="Technical Expertise."
          serifAccent="Practical Guidance."
          description="Comprehensive engineering guidance structured to support students from initial concept inception through final viva defense."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {HOMEPAGE_SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                hoverable
                className="flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-editorial bg-accent-terracotta/10 border border-accent-terracotta/20 flex items-center justify-center text-accent-action group-hover:bg-accent-action group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="default" size="sm">
                      {service.domain}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-ink-primary mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm text-ink-secondary leading-relaxed mb-6 font-body">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-seam-subtle">
                  <span className="text-xs uppercase tracking-wider font-heading font-semibold text-ink-secondary/70 mb-2 block">
                    Core Deliverables:
                  </span>
                  <ul className="text-xs text-ink-secondary space-y-1 mb-5">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-brass" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="ghost"
                    size="sm"
                    href="#contact"
                    className="w-full justify-between text-accent-action group-hover:bg-accent-action/10"
                  >
                    <span>Request Details</span>
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
