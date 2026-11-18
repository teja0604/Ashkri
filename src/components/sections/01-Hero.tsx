'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';

export function HeroSection() {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Section spacing="default" className="pt-8 sm:pt-12 md:pt-16 pb-16 md:pb-24 border-b border-seam-subtle">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="accent" size="md">
                Academic Technology & Project Assistance
              </Badge>
              <span className="hidden sm:inline-block text-xs font-heading font-medium text-ink-secondary">
                · Pan-India Mentorship
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold text-ink-primary tracking-tight leading-[1.12] mb-6 text-balance">
              Great Ideas Deserve{' '}
              <span className="font-serif italic font-normal text-accent-brass">
                Thoughtful
              </span>{' '}
              Engineering.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-ink-secondary leading-relaxed mb-8 max-w-2xl font-body">
              ASHKRI Academic Solutions provides engineering students with rigorous project consultation,
              technical mentoring, and structured development guidance across modern engineering domains.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <Button
                variant="primary"
                size="lg"
                onClick={scrollToContact}
                className="w-full sm:w-auto"
              >
                Discuss Your Project
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={scrollToServices}
                className="w-full sm:w-auto"
              >
                Explore Services
              </Button>
            </div>

            {/* Trust Anchors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-seam-subtle w-full text-xs sm:text-sm font-heading font-medium text-ink-secondary">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                <span>Industry Code Standards</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent-action flex-shrink-0" />
                <span>Strict Academic Integrity</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-accent-brass flex-shrink-0" />
                <span>Milestone-Based Handover</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Master Emblem & Engineering Motif */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-[#100E0E] to-[#1C1718] border border-seam-strong p-6 sm:p-8 flex flex-col justify-between shadow-editorial-elevated overflow-hidden group">
              {/* Background ambient glow */}
              <div
                className="absolute -top-24 -right-24 w-64 h-64 bg-accent-terracotta/20 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-brass/15 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Master Logo Framing */}
              <div className="relative z-10 flex items-center justify-between">
                <Badge variant="brass" size="sm">
                  Engineering Intelligence
                </Badge>
                <span className="text-[11px] font-heading font-semibold text-white/50 tracking-wider">
                  EST. ASHKRI TECH
                </span>
              </div>

              {/* Centered High-Res Emblem Display */}
              <div className="relative z-10 w-full h-48 sm:h-56 my-auto flex items-center justify-center">
                <div className="relative w-full h-full max-h-48 transition-transform duration-500 ease-out group-hover:scale-105">
                  <Image
                    src="/assets/brand/ashkri-logo.png"
                    alt="ASHKRI Technologies Master Monogram"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>

              {/* Tagline & Slogan */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70 font-heading">
                <span>Your Project Idea.</span>
                <span className="text-accent-brass font-medium">Our Technical Guidance.</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

