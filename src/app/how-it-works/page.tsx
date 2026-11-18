import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  FileCheck2, 
  Compass, 
  Calculator, 
  Code2, 
  Eye, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works | Mentorship Lifecycle | ASHKRI Academic Solutions',
  description:
    'Detailed 6-stage engineering mentorship process for final-year engineering projects. Understand student inputs, ASHKRI deliverables, milestone checkpoints, and viva defense handover.',
};

const DETAILED_STAGES = [
  {
    stage: '01',
    title: 'Requirements Submission & Evaluation Rubric Review',
    icon: FileCheck2,
    summary: 'You share your proposed project topic, departmental constraints, and academic guidelines.',
    studentProvides: [
      'Project title or preliminary area of interest',
      'Department / university guidelines (syllabus, rubrics, timeline deadlines)',
      'Any IEEE reference papers, base papers, or internal guide recommendations',
    ],
    ashkriDelivers: [
      'Preliminary technical feasibility check',
      'Identification of ambiguous requirements or unrealistic scopes',
      'Scheduling of initial technical consultation call',
    ],
    nextStep: 'Initial Consultation & Architecture Review call with a technical lead.',
  },
  {
    stage: '02',
    title: 'Architecture Formulation & Initial Consultation',
    icon: Compass,
    summary: 'A 1-on-1 consultation with an engineering lead to evaluate architectural feasibility.',
    studentProvides: [
      'Questions regarding technology stack tradeoffs (e.g. Next.js vs Django, PyTorch vs TensorFlow)',
      'Clarifications on hardware availability and component sourcing constraints',
    ],
    ashkriDelivers: [
      'System block diagram and recommended modern technology stack',
      'Modular breakdown of project deliverables into achievable phases',
      'Honest guidance on what university examiners specifically look for in your domain',
    ],
    nextStep: 'Preparation of formal scope document and milestone quotation.',
  },
  {
    stage: '03',
    title: 'Transparent Scope Definition & Milestone Quotation',
    icon: Calculator,
    summary: 'You receive an itemized proposal with clear deliverables and 40/30/30 milestones.',
    studentProvides: [
      'Review and approval of the agreed feature list and revision boundaries',
      'Payment of Milestone 1 (40% booking advance) to commence project engineering',
    ],
    ashkriDelivers: [
      'Itemized scope contract detailing included features and excluded edge cases',
      'Agreed delivery schedule with intermediate checkpoint dates',
      'Verified payment receipt with documented transaction reference',
    ],
    nextStep: 'Active development and mentorship begins on a dedicated Git workspace.',
  },
  {
    stage: '04',
    title: 'Structured Development & Code Mentorship',
    icon: Code2,
    summary: 'Development proceeds with clean architecture, modular commits, and code explanations.',
    studentProvides: [
      'Participation in scheduled progress check-ins and code review calls',
      'Feedback on user interface preferences and domain requirements',
    ],
    ashkriDelivers: [
      'Regular progress updates with functional code commits',
      'Adherence to clean architecture, type safety, and documented interfaces',
      'Early access to architectural documentation drafts for semester reviews',
    ],
    nextStep: 'Scheduling of live intermediate working demonstration.',
  },
  {
    stage: '05',
    title: 'Live Demonstration & Intermediate Verification',
    icon: Eye,
    summary: 'You inspect a live, working demonstration of the core modules before any second payment.',
    studentProvides: [
      'Thorough inspection of core system features and test cases',
      'Payment of Milestone 2 (30% intermediate milestone) upon successful demo verification',
    ],
    ashkriDelivers: [
      'Live demonstration of running software or hardware prototype',
      'Verification of core data flows, database writes, and algorithm outputs',
      'Incorporation of agreed minor refinements from your departmental guide',
    ],
    nextStep: 'Final documentation preparation, slide decks, and code handover.',
  },
  {
    stage: '06',
    title: 'Comprehensive Handover & Viva Defense Coaching',
    icon: GraduationCap,
    summary: 'Complete codebase transfer, IEEE report documentation, and oral viva coaching.',
    studentProvides: [
      'Final review of deliverables and payment of Milestone 3 (30% final balance)',
      'Attendance at one-on-one viva defense preparation coaching session',
    ],
    ashkriDelivers: [
      'Full, unencumbered source code transfer with deployment instructions',
      'Comprehensive university-formatted project report (LaTeX / Word) and slide deck',
      'Line-by-line code walkthrough and mock oral examination Q&A session',
    ],
    nextStep: 'Confident, well-prepared presentation in front of academic examiners.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <Section spacing="default" className="border-b border-seam-subtle bg-surface-elevated/20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="accent" size="md" className="mb-4">
              Engagement Lifecycle
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink-primary tracking-tight leading-tight mb-6">
              The 6-Stage Mentorship{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                Lifecycle.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-body">
              A transparent, engineering-led process designed to ensure you not only have a functioning project, but deeply understand its inner workings and can defend every technical decision before external university examiners.
            </p>
          </div>
        </Container>
      </Section>

      {/* Stages List */}
      <Section spacing="default" className="border-b border-seam-subtle">
        <Container>
          <div className="space-y-12">
            {DETAILED_STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.stage}
                  className="rounded-editorial bg-surface-primary border border-seam-subtle p-6 sm:p-8 md:p-10 shadow-editorial"
                >
                  <div className="flex items-center gap-4 pb-6 mb-6 border-b border-seam-subtle">
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl text-accent-brass">
                      {stage.stage}
                    </span>
                    <div className="w-10 h-10 rounded-editorial bg-accent-terracotta/10 border border-accent-terracotta/20 flex items-center justify-center text-accent-action flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink-primary">
                        {stage.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-secondary font-body mt-0.5">
                        {stage.summary}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="p-5 rounded bg-surface-elevated/40 border border-seam-subtle">
                      <h3 className="text-xs uppercase tracking-wider font-heading font-bold text-ink-primary mb-3">
                        What You Provide:
                      </h3>
                      <ul className="space-y-2 text-xs text-ink-secondary font-body">
                        {stage.studentProvides.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-brass flex-shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded bg-surface-elevated/40 border border-seam-subtle">
                      <h3 className="text-xs uppercase tracking-wider font-heading font-bold text-ink-primary mb-3">
                        What ASHKRI Delivers:
                      </h3>
                      <ul className="space-y-2 text-xs text-ink-secondary font-body">
                        {stage.ashkriDelivers.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-status-success flex-shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-seam-subtle text-xs gap-3">
                    <div className="text-ink-secondary font-body">
                      <strong className="text-ink-primary font-heading">Next Phase: </strong>
                      {stage.nextStep}
                    </div>
                    <Badge variant="default" size="sm" className="self-start sm:self-auto">
                      Stage {stage.stage} of 06
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <Button variant="primary" size="lg" href="/contact">
              Begin Step 01: Submit Your Requirements
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}

