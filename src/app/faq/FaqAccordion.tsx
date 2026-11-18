'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  // Category 1: Services & Scope
  {
    id: 'faq-1',
    category: 'Services & Scope',
    question: 'What exact deliverables are included in a project assistance engagement?',
    answer:
      'Every project engagement includes clean, fully commented source code with modular architecture, complete setup/deployment documentation, an itemized IEEE-formatted project report or thesis draft (Word/LaTeX), high-resolution block diagrams, and a dedicated 1-on-1 viva defense walkthrough session with an engineer.',
  },
  {
    id: 'faq-2',
    category: 'Services & Scope',
    question: 'Can I purchase documentation or viva coaching separately without full development?',
    answer:
      'Yes. Students who have already implemented their own project codebase can independently engage ASHKRI for comprehensive IEEE documentation (₹799–₹1,499), slide deck design (₹499–₹999), or dedicated 1-on-1 viva code review coaching (₹499–₹999).',
  },
  // Category 2: Pricing & Milestones
  {
    id: 'faq-3',
    category: 'Pricing & Milestones',
    question: 'How does the 40% / 30% / 30% milestone structure work in practice?',
    answer:
      'You pay 40% at booking to initiate development and assign a dedicated technical lead. The second 30% milestone is paid ONLY after inspecting a live, running demonstration of your core features. The final 30% balance is paid upon complete code transfer, documentation delivery, and completion of your viva coaching session.',
  },
  {
    id: 'faq-4',
    category: 'Pricing & Milestones',
    question: 'Are hardware and component costs included in the indicative price ranges?',
    answer:
      'For IoT and Embedded Systems projects, hardware components (microcontrollers like ESP32 or STM32, sensors, relays, custom PCB fabrication) can either be purchased by you directly from retail electronics vendors, or ordered through ASHKRI at actual retail component cost with zero markup.',
  },
  // Category 3: Academic Ethics & Revisions
  {
    id: 'faq-5',
    category: 'Academic Ethics & Integrity',
    question: 'Do you sell pre-made or downloaded project ZIP files?',
    answer:
      'Strictly no. ASHKRI Academic Solutions does not maintain a commercial library of recycled projects. Every engagement is custom-architected around the student\'s specific college rubrics. We emphasize technical comprehension so that you understand every algorithm, function, and design decision.',
  },
  {
    id: 'faq-6',
    category: 'Academic Ethics & Integrity',
    question: 'Do you guarantee full marks or university grades?',
    answer:
      'No legitimate engineering consultancy can guarantee academic grades, as university grading is exclusively under the discretion of your internal and external examiners. We guarantee production-grade code quality, rigorous technical architecture, and thorough coaching so you are fully equipped to excel.',
  },
  // Category 4: Revisions & Support
  {
    id: 'faq-7',
    category: 'Revisions & Defense',
    question: 'What happens if my college guide requests modifications to the project scope?',
    answer:
      'Reasonable modifications that align with the agreed initial project scope (e.g. adding an extra validation check, adjusting UI color schemes, updating report chapters) are included at zero extra cost. Fundamental architectural shifts that require discarding completed engineering modules are quoted as scope addenda at discounted student rates.',
  },
  {
    id: 'faq-8',
    category: 'Revisions & Defense',
    question: 'How do you prepare students for the final university oral viva examination?',
    answer:
      'Our viva preparation is conducted via a dedicated video review session. Your mentor will cross-examine you on potential system bottlenecks, algorithm time complexity, error handling, and alternative architectural choices, equipping you with clear, confident answers for external examiners.',
  },
];

export function FaqAccordion() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-3': true,
  });

  const categories = Array.from(new Set(FAQ_DATA.map((item) => item.category)));

  const toggle = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-12">
      {categories.map((category) => {
        const items = FAQ_DATA.filter((i) => i.category === category);
        return (
          <div key={category} className="space-y-4">
            <h2 className="text-sm font-heading font-extrabold uppercase tracking-widest text-accent-brass pb-2 border-b border-seam-subtle">
              {category}
            </h2>

            <div className="space-y-3">
              {items.map((item) => {
                const isOpen = !!openIds[item.id];
                return (
                  <div
                    key={item.id}
                    className="rounded-editorial border border-seam-subtle bg-surface-primary transition-all duration-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`answer-${item.id}`}
                      id={`question-${item.id}`}
                      className="w-full flex items-center justify-between p-5 text-left font-heading font-bold text-sm sm:text-base text-ink-primary hover:text-accent-action transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action"
                    >
                      <span className="pr-4">{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-ink-secondary flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-accent-action' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={`answer-${item.id}`}
                        role="region"
                        aria-labelledby={`question-${item.id}`}
                        className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink-secondary font-body leading-relaxed border-t border-seam-subtle/50"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

