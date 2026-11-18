# ASHKRI ACADEMIC SOLUTIONS
## Master Engineering Specification & Architecture Plan (Version 2.0)
**Parent Brand:** ASHKRI TECHNOLOGIES  
**Project:** Academic Technology & Project Assistance Platform  
**Target Market:** Engineering Students Across India (CSE, IT, AI & DS, ECE, EEE, IoT, Embedded Systems)  
**Engineering Lead Baseline:** Pre-Implementation Review & Phase 0 Discovery Baseline  

---

## 1. Executive Summary & Product Identity

### 1.1 Commercial & Technical Purpose
ASHKRI Academic Solutions is an academic technology services platform designed to bridge theoretical academic curricula with practical industrial engineering standards. The platform guides final-year engineering students through real-world software architecture, AI/ML pipelines, embedded systems, and technical documentation.

- **Primary Conversion Metric:** Qualified, high-intent technical project consultation enquiries.
- **Brand Slogan:** *"Your Project Idea. Our Technical Guidance."*
- **Corporate Positioning:** *"Engineering Intelligence. Enabling Innovation."*

### 1.2 Explicit First-Release Scope Boundaries (Non-Goals)
To preserve security, maintain development velocity, and control cloud footprint, the following are strictly excluded from Release 1:
- ❌ **No Public Student Login / Registration Portal:** Public visitors do not authenticate or manage accounts.
- ❌ **No Automated Payment Gateway:** No Razorpay/Stripe checkout in Release 1. Milestone payments (40/30/30) are recorded manually by administrators in Phase 4.
- ❌ **No Generic Project Download / Turnkey Marketplace:** We do not sell pre-packaged ZIP files.
- ❌ **No Full Learning Management System (LMS):** No video course hosting or quiz engines.
- ❌ **No Public Freelancer Marketplace:** Mentors and engineers are vetted internal/contracted specialists.

---

## 2. Information Architecture & Reconciled Sitemap

The architecture reconciles the Original Implementation Plan with the Modern Editorial Brief into **9 Public Core Pages** and **3 Supporting Legal Policies**.

```
ASHKRI Academic Solutions
│
├── 01. / (Home) ── 10 Sections (Hero, Service Overview, Domains, 5-Step Process, Portfolio, Pricing, Value Props, Testimonials, CTA, Footer)
├── 02. /services ── 7 Detailed Engineering Service Categories
├── 03. /project-domains ── 7 Specialized Engineering Domains
├── 04. /our-work ── Engineering Case Studies & Verified Demonstrations
├── 05. /how-it-works ── 6-Stage Comprehensive Mentorship Lifecycle
├── 06. /pricing ── 9 Indicative Pricing Tiers & 40/30/30 Milestone Framework
├── 07. /about ── Brand Philosophy, Parent Entity (ASHKRI Tech), Engineering Ethics
├── 08. /contact ── Conversion Hub: Structured Multi-Step Enquiry Form + Direct Channels
├── 09. /faq ── Categorized Accordion Knowledge Base
│
└── Supporting Legal Pages
    ├── /privacy-policy (DPDP / IT Act compliance, strict data retention)
    ├── /terms-and-conditions (Academic integrity rules, service boundaries)
    └── /refund-policy (Milestone-based cancellation & refund terms)
```

### 2.1 Reconciled Discrepancies Resolution Matrix
| Area | Original Plan v1.0 | Creative Brief | Architecture Resolution |
| :--- | :--- | :--- | :--- |
| **Sitemap Count** | 8 Pages | Added Dedicated Pricing | **9 Pages** (Dedicated `/pricing` for transparent conversion) |
| **Lifecycle Stages** | 6 Detailed Stages | 5 Visual Steps | **Reconciled:** 5 concise visual steps on `/` (Home), 6 comprehensive stages on `/how-it-works` |
| **Homepage Services** | 7 Categories | 6 Compact Cards | **Reconciled:** 6 summary cards on `/` (grouping AI & DS), 7 distinct deep-dive categories on `/services` |
| **Domain Taxonomies** | 7 Distinct Domains | 6 Grouped Domains | **7 Full Domains** in database & `/project-domains` |
| **Admin Dashboard** | Tagged as Phase 2 in v1.0 | Roadmap Phase 4 | **Phase 4 Implementation:** Post-enquiry engine validation |

---

## 3. Design System & Token Specification (Modern Editorial × Midnight Ink)

### 3.1 Color Palette & WCAG 2.2 AA Contrast Rectification
A critical accessibility audit revealed that the raw `#B65F43` terracotta against white buttons yielded a `4.46:1` contrast ratio, narrowly missing WCAG AA standards (`4.5:1` required). We have introduced `#B45B40` for actionable primary controls to achieve `4.66:1`.

```css
:root {
  /* Light Theme (Warm Paper & Midnight Ink) */
  --bg-primary: #F4F1EA;         /* Warm Paper */
  --surface-primary: #FFFFFF;    /* Clean White */
  --surface-elevated: #FAF8F5;   /* Subtle Warm Linen */
  --text-primary: #202B35;       /* Deep Midnight Ink */
  --text-secondary: #59616A;     /* Slate Neutral */
  --accent-terracotta: #B65F43;  /* Brand Terracotta */
  --accent-action: #B45B40;      /* WCAG 2.2 AA Calibrated Terracotta (4.66:1 vs #FFF) */
  --accent-brass: #C1A16B;       /* Antique Brass */
  --border-subtle: #E6DED1;      /* Linen Border */
  --border-strong: #D5CBBC;
  
  /* Status Semantics */
  --status-success: #2A6B48;
  --status-warning: #946800;
  --status-error: #B3261E;
  --status-info: #1D5C8A;
}

[data-theme="dark"] {
  /* Dark Theme (Deep Night & Elevated Slate) */
  --bg-primary: #121A22;         /* Deep Night */
  --surface-primary: #202B35;    /* Ink Container */
  --surface-elevated: #283641;   /* Elevated Slate */
  --text-primary: #F0ECE4;       /* Alabaster Text */
  --text-secondary: #B9C1C8;     /* Muted Silver */
  --accent-terracotta: #C77A5E;  /* Warm Terracotta Glow */
  --accent-action: #C77A5E;      /* Action Terracotta (Text: #121A22 Ink for high contrast) */
  --accent-brass: #C6AC7C;       /* Antique Brass Highlight */
  --border-subtle: #394651;      /* Midnight Seam */
  --border-strong: #4B5B69;
}
```

### 3.2 Typography Hierarchy
- **Editorial Headings & Accents:** `DM Serif Display`, Serif
- **Primary Structural Headlines & Navigation:** `Manrope`, Sans-Serif (Weights: 500, 600, 700, 800)
- **Body, Inputs & Technical Meta:** `Inter`, Sans-Serif (Weights: 400, 500, 600)
- **Code & Specs:** `JetBrains Mono` / `Fira Code`, Monospace

---

## 4. Technical Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│               Client Tier (Next.js 14+ App Router)              │
│  - React 18 / 19 Server Components by default                   │
│  - Interactive Islands: Form Engine, Theme Engine, Accordions   │
│  - Tailwind CSS + CSS Variable Design Tokens                    │
│  - Framer Motion (reduced-motion compliant)                     │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTPS / Server Actions / REST API
┌────────────────────────────────▼────────────────────────────────┐
│             Application & Business Layer (Node.js)              │
│  - Zod Request Validation & Sanitization                        │
│  - Rate Limiting (In-Memory / Redis Token Bucket)               │
│  - Private Document Security Scanner & MIME Magic Validator     │
│  - Role-Based Session Authorization (Admin Phase 4)             │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
┌────────────────▼──────────────┐ ┌──────────────▼────────────────┐
│   PostgreSQL Relational DB    │ │  Private Secure Document R2   │
│   (Prisma ORM Managed Schema) │ │  (Encrypted at rest, signed)  │
└───────────────────────────────┘ └───────────────────────────────┘
```

---

## 5. Security Threat Model & Safeguards

| Threat Vector | Potential Impact | Architecture Mitigation |
| :--- | :--- | :--- |
| **Malicious File Upload** | Remote code execution, malware distribution | Mandatory file signature verification (magic bytes), 10MB limit, whitelisted MIME types (`.pdf`, `.docx`, `.zip`), quarantined private bucket storage, zero public bucket exposure. |
| **Enquiry Form Bot Flooding** | Database exhaustion, spam notifications | Honeypot field trap + IP-based token-bucket rate limiting + CSRF origin check. |
| **SQL / ORM Injection** | Data exfiltration, data tampering | Strongly typed parameterized query generation via Prisma ORM; zero raw string interpolation. |
| **XSS (Cross-Site Scripting)** | Session hijacking, client credential theft | React auto-escaping, strict Content Security Policy (`CSP`), `HttpOnly`, `SameSite=Strict`, `Secure` cookie flags. |
| **Broken Object Level Auth (BOLA)**| Unauthorized access to student enquiries | Server-side authorization verifying admin session JWTs on every route handler and Server Action. |

---

## 6. Continuous QA & Verification Matrix

- **Unit Testing:** Vitest (validation schemas, token calculations, business rules).
- **Component Testing:** React Testing Library (Theme switcher, accordion, form input states).
- **End-to-End Testing:** Playwright (full enquiry journey submission, error state display, admin authentication flow).
- **Accessibility:** `@axe-core/playwright` CI gates enforcing zero WCAG 2.2 AA violations.
- **Performance Budget:** Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1).

