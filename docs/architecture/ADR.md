# Architecture Decision Records (ADRs)
## ASHKRI Academic Solutions — Engineering Baseline

### ADR-01: Next.js App Router Architecture with React Server Components
- **Status:** Approved
- **Context:** The public website requires optimal SEO, instant First Contentful Paint (FCP), and minimal client-side JavaScript payloads.
- **Decision:** Build on Next.js 14+ utilizing the App Router (`src/app`). All marketing, informational, and portfolio pages will be React Server Components (`RSC`) by default. Client Components (`'use client'`) will be isolated strictly to interactive islands (Theme Switcher, Navigation Mobile Drawer, Accordions, and Form State controllers).
- **Consequences:** Maximizes Core Web Vitals (LCP < 2.5s, zero CLS), reduces initial bundle weight to < 85kB compressed, and preserves zero-JS server rendering for static content.

---

### ADR-02: Modern Editorial × Midnight Ink Design System & Theme Engine
- **Status:** Approved
- **Context:** The brand requires a distinguished academic-engineering aesthetic ("Modern Editorial") distinct from cheap generic project marketplaces or sterile corporate SaaS templates.
- **Decision:** Implement a three-mode semantic CSS token engine (`Light`, `Dark`, `System`) using HTML `data-theme` attributes.
  - Light Mode: Warm Paper (`#F4F1EA`) with Midnight Ink (`#202B35`), Terracotta (`#B65F43`), Antique Brass (`#C1A16B`).
  - Dark Mode: Deep Night (`#121A22`) with Elevated Slate (`#283641`), Light Alabaster (`#F0ECE4`).
  - Persistence: Managed via `localStorage` with an inline blocking head script to eliminate theme-flashing (FOUC).
- **Consequences:** Provides high visual sophistication while ensuring smooth transitions without component re-renders.

---

### ADR-03: Accessibility Contrast Fix for Terracotta Primary Actions
- **Status:** Approved
- **Context:** Mathematical WCAG 2.2 audit revealed that the raw brand Terracotta (`#B65F43`) with `#FFFFFF` text achieved only a `4.46:1` contrast ratio, failing the WCAG AA minimum threshold of `4.5:1` for normal body and button labels.
- **Decision:** Introduce a dedicated semantic token `--accent-action: #B45B40` for light theme primary button backgrounds, delivering a certified `4.66:1` contrast ratio against pure white text. In dark mode, Terracotta buttons (`#C77A5E`) will render with deep midnight ink text (`#121A22`) yielding a `5.33:1` contrast ratio.
- **Consequences:** Guarantees 100% WCAG 2.2 AA compliance without compromising brand identity.

---

### ADR-04: Relational Data Modeling via PostgreSQL and Prisma ORM
- **Status:** Approved
- **Context:** Enquiries require strict relational data integrity, tracking status transitions, audit notes, uploaded file references, and future quotation/milestone records.
- **Decision:** Use PostgreSQL as the relational data store with Prisma ORM for schema definitions, migrations, and compile-time type safety.
- **Consequences:** Prevents SQL injection via automated parameterized queries, enforces foreign-key constraints on cascade behaviors, and supplies typed interfaces directly to server handlers.

---

### ADR-05: Private Object Storage with Presigned URL Authorization
- **Status:** Approved
- **Context:** Final-year engineering students frequently attach project requirement briefs, IEEE papers, block diagrams, or syllabus PDFs to enquiries.
- **Decision:** Uploaded files will never be stored in public asset directories or exposed via public CDN URLs. Files will be sanitized, renamed with cryptographically random UUIDs, validated for magic-byte file signatures, and stored in a private object bucket (AWS S3 or Cloudflare R2). File downloads will require authenticated administrator sessions issuing short-lived (15-minute) presigned URLs.
- **Consequences:** Eliminates data leaks, prevents malware execution, and satisfies Indian DPDP Act requirements.

---

### ADR-06: Release 1 Commercial Boundaries (Deferred Payment Gateway & Portal)
- **Status:** Approved
- **Context:** Launching with automated payment gateways or full student login accounts introduces immediate compliance liabilities, KYC hurdles, refund dispute overheads, and security attack surfaces.
- **Decision:** Release 1 will focus solely on customer acquisition, technical credibility, and qualified enquiry capture. Project engagements follow a 40% booking, 30% intermediate demo, 30% final handover structure, recorded manually by ASHKRI administrators in Phase 4.
- **Consequences:** Accelerates time to market, reduces initial operational complexity, and eliminates payment fraud risks during initial launch.

---

### ADR-07: Testing Pyramid (Vitest, React Testing Library, Playwright, axe-core)
- **Status:** Approved
- **Context:** Engineering quality must be proven continuously rather than deferred to an ad-hoc manual testing pass before launch.
- **Decision:** 
  1. Vitest for unit logic and Zod validation schemas.
  2. React Testing Library for interactive component behavior.
  3. Playwright for end-to-end multi-viewport (1920px down to 360px) user journeys.
  4. `@axe-core/playwright` for automated accessibility regression gating.
- **Consequences:** Enforces zero-regression builds across responsive viewports and themes.

