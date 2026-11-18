import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Lightbulb, 
  Code2, 
  BrainCircuit, 
  BarChart3, 
  Cpu, 
  FileText, 
  GraduationCap, 
  Check, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Project Services | ASHKRI Academic Solutions',
  description:
    'Detailed technical services for final-year engineering students across India: Project consultation, software development, AI/ML, data analytics, IoT/embedded, documentation, and viva mentoring.',
};

const DETAILED_SERVICES = [
  {
    id: 'consultation',
    number: '01',
    title: 'Project Consultation & Planning',
    icon: Lightbulb,
    targetAudience: 'Final-year students with raw concepts, IEEE papers, or departmental problem statements needing architectural validation.',
    description:
      'We conduct a thorough feasibility review of your project idea against your university evaluation guidelines. Our architects evaluate algorithmic complexity, identify technical bottlenecks, and map out a practical semester timeline.',
    inclusions: [
      'Problem statement deconstruction & scope bounding',
      'System architecture & data flow diagrams (UML / C4)',
      'Hardware vs software feasibility assessment',
      'Evaluation rubric mapping for semester vivas',
    ],
    technologies: ['System Design', 'UML', 'Draw.io', 'Architecture Roadmap'],
    indicativePrice: '₹199 – ₹599',
    ctaService: 'Consultation',
  },
  {
    id: 'software',
    number: '02',
    title: 'Software Development Assistance',
    icon: Code2,
    targetAudience: 'CSE and IT students building web platforms, mobile applications, distributed backends, or cloud services.',
    description:
      'Structured code mentoring following production engineering standards. Rather than handing over an obscure bundle of files, we guide you through clean directory structures, relational database schemas, typed APIs, and deployment pipelines.',
    inclusions: [
      'Modular full-stack codebase with Git version control',
      'Secure REST or GraphQL API layer',
      'Relational database modeling with migrations',
      'Live containerized or cloud staging deployment',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Python'],
    indicativePrice: '₹6,000 – ₹10,000',
    ctaService: 'Software Development',
  },
  {
    id: 'ai-ml',
    number: '03',
    title: 'Artificial Intelligence & Machine Learning',
    icon: BrainCircuit,
    targetAudience: 'AI, Data Science, and CSE students requiring custom neural network design, training pipelines, and evaluation metrics.',
    description:
      'Rigorous machine learning guidance covering dataset curation, data augmentation, baseline comparison, model training, hyperparameter tuning, and inference deployment. We ensure you can explain your loss curves and mathematical fundamentals during evaluation.',
    inclusions: [
      'Clean Jupyter notebooks & modular training scripts',
      'Dataset preprocessing, normalization & splitting',
      'Performance evaluation graphs (ROC-AUC, Confusion Matrix, F1)',
      'REST API wrapper for model inference',
    ],
    technologies: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'OpenCV', 'Hugging Face', 'FastAPI'],
    indicativePrice: '₹7,000 – ₹15,000',
    ctaService: 'AI / Machine Learning',
  },
  {
    id: 'data-science',
    number: '04',
    title: 'Data Science & Analytics',
    icon: BarChart3,
    targetAudience: 'Students conducting big-data analytics, predictive modeling, statistical testing, and business intelligence dashboards.',
    description:
      'End-to-end data pipeline assistance from raw data wrangling through exploratory data analysis (EDA) and interactive dashboard generation. We emphasize defensible statistical methodology and reproducible data processing.',
    inclusions: [
      'Exploratory data analysis & statistical correlation reports',
      'Feature engineering & dimensionality reduction (PCA, t-SNE)',
      'Interactive visualization dashboard (Streamlit / Dash)',
      'Complete analytical findings documentation',
    ],
    technologies: ['Pandas', 'NumPy', 'Seaborn', 'Streamlit', 'Tableau', 'SQL'],
    indicativePrice: '₹5,000 – ₹9,000',
    ctaService: 'Data Science',
  },
  {
    id: 'hardware-iot',
    number: '05',
    title: 'Hardware, Embedded Systems & IoT',
    icon: Cpu,
    targetAudience: 'ECE, EEE, and IoT students building microcontroller prototypes, telemetry systems, or automation nodes.',
    description:
      'Hardware and firmware mentoring covering circuit schematic validation, sensor interfacing, communication protocol configuration (MQTT, HTTP, LoRa), and real-time operating system task scheduling.',
    inclusions: [
      'Circuit wiring diagrams & pinout specifications',
      'Clean, commented C/C++ firmware codebase',
      'Cloud telemetry dashboard integration',
      'Hardware troubleshooting & debugging assistance',
    ],
    technologies: ['ESP32', 'STM32', 'Arduino', 'Raspberry Pi', 'FreeRTOS', 'MQTT', 'KiCad'],
    indicativePrice: '₹5,000 – ₹15,000+',
    ctaService: 'Hardware & IoT',
  },
  {
    id: 'documentation',
    number: '06',
    title: 'Documentation & Presentation',
    icon: FileText,
    targetAudience: 'Students preparing formal project reports, synopsis submissions, IEEE conference papers, or viva slide decks.',
    description:
      'Academic publishing support strictly formatted to university guidelines. We assist with IEEE standard styling, mathematical equation typesetting in LaTeX, architectural block diagrams, and presentation slide design.',
    inclusions: [
      'Comprehensive project report (LaTeX / Microsoft Word)',
      'IEEE 2-column format conference paper draft',
      'High-resolution architectural flowcharts & block diagrams',
      'Structured presentation slide deck for evaluation vivas',
    ],
    technologies: ['LaTeX', 'Overleaf', 'Microsoft Word', 'PowerPoint', 'Draw.io'],
    indicativePrice: '₹799 – ₹1,499',
    ctaService: 'Documentation',
  },
  {
    id: 'viva-mentoring',
    number: '07',
    title: 'Technical Training & Viva Mentoring',
    icon: GraduationCap,
    targetAudience: 'Students who already have an existing project but lack deep conceptual understanding to defend it in front of external examiners.',
    description:
      'Intensive one-on-one code walkthrough sessions. Our engineers systematically review your codebase line-by-line, explain data flows, simulate tough viva cross-examination questions, and build your technical confidence.',
    inclusions: [
      'Line-by-line source code walkthrough session',
      'Mock viva simulation with examiner cross-questioning',
      'List of 50+ anticipated examiner questions & answers',
      'Recorded video walkthrough session for offline revision',
    ],
    technologies: ['Code Review', 'Oral Defense', 'System Walkthrough'],
    indicativePrice: '₹499 – ₹999',
    ctaService: 'Viva Mentoring',
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="accent" size="md" className="mb-4">
              Comprehensive Service Portfolio
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-6">
              Technical Support for Every Stage of{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                Your Project.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-body">
              Structured engineering guidance spanning all phases of university project evaluation. We do not provide generic turnkey downloads; every service is designed around student mentorship and technical mastery.
            </p>
          </div>
        </Container>
      </Section>

      {/* Services List */}
      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="space-y-12">
            {DETAILED_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="rounded-editorial bg-surface-primary border border-seam-subtle p-6 sm:p-8 md:p-10 shadow-editorial hover:border-seam-strong transition-all duration-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Number, Title, Description (7 cols) */}
                    <div className="lg:col-span-7">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-heading font-extrabold text-2xl text-accent-brass">
                          {service.number}
                        </span>
                        <div className="w-9 h-9 rounded-editorial bg-accent-terracotta/10 border border-accent-terracotta/20 flex items-center justify-center text-accent-action">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink-primary">
                          {service.title}
                        </h2>
                      </div>

                      <div className="mb-4 p-3 rounded bg-surface-elevated border border-seam-subtle text-xs text-ink-secondary">
                        <strong className="text-ink-primary font-heading">Target Candidates: </strong>
                        {service.targetAudience}
                      </div>

                      <p className="text-sm text-ink-secondary leading-relaxed font-body mb-6">
                        {service.description}
                      </p>

                      <div>
                        <span className="text-xs uppercase tracking-wider font-heading font-semibold text-ink-primary block mb-3">
                          Standard Service Deliverables:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-secondary font-body">
                          {service.inclusions.map((inc) => (
                            <li key={inc} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Tech & Indicative Pricing (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full bg-surface-elevated/50 p-6 rounded-editorial border border-seam-subtle">
                      <div>
                        <span className="text-xs uppercase tracking-wider font-heading font-semibold text-ink-secondary/80 block mb-2">
                          Relevant Technologies:
                        </span>
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {service.technologies.map((t) => (
                            <span
                              key={t}
                              className="text-xs font-mono px-2.5 py-1 rounded bg-surface-primary text-ink-primary border border-seam-subtle"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-seam-subtle mb-6">
                          <span className="text-xs uppercase tracking-wider font-heading font-semibold text-ink-secondary/80 block mb-1">
                            Indicative Price Range:
                          </span>
                          <span className="text-2xl font-heading font-extrabold text-accent-action">
                            {service.indicativePrice}
                          </span>
                          <span className="text-[11px] text-ink-secondary block mt-1 font-body">
                            * Final quotation depends on agreed scope complexity and hardware requirements.
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="md"
                        href={`/contact?service=${encodeURIComponent(service.ctaService)}`}
                        className="w-full"
                      >
                        Request Quote for this Service
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
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

