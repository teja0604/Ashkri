import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Terminal, Database, Sparkles, Radio, Zap, Wifi, Cpu } from 'lucide-react';

const ENGINEERING_DOMAINS = [
  {
    code: 'CSE',
    title: 'Computer Science & Engineering',
    icon: Terminal,
    technologies: ['Next.js', 'Python', 'Go', 'Docker', 'PostgreSQL', 'Microservices'],
    sampleProjects: ['Distributed Consensus Ledger', 'Cloud Native Task Scheduler', 'Secure File Vault'],
  },
  {
    code: 'IT',
    title: 'Information Technology',
    icon: Database,
    technologies: ['React', 'Node.js', 'Spring Boot', 'GraphQL', 'MongoDB', 'Redis'],
    sampleProjects: ['Hospital Information System', 'Multi-tenant CRM Portal', 'Automated Examination Engine'],
  },
  {
    code: 'AI & DS',
    title: 'Artificial Intelligence & Data Science',
    icon: Sparkles,
    technologies: ['PyTorch', 'TensorFlow', 'OpenCV', 'Pandas', 'Transformers', 'FastAPI'],
    sampleProjects: ['Medical Imaging Pathology Detector', 'Multilingual Sentiment Classifier', 'Autonomous Drone Vision'],
  },
  {
    code: 'ECE',
    title: 'Electronics & Communication',
    icon: Radio,
    technologies: ['MATLAB', 'Simulink', 'Verilog', 'FPGA', 'GNU Radio', 'SDR'],
    sampleProjects: ['OFDM Channel Equalization System', 'FPGA Hardware Cryptographic Accelerator', 'Smart Radar Tracking'],
  },
  {
    code: 'EEE',
    title: 'Electrical & Electronics',
    icon: Zap,
    technologies: ['Simulink', 'PowerWorld', 'PLC / SCADA', 'Power Electronics', 'BLDC'],
    sampleProjects: ['Microgrid Load Balancing Controller', 'Solar MPPT Charge Management', 'EV Battery Management Unit'],
  },
  {
    code: 'IoT',
    title: 'Internet of Things',
    icon: Wifi,
    technologies: ['ESP32', 'MQTT', 'Node-RED', 'LoRaWAN', 'ThingsBoard', 'AWS IoT'],
    sampleProjects: ['Precision Agricultural Soil Sensor', 'Industrial Machine Vibration Telemetry', 'Smart City Air Quality Ring'],
  },
  {
    code: 'Embedded',
    title: 'Embedded Systems & Hardware',
    icon: Cpu,
    technologies: ['STM32 (ARM Cortex)', 'RTOS', 'Embedded C++', 'I2C / SPI', 'KiCad'],
    sampleProjects: ['Real-Time Operating Patient Monitor', 'Automotive CAN Bus Diagnostic Node', 'Custom PCB Motor Driver'],
  },
];

export function ProjectDomainsSection() {
  return (
    <Section id="domains" spacing="default" className="border-b border-seam-subtle bg-surface-elevated/40">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <SectionHeading
            eyebrow="Engineering Specializations"
            title="Find the Right Direction"
            serifAccent="for Your Project."
            description="Qualified mentorship across seven core technical engineering domains. We only support architectures where rigorous technical delivery capability is verified."
            className="mb-0"
          />
          <Button variant="secondary" size="md" href="/project-domains" className="flex-shrink-0 self-start md:self-end">
            Explore All Domains →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENGINEERING_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            return (
              <Card
                key={domain.code}
                variant="default"
                hoverable
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-heading font-extrabold px-2.5 py-1 rounded bg-accent-terracotta/10 text-accent-action border border-accent-terracotta/20">
                      {domain.code}
                    </span>
                    <Icon className="w-5 h-5 text-accent-brass" />
                  </div>

                  <h3 className="text-lg font-heading font-bold text-ink-primary mb-3">
                    {domain.title}
                  </h3>

                  <div className="mb-4">
                    <span className="text-[11px] uppercase tracking-wider font-heading font-semibold text-ink-secondary/70 block mb-2">
                      Key Technology Stacks:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {domain.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-medium font-body px-2 py-0.5 rounded bg-surface-elevated text-ink-primary border border-seam-subtle"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-seam-subtle">
                  <span className="text-[11px] uppercase tracking-wider font-heading font-semibold text-ink-secondary/70 block mb-1.5">
                    Example Architectures:
                  </span>
                  <ul className="text-xs text-ink-secondary space-y-1">
                    {domain.sampleProjects.map((proj) => (
                      <li key={proj} className="truncate">
                        · {proj}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
