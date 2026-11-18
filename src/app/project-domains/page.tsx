import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Terminal, 
  Database, 
  Sparkles, 
  Radio, 
  Zap, 
  Wifi, 
  Cpu, 
  ArrowRight,
  Code2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Project Domains | ASHKRI Academic Solutions',
  description:
    'Explore supported academic project domains for final-year engineering students: CSE, IT, AI & Data Science, ECE, EEE, IoT, and Embedded Systems.',
};

const DOMAINS = [
  {
    code: 'CSE',
    title: 'Computer Science & Engineering',
    icon: Terminal,
    description:
      'Focusing on distributed software architectures, cloud computing, operating systems, cryptographic systems, and microservices.',
    technologies: ['Next.js', 'Python', 'Go', 'Docker', 'PostgreSQL', 'Redis', 'Kubernetes'],
    projectTracks: [
      {
        name: 'Distributed Systems & Cloud',
        description: 'Multi-node consensus protocols, decentralized ledger systems, cloud-native automated autoscaling engines.',
      },
      {
        name: 'Cybersecurity & Cryptography',
        description: 'End-to-end encrypted file vaults, zero-knowledge authentication proofs, role-based access security frameworks.',
      },
      {
        name: 'Algorithm Optimization',
        description: 'Parallel graph search implementations, dynamic pathfinding engines, high-throughput memory caching layers.',
      },
    ],
  },
  {
    code: 'IT',
    title: 'Information Technology',
    icon: Database,
    description:
      'Enterprise application development, multi-tenant databases, API architecture, data warehousing, and secure transactional web applications.',
    technologies: ['React', 'Node.js', 'Spring Boot', 'GraphQL', 'MongoDB', 'PostgreSQL', 'AWS'],
    projectTracks: [
      {
        name: 'Enterprise Web Applications',
        description: 'Hospital management systems, multi-campus university examination management portals, ERP workflow pipelines.',
      },
      {
        name: 'Data Engineering & Processing',
        description: 'Streaming telemetry pipelines, ETL data ingestion engines, automated database replication architectures.',
      },
      {
        name: 'Collaborative Real-Time Systems',
        description: 'Operational transform document editors, WebRTC video consultation vaults, live event analytics boards.',
      },
    ],
  },
  {
    code: 'AI & DS',
    title: 'Artificial Intelligence & Data Science',
    icon: Sparkles,
    description:
      'Computer vision, natural language processing (NLP), time-series forecasting, predictive machine learning pipelines, and deep neural networks.',
    technologies: ['PyTorch', 'TensorFlow', 'FastAPI', 'Pandas', 'OpenCV', 'Hugging Face', 'Scikit-learn'],
    projectTracks: [
      {
        name: 'Computer Vision & Deep Learning',
        description: 'Medical image anomaly detection (X-ray/MRI), multi-class agricultural pest detection, facial biometric recognition.',
      },
      {
        name: 'Natural Language Processing',
        description: 'Vernacular sentiment analysis, technical legal document summarization, domain-specific retrieval-augmented generation (RAG).',
      },
      {
        name: 'Predictive Analytics & Forensics',
        description: 'Financial fraud detection, real-time customer churn prediction models, IoT sensor anomaly forecasting.',
      },
    ],
  },
  {
    code: 'ECE',
    title: 'Electronics & Communication',
    icon: Radio,
    description:
      'Digital signal processing (DSP), FPGA hardware acceleration, software-defined radio (SDR), RF communications, and wireless transmission.',
    technologies: ['MATLAB', 'Simulink', 'Verilog', 'VHDL', 'FPGA (Xilinx)', 'GNU Radio'],
    projectTracks: [
      {
        name: 'Wireless & Communication Systems',
        description: 'OFDM channel estimation and equalization, 5G beamforming simulation models, cognitive radio spectrum sensing.',
      },
      {
        name: 'VLSI & Hardware Synthesis',
        description: 'Hardware cryptographic accelerator cores (AES/RSA) in Verilog, low-power ALU design, systolic array matrix multipliers.',
      },
      {
        name: 'Digital Signal & Audio Processing',
        description: 'Real-time acoustic noise cancellation algorithms, ECG biometric rhythm analysis, speech feature extraction.',
      },
    ],
  },
  {
    code: 'EEE',
    title: 'Electrical & Electronics',
    icon: Zap,
    description:
      'Power electronics, microgrid simulation, renewable energy integration, motor drives, and industrial PLC/SCADA automation.',
    technologies: ['MATLAB / Simulink', 'PowerWorld', 'PLC / SCADA', 'Power Electronics', 'Microchip PIC'],
    projectTracks: [
      {
        name: 'Smart Grids & Renewable Integration',
        description: 'Solar PV maximum power point tracking (MPPT) algorithms, hybrid wind-solar microgrid load shedding controllers.',
      },
      {
        name: 'Electric Vehicle & Battery Systems',
        description: 'State-of-charge (SoC) estimation models, lithium battery management system (BMS) with thermal cutoffs.',
      },
      {
        name: 'Power Quality & Motor Drives',
        description: 'Active power filter harmonics suppression, sensorless BLDC motor speed control using Space Vector PWM.',
      },
    ],
  },
  {
    code: 'IoT',
    title: 'Internet of Things',
    icon: Wifi,
    description:
      'Connected telemetry devices, wireless sensor networks, MQTT/CoAP communications, and cloud telemetry analytics.',
    technologies: ['ESP32', 'MQTT', 'Node-RED', 'LoRaWAN', 'ThingsBoard', 'AWS IoT Core'],
    projectTracks: [
      {
        name: 'Smart Agriculture & Environment',
        description: 'Automated solar irrigation telemetry, air quality monitoring rings with LoRaWAN wireless backhaul.',
      },
      {
        name: 'Industrial Telemetry (IIoT)',
        description: 'Machine vibration monitoring, cold-chain refrigeration thermal monitoring, automated factory energy metering.',
      },
      {
        name: 'Smart Healthcare Nodes',
        description: 'Wearable patient vital sign monitoring nodes with automated SMS/cloud emergency trigger protocols.',
      },
    ],
  },
  {
    code: 'Embedded',
    title: 'Embedded Systems & Hardware',
    icon: Cpu,
    technologies: ['STM32 (ARM Cortex-M)', 'FreeRTOS', 'Embedded C/C++', 'SPI / I2C / CAN', 'KiCad'],
    description:
      'Real-time operating systems, low-power ARM microcontrollers, bus protocol integration, and custom hardware PCB validation.',
    projectTracks: [
      {
        name: 'Real-Time Operating Systems (RTOS)',
        description: 'Preemptive FreeRTOS task scheduling for flight controllers, prioritized multi-sensor data acquisition queues.',
      },
      {
        name: 'Automotive & Industrial Buses',
        description: 'CAN 2.0B vehicle telemetry loggers, Modbus RTU industrial instrumentation, SPI high-speed data loggers.',
      },
      {
        name: 'Hardware Design & Fabrication',
        description: 'Custom multi-layer PCB design in KiCad, component selection, power distribution analysis, and board testing.',
      },
    ],
  },
];

export default function ProjectDomainsPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="brass" size="md" className="mb-4">
              Academic Specializations
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-6">
              Engineering Domains Supported by{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                ASHKRI.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-body">
              We focus exclusively on technical engineering disciplines where our internal engineering leads possess verified hands-on production and research experience.
            </p>
          </div>
        </Container>
      </Section>

      {/* Domain Cards */}
      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="space-y-12">
            {DOMAINS.map((domain) => {
              const Icon = domain.icon;
              return (
                <div
                  key={domain.code}
                  id={domain.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                  className="rounded-editorial bg-surface-primary border border-seam-subtle p-6 sm:p-8 md:p-10 shadow-editorial"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-seam-subtle gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-heading font-extrabold px-3 py-1 rounded bg-accent-terracotta/10 text-accent-action border border-accent-terracotta/20">
                        {domain.code}
                      </span>
                      <h2 className="text-2xl font-heading font-bold text-ink-primary">
                        {domain.title}
                      </h2>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      href={`/contact?domain=${encodeURIComponent(domain.title)}`}
                    >
                      Discuss a {domain.code} Project
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>

                  <p className="text-sm text-ink-secondary leading-relaxed font-body mb-6 max-w-3xl">
                    {domain.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-xs uppercase tracking-wider font-heading font-semibold text-ink-secondary/80 block mb-2">
                      Primary Technologies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {domain.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-mono px-2.5 py-1 rounded bg-surface-elevated text-ink-primary border border-seam-subtle"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-wider font-heading font-semibold text-ink-primary block mb-4">
                      Representative Project Trajectories:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {domain.projectTracks.map((track) => (
                        <div
                          key={track.name}
                          className="p-4 rounded bg-surface-elevated/40 border border-seam-subtle"
                        >
                          <h3 className="text-sm font-heading font-bold text-ink-primary mb-1.5">
                            {track.name}
                          </h3>
                          <p className="text-xs text-ink-secondary leading-relaxed font-body">
                            {track.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </div>
  );
}

