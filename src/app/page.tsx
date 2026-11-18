import { HeroSection } from '@/components/sections/01-Hero';
import { ServicesOverviewSection } from '@/components/sections/02-ServicesOverview';
import { ProjectDomainsSection } from '@/components/sections/03-ProjectDomains';
import { HowItWorksSection } from '@/components/sections/04-HowItWorks';
import { FeaturedWorkSection } from '@/components/sections/05-FeaturedWork';
import { PricingOverviewSection } from '@/components/sections/06-PricingOverview';
import { WhyAshkriSection } from '@/components/sections/07-WhyAshkri';
import { TestimonialsSection } from '@/components/sections/08-Testimonials';
import { FinalCTASection } from '@/components/sections/09-FinalCTA';

export default function HomePage() {
  return (
    <>
      {/* 01. Hero */}
      <HeroSection />

      {/* 02. Services Overview */}
      <ServicesOverviewSection />

      {/* 03. Project Domains */}
      <ProjectDomainsSection />

      {/* 04. How It Works */}
      <HowItWorksSection />

      {/* 05. Featured Work */}
      <FeaturedWorkSection />

      {/* 06. Pricing Overview */}
      <PricingOverviewSection />

      {/* 07. Why ASHKRI */}
      <WhyAshkriSection />

      {/* 08. Testimonials */}
      <TestimonialsSection />

      {/* 09. Final CTA */}
      <FinalCTASection />
    </>
  );
}

