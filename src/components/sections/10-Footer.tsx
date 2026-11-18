import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../layout/Container';
import { ArrowUpRight, MessageCircle, Mail } from 'lucide-react';

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface-primary border-t border-seam-subtle pt-14 pb-10 transition-colors duration-200">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-seam-subtle">
          {/* Column 1: Brand Info & Identity (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link
              href="/"
              className="flex items-center gap-3.5 group mb-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-action"
            >
              <div className="relative w-10 h-10 rounded-editorial overflow-hidden bg-[#100E0E] border border-seam-strong flex-shrink-0 shadow-sm">
                <Image
                  src="/assets/brand/ashkri-logo.png"
                  alt="ASHKRI Technologies Emblem"
                  fill
                  className="object-contain p-0.5"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-lg tracking-wider text-ink-primary leading-tight">
                  ASHKRI
                </span>
                <span className="text-[11px] uppercase tracking-widest text-accent-brass font-medium leading-none">
                  Academic Solutions
                </span>
              </div>
            </Link>

            <p className="text-sm text-ink-secondary max-w-sm mb-4 font-body leading-relaxed">
              Your Project Idea. Our Technical Guidance. A professional academic engineering services platform bridging university research with industrial engineering standards.
            </p>

            <p className="text-xs font-heading font-medium text-ink-secondary/80">
              A specialized vertical of <strong className="text-ink-primary">ASHKRI Technologies</strong>.
            </p>
          </div>

          {/* Column 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-ink-primary mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li>
                <a href="#services" className="text-ink-secondary hover:text-accent-action transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#domains" className="text-ink-secondary hover:text-accent-action transition-colors">
                  Project Domains
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-ink-secondary hover:text-accent-action transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#work" className="text-ink-secondary hover:text-accent-action transition-colors">
                  Featured Work
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-ink-secondary hover:text-accent-action transition-colors">
                  Transparent Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Domains (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-ink-primary mb-4">
              Domains
            </h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li>
                <a href="#domains" className="text-ink-secondary hover:text-accent-action transition-colors">
                  CSE & IT
                </a>
              </li>
              <li>
                <a href="#domains" className="text-ink-secondary hover:text-accent-action transition-colors">
                  AI & Data Science
                </a>
              </li>
              <li>
                <a href="#domains" className="text-ink-secondary hover:text-accent-action transition-colors">
                  IoT & Robotics
                </a>
              </li>
              <li>
                <a href="#domains" className="text-ink-secondary hover:text-accent-action transition-colors">
                  Embedded Systems
                </a>
              </li>
              <li>
                <a href="#domains" className="text-ink-secondary hover:text-accent-action transition-colors">
                  ECE & EEE
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Channels & Inquiries (3 cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-ink-primary mb-4">
              Connect With Engineers
            </h4>
            <ul className="space-y-3 text-sm font-body">
              <li>
                <a
                  href="https://t.me/Ashkri_Technologies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ink-secondary hover:text-accent-action transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-accent-brass flex-shrink-0" />
                  <span>Telegram Community</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@ashkri.com"
                  className="inline-flex items-center gap-2 text-ink-secondary hover:text-accent-action transition-colors"
                >
                  <Mail className="w-4 h-4 text-accent-action flex-shrink-0" />
                  <span>contact@ashkri.com</span>
                </a>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-editorial bg-surface-elevated border border-seam-subtle text-[11px] text-ink-secondary leading-relaxed">
              <strong>Academic Integrity Policy:</strong> ASHKRI Academic Solutions provides engineering mentoring and guidance. We do not support plagiarism or academic dishonesty.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-secondary/80 font-body">
          <p>
            © {currentYear} ASHKRI Technologies. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="hover:text-ink-primary cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-ink-primary cursor-pointer transition-colors">
              Terms & Conditions
            </span>
            <span className="hover:text-ink-primary cursor-pointer transition-colors">
              Refund Policy
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

