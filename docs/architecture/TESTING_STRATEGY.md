# Continuous Quality Assurance & Testing Strategy
## ASHKRI Academic Solutions

---

### 1. Verification Hierarchy

```
       /\
      /  \       E2E Tests (Playwright)
     /    \      - Critical visitor journey (Home -> Service -> Enquiry)
    /──────\     - Admin session & enquiry lifecycle
   /        \    
  /          \   Integration Tests (Vitest + Supertest)
 /            \  - Server Actions, Zod validation, Prisma queries
/──────────────\ 
/                \ Component & Unit Tests (Vitest + RTL)
/                  \ - Pure functions, calculations, UI component states
/────────────────────\
```

---

### 2. Test Execution Matrix

| Test Suite | Framework | Scope & Execution Boundary |
| :--- | :--- | :--- |
| **Unit & Schema** | Vitest | Zod schemas, enquiry reference code generators (`ASH-YYYYMM-XXXX`), currency formatting. |
| **Components** | React Testing Library | Button states, ThemeSwitcher persistence, Accordion expand/collapse, Form input error states. |
| **End-to-End** | Playwright | Full browser automation across Chromium, Firefox, WebKit, Mobile Safari, Android Chrome. |
| **Accessibility** | `@axe-core/playwright` | Automated evaluation against WCAG 2.2 AA rules (color contrast, aria labels, tab indexing). |
| **Performance** | Lighthouse CI | Core Web Vitals checks on build artifacts before deployment. |

---

### 3. Critical Test Cases

#### FT-01 to FT-06: Navigation & Theming
- Verify that switching to Dark Theme immediately updates `document.documentElement.dataset.theme = 'dark'`.
- Verify that page reloads maintain user's selected theme preference without FOUC (flash of unstyled content).
- Verify mobile drawer toggle, tab-trap, and focus return on close.

#### FT-07 to FT-12: Enquiry Pipeline
- Verify valid submission generates unique reference number and persists in PostgreSQL.
- Verify server rejects invalid email, empty mandatory fields, and over-length strings.
- Verify attachment upload fails safely on unsupported extensions (`.exe`, `.sh`) or files > 10MB.
- Verify honeypot field trip immediately aborts processing without saving to database.

#### FT-13 to FT-15: Protected Administration
- Verify unauthenticated GET requests to `/admin/*` redirect to `/admin/login` with 307 status.
- Verify admin status change triggers an audit row in `EnquiryStatusHistory`.

