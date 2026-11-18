import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Layers, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Work & Architectural Demonstrations | ASHKRI Academic Solutions',
  description:
    'Explore verified technical case studies and architectural prototypes engineered by ASHKRI Academic Solutions across software, AI, and embedded domains.',
};

const DEMONSTRATION_PROJECTS = [
  {
    id: 'plant-pathology-node',
    title: 'Autonomous Agricultural Telemetry & Edge Inference Node',
    classification: 'Conceptual Engineering Demonstration',
    domain: 'AI, Embedded & IoT',
    techStack: ['PyTorch', 'MobileNetV3', 'ESP32', 'FreeRTOS', 'MQTT', 'Next.js', 'PostgreSQL'],
    problemStatement:
      'Rural farmers experience crop loss due to delayed diagnosis of leaf fungal blights. Commercial cloud-only vision services are frequently hindered by inconsistent cellular connectivity in agricultural fields.',
    engineeredSolution:
      'A low-power hardware design integrating an image sensor module with a dual-core ESP32. A quantized lightweight convolutional neural network is proposed for on-device inference for immediate alerting, with secondary asynchronous synchronization to an editorial web dashboard when cellular connectivity is established.',
    keyFeatures: [
      'Quantized INT8 neural model specification for low-power edge silicon',
      'Solar-powered charging circuit design with FreeRTOS deep-sleep power states',
      'MQTT telemetry queue architecture with offline flash memory buffer design',
      'Web management dashboard with geospatial plot mapping interface',
    ],
    ashkriMentorshipRole:
      'Architectural formulation, quantization pipeline scripting, FreeRTOS task scheduling, schematic verification, and LaTeX IEEE paper structure.',
    status: 'Architectural Prototype',
  },
  {
    id: 'medical-appointment-vault',
    title: 'High-Concurrency Medical Appointment & Record Vault',
    classification: 'Proposed Technical Architecture',
    domain: 'CSE & Cloud Architecture',
    techStack: ['Next.js 14', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'Docker'],
    problemStatement:
      'Outpatient hospital departments (OPDs) face extreme database lock contention during 8:00 AM booking windows, resulting in double-allocated consultation tokens and server crashes.',
    engineeredSolution:
      'A resilient web system design employing Redis-based distributed token buckets for request rate throttling, combined with PostgreSQL row-level optimistic concurrency locking. Patient records are segregated with field-level cryptographic salting to demonstrate compliance with modern medical data privacy standards.',
    keyFeatures: [
      'Atomic Redis reservation lock preventing duplicate appointment token generation',
      'Type-safe relational database schema with automated migration history',
      'Role-based authorization separating Patients, Doctors, and Hospital Registrars',
      'Clean containerized setup runnable with a single Docker Compose command',
    ],
    ashkriMentorshipRole:
      'System design, database normalization, concurrency test script generation, API validation, and oral examination viva coaching.',
    status: 'Proposed Technical Architecture',
  },
  {
    id: 'spectral-vibration-node',
    title: 'Industrial Motor Telemetry & FFT Vibration Spectral Node',
    classification: 'Conceptual Engineering Demonstration',
    domain: 'Embedded Systems & ECE',
    techStack: ['STM32 (ARM Cortex-M4)', 'Embedded C', 'CMSIS-DSP', 'CAN Bus 2.0B', 'Python (Telemetry GUI)'],
    problemStatement:
      'Factory induction motors suffer abrupt bearing failures, creating unplanned manufacturing downtime. Traditional scheduled maintenance fails to catch early micro-vibration harmonic anomalies.',
    engineeredSolution:
      'An embedded diagnostic node design utilizing an industrial 3-axis accelerometer interfaced to an STM32 ARM Cortex-M4 microcontroller. The hardware architecture utilizes the on-chip floating-point unit (FPU) to compute real-time Fast Fourier Transform (FFT) frequency spectrums, transmitting harmonic alert frames over an industrial CAN bus network.',
    keyFeatures: [
      'High-speed ADC DMA sampling architecture with double-buffering',
      'CMSIS-DSP hardware-accelerated 1024-point real FFT computation',
      'Prioritized CAN 2.0B identifier frames for immediate emergency shutdown signals',
      'Desktop Python/PyQt diagnostic interface visualizing live frequency spectrums',
    ],
    ashkriMentorshipRole:
      'DSP algorithm porting, DMA buffer configuration, CAN transceiver circuit design, and formal academic thesis documentation.',
    status: 'Conceptual Engineering Demonstration',
  },
  {
    id: 'privacy-preserving-rag',
    title: 'Domain-Restricted Retrieval-Augmented Generation (RAG) Engine',
    classification: 'Proposed Technical Architecture',
    domain: 'AI & Data Engineering',
    techStack: ['Python', 'FastAPI', 'ChromaDB', 'Hugging Face', 'LangChain', 'React'],
    problemStatement:
      'Organizations cannot use public cloud LLMs for sensitive internal manuals due to IP leaks and widespread hallucinations when queried on precise engineering specifications.',
    engineeredSolution:
      'A self-hosted, localized retrieval engine design pairing a vector embedding database with an open-weights small language model. Incoming queries are semantically matched against local PDF manuals, returning exact cited page references with zero internet telemetry.',
    keyFeatures: [
      'Recursive character document chunking with metadata preservation',
      'Cosine similarity vector search with configurable relevance thresholding',
      'Strict source-citation constraint preventing off-corpus hallucination',
      'Clean web interface highlighting exact document excerpts',
    ],
    ashkriMentorshipRole:
      'Embedding model selection, vector indexing optimization, citation validation logic, and presentation deck design.',
    status: 'Proposed Technical Architecture',
  },
];

export default function OurWorkPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="accent" size="md" className="mb-4">
              Demonstration Case Studies
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-6">
              Engineering Ideas Into{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                Practical Solutions.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-body">
              The projects below represent proposed technical architectures and conceptual engineering demonstrations developed to illustrate modular design, industry-standard toolchains, and comprehensive academic deliverables. We clearly distinguish conceptual designs from verified client implementations.
            </p>
          </div>
        </Container>
      </Section>

      {/* Projects List */}
      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="space-y-12">
            {DEMONSTRATION_PROJECTS.map((project) => (
              <div
                key={project.id}
                id={project.id}
                className="rounded-editorial bg-surface-primary border border-seam-subtle p-6 sm:p-8 md:p-10 shadow-editorial"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-seam-subtle gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="brass" size="sm">
                        {project.classification}
                      </Badge>
                      <span className="text-xs font-heading font-semibold text-accent-terracotta">
                        {project.domain}
                      </span>
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-ink-primary">
                      {project.title}
                    </h2>
                  </div>

                  <Badge variant="default" size="md" className="self-start md:self-center">
                    Status: {project.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-heading font-bold text-ink-primary mb-1">
                        Problem Statement
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-body">
                        {project.problemStatement}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-heading font-bold text-ink-primary mb-1">
                        Engineered Solution
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-body">
                        {project.engineeredSolution}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-heading font-bold text-ink-primary mb-2">
                        Core Technical Features
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-ink-secondary font-body">
                        {project.keyFeatures.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded bg-surface-elevated border border-seam-subtle">
                      <h4 className="text-xs uppercase tracking-wider font-heading font-bold text-ink-primary mb-1">
                        ASHKRI Mentorship Scope
                      </h4>
                      <p className="text-xs text-ink-secondary font-body leading-relaxed">
                        {project.ashkriMentorshipRole}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-seam-subtle gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-heading font-semibold text-ink-secondary/70 block mb-1.5">
                      Technology Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2 py-0.5 rounded bg-surface-elevated text-ink-primary border border-seam-subtle"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    href={`/contact?project=${encodeURIComponent(project.title)}`}
                    className="self-start sm:self-auto flex-shrink-0"
                  >
                    Discuss a Similar Project
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}

