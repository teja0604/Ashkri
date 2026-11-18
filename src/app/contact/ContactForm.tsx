'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Send, CheckCircle2, MessageCircle, Mail, Copy, Check } from 'lucide-react';

interface FormData {
  studentName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  domain: string;
  service: string;
  description: string;
  approxBudget: string;
  expectedDeadline: string;
  consent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    email: '',
    phone: '',
    college: '',
    department: 'CSE',
    domain: 'Computer Science & Engineering',
    service: 'Full-Stack Software Assistance',
    description: '',
    approxBudget: '₹6,000 – ₹10,000',
    expectedDeadline: '',
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.studentName.trim() || formData.studentName.trim().length < 2) {
      errs.studentName = 'Full student name is required (min 2 characters).';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'A valid college or personal email address is required.';
    }

    if (!formData.phone.trim() || !/^\+?[0-9]{10,14}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'A valid 10-digit WhatsApp/phone number is required.';
    }

    if (!formData.college.trim()) {
      errs.college = 'College or institution name is required.';
    }

    if (!formData.description.trim() || formData.description.trim().length < 20) {
      errs.description = 'Please provide at least 20 characters describing your project idea or problem.';
    }

    if (!formData.consent) {
      errs.consent = 'You must acknowledge the academic integrity policy to submit.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
    }
  };

  const summaryText =
    `ASHKRI Academic Solutions - Project Consultation Request\n\n` +
    `Student Name: ${formData.studentName}\n` +
    `Email: ${formData.email}\n` +
    `Phone/WhatsApp: ${formData.phone}\n` +
    `College: ${formData.college}\n` +
    `Department: ${formData.department}\n` +
    `Domain: ${formData.domain}\n` +
    `Required Service: ${formData.service}\n` +
    `Budget Range: ${formData.approxBudget}\n` +
    `Deadline: ${formData.expectedDeadline || 'Flexible'}\n\n` +
    `Project Description:\n${formData.description}\n`;

  const mailtoBody = encodeURIComponent(summaryText);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // clipboard fallback
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 sm:p-8 rounded-editorial bg-surface-elevated border border-seam-strong text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-status-success/15 border border-status-success/30 flex items-center justify-center text-status-success mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-heading font-extrabold uppercase tracking-widest text-accent-brass block mb-2">
            Validation Complete · Ready to Dispatch
          </span>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-ink-primary mb-3">
            Your enquiry is ready to send
          </h3>
          <p className="text-xs sm:text-sm text-ink-secondary max-w-lg mx-auto font-body leading-relaxed">
            Your consultation request has been validated. Online automatic database transmission activates in Phase 3. To ensure you never lose entered information, copy your summary below or dispatch it directly through our verified channels:
          </p>
        </div>

        {/* Pre-compiled Summary Box */}
        <div className="text-left bg-surface-primary border border-seam-subtle rounded-editorial p-4 max-h-48 overflow-y-auto font-mono text-xs text-ink-secondary whitespace-pre-wrap select-all">
          {summaryText}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleCopySummary}
            type="button"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-status-success" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2 text-accent-brass" />
                Copy Enquiry Summary
              </>
            )}
          </Button>

          <Button
            variant="primary"
            size="md"
            href={`mailto:contact@ashkri.com?subject=Project%20Enquiry%20-%20${encodeURIComponent(
              formData.studentName
            )}&body=${mailtoBody}`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send via Email
          </Button>

          <Button
            variant="secondary"
            size="md"
            href="https://t.me/Ashkri_Technologies"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-4 h-4 mr-2 text-accent-brass" />
            Connect via Telegram
          </Button>
        </div>

        <div className="pt-2 border-t border-seam-subtle">
          <p className="text-xs text-ink-secondary/80 font-body">
            Please note: <span className="text-ink-primary font-mono font-medium">contact@ashkri.com</span> is our designated corporate mailbox. For immediate direct communication during pre-launch, connect directly via Telegram or copy your summary above.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitted(false)}
          className="text-xs text-ink-secondary/70 hover:text-ink-primary underline font-body pt-1 block mx-auto"
        >
          ← Edit form responses
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name & Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="studentName" className="block text-xs font-heading font-bold text-ink-primary mb-2">
            Student Full Name <span className="text-status-error">*</span>
          </label>
          <input
            id="studentName"
            type="text"
            required
            placeholder="e.g. Arun Kumar"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-editorial text-sm bg-surface-primary border text-ink-primary placeholder:text-ink-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action ${
              errors.studentName ? 'border-status-error' : 'border-seam-strong'
            }`}
          />
          {errors.studentName && (
            <p className="mt-1.5 text-xs text-status-error font-body">{errors.studentName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-heading font-bold text-ink-primary mb-2">
            Email Address <span className="text-status-error">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="arun@college.edu or gmail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-editorial text-sm bg-surface-primary border text-ink-primary placeholder:text-ink-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action ${
              errors.email ? 'border-status-error' : 'border-seam-strong'
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-status-error font-body">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Phone & College Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-xs font-heading font-bold text-ink-primary mb-2">
            WhatsApp / Mobile Number <span className="text-status-error">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-editorial text-sm bg-surface-primary border text-ink-primary placeholder:text-ink-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action ${
              errors.phone ? 'border-status-error' : 'border-seam-strong'
            }`}
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs text-status-error font-body">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="college" className="block text-xs font-heading font-bold text-ink-primary mb-2">
            College / University Name <span className="text-status-error">*</span>
          </label>
          <input
            id="college"
            type="text"
            required
            placeholder="e.g. College of Engineering, Guindy"
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-editorial text-sm bg-surface-primary border text-ink-primary placeholder:text-ink-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action ${
              errors.college ? 'border-status-error' : 'border-seam-strong'
            }`}
          />
          {errors.college && (
            <p className="mt-1.5 text-xs text-status-error font-body">{errors.college}</p>
          )}
        </div>
      </div>

      {/* Department & Domain Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="department" className="block text-xs font-heading font-bold text-ink-primary mb-2">
            Department / Degree Branch
          </label>
          <select
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-editorial text-sm bg-surface-primary border border-seam-strong text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action"
          >
            <option value="CSE">Computer Science & Engineering (CSE)</option>
            <option value="IT">Information Technology (IT)</option>
            <option value="AI_DS">Artificial Intelligence & Data Science</option>
            <option value="ECE">Electronics & Communication (ECE)</option>
            <option value="EEE">Electrical & Electronics (EEE)</option>
            <option value="Mechanical">Mechanical / Mechatronics</option>
            <option value="Other">Other Engineering Branch</option>
          </select>
        </div>

        <div>
          <label htmlFor="domain" className="block text-xs font-heading font-bold text-ink-primary mb-2">
            Project Technical Domain
          </label>
          <select
            id="domain"
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-editorial text-sm bg-surface-primary border border-seam-strong text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action"
          >
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Electrical & Electronics">Electrical & Electronics</option>
            <option value="Internet of Things">Internet of Things</option>
            <option value="Embedded Systems & Hardware">Embedded Systems & Hardware</option>
          </select>
        </div>
      </div>

      {/* Service & Budget Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="service" className="block text-xs font-heading font-bold text-ink-primary mb-2">
            Required Service Engagement
          </label>
          <select
            id="service"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-editorial text-sm bg-surface-primary border border-seam-strong text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action"
          >
            <option value="Project Consultation & Planning">Project Consultation & Planning</option>
            <option value="Full-Stack Software Assistance">Full-Stack Software Assistance</option>
            <option value="AI / ML Guidance">AI / Machine Learning Guidance</option>
            <option value="Data Science & Analytics">Data Science & Analytics</option>
            <option value="Hardware, Embedded & IoT">Hardware, Embedded & IoT</option>
            <option value="Documentation & Paper Drafting">Documentation & IEEE Paper Drafting</option>
            <option value="Viva Coaching & Code Walkthrough">Viva Defense Coaching & Code Walkthrough</option>
          </select>
        </div>

        <div>
          <label htmlFor="approxBudget" className="block text-xs font-heading font-bold text-ink-primary mb-2">
            Estimated Budget Range
          </label>
          <select
            id="approxBudget"
            value={formData.approxBudget}
            onChange={(e) => setFormData({ ...formData, approxBudget: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-editorial text-sm bg-surface-primary border border-seam-strong text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action"
          >
            <option value="₹199 – ₹999 (Consultation / Viva Mentoring)">₹199 – ₹999 (Consultation / Viva)</option>
            <option value="₹799 – ₹1,499 (Documentation / PPT)">₹799 – ₹1,499 (Documentation / PPT)</option>
            <option value="₹3,000 – ₹5,000 (Basic Prototype)">₹3,000 – ₹5,000 (Basic Prototype)</option>
            <option value="₹6,000 – ₹10,000 (Full-Stack Software)">₹6,000 – ₹10,000 (Full-Stack Software)</option>
            <option value="₹7,000 – ₹15,000 (AI / Deep Learning)">₹7,000 – ₹15,000 (AI / ML)</option>
            <option value="₹10,000+ (Complex IoT / Embedded)">₹10,000+ (Complex IoT / Embedded)</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-heading font-bold text-ink-primary mb-2">
          Project Proposal, Problem Statement, or Technical Scope <span className="text-status-error">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          required
          placeholder="Briefly describe what you want to build, existing guide guidelines, reference IEEE papers, or specific technical roadblocks..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`w-full px-3.5 py-2.5 rounded-editorial text-sm bg-surface-primary border text-ink-primary placeholder:text-ink-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action ${
            errors.description ? 'border-status-error' : 'border-seam-strong'
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-status-error font-body">{errors.description}</p>
        )}
      </div>

      {/* Consent Checkbox */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-1 rounded border-seam-strong text-accent-action focus:ring-accent-action"
          />
          <span className="text-xs text-ink-secondary font-body leading-relaxed">
            I agree that this enquiry is for legitimate academic technology mentorship, code guidance, and project consultation in accordance with ASHKRI Academic Solutions&apos; ethical integrity standards. <span className="text-status-error">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1.5 text-xs text-status-error font-body">{errors.consent}</p>
        )}
      </div>

      <Button variant="primary" size="lg" type="submit" className="w-full">
        <Send className="w-4 h-4 mr-2" />
        Validate & Submit Consultation Request
      </Button>
    </form>
  );
}

