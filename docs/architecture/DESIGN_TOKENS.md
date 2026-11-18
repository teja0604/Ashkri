# Design System & Token Specifications
## ASHKRI Academic Solutions — Modern Editorial × Midnight Ink

---

### 0. Verified Brand Identity Assets & Logo Extraction

- **Source Asset:** `ASHKRI Technologies Logo.png` (1536×1024px, 3D Sculptural Bevel Render).
- **Core Visual Motif:**
  - **Monogram Mark:** Interlocked geometric "A" and "K" in brushed titanium/champagne brass with precision beveled edges.
  - **Dynamic Ribbon:** Smooth dual-curved crossbar flowing through the "A" into the "K", featuring deep burgundy (`#7A2534`) and bright terracotta ribbon trim (`#C86644`).
  - **Wordmark:** Modern wide-track geometric sans-serif "ASHKRI" with custom triangular inner-counter inside the "A", subtitled with `— TECHNOLOGIES —`.
- **Phase 1 Asset Derivation Pipeline:**
  1. **Master Lockup:** Optimized WebP/PNG and SVG vector trace for desktop header.
  2. **Monogram Icon:** Cropped 1:1 square emblem for Mobile Drawer, Sticky Navbar shrink state, and multi-resolution Favicons (16×16, 32×32, 180×180 Apple Touch, 192×192 PWA).
  3. **Theme Compatibility:** Transparent background cutout with adaptive drop shadow for seamless rendering on both `--color-bg: #F4F1EA` (Light Warm Paper) and `--color-bg: #121A22` (Dark Deep Night).

---

### 1. Viewport Matrix & Breakpoints

| Breakpoint Name | Viewport Target | Layout Behavior | Navigation Mode |
| :--- | :--- | :--- | :--- |
| **2XL** | `1920px+` | Wide editorial composition, max content container 1280px, expanded gutters | Desktop Full Header |
| **XL** | `1440px` | Primary Desktop baseline design viewport | Desktop Full Header |
| **LG** | `1280px` | Standard Laptop, condensed horizontal gutters (48px) | Desktop Full Header |
| **MD** | `768px - 1024px` | Tablet viewport, 2-column service/domain grid | Tablet Nav with CTA |
| **SM** | `390px` | Modern Mobile (iPhone 13/14/15/16 Pro baseline) | Off-canvas Drawer Menu |
| **XS** | `360px` | Small Android viewport, compact typography, stacked buttons | Off-canvas Drawer Menu |

---

### 2. Semantic Color Tokens

#### Light Mode (Warm Paper & Midnight Ink)
```css
:root {
  --color-bg: #F4F1EA;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #FAF8F5;
  --color-text-main: #202B35;
  --color-text-muted: #59616A;
  --color-border: #E6DED1;
  --color-border-subtle: #EDE7DC;

  /* Accent & Action */
  --color-terracotta: #B65F43;
  --color-terracotta-action: #B45B40; /* Certified WCAG AA 4.66:1 vs White Text */
  --color-brass: #C1A16B;
  --color-linen: #E6DED1;
  
  /* Focus Rings & Form States */
  --color-focus: #B45B40;
  --color-input-bg: #FFFFFF;
  --color-input-border: #D5CBBC;
}
```

#### Dark Mode (Deep Night & Elevated Ink)
```css
[data-theme="dark"] {
  --color-bg: #121A22;
  --color-surface: #202B35;
  --color-surface-elevated: #283641;
  --color-text-main: #F0ECE4;
  --color-text-muted: #B9C1C8;
  --color-border: #394651;
  --color-border-subtle: #2C3843;

  /* Accent & Action */
  --color-terracotta: #C77A5E;
  --color-terracotta-action: #C77A5E; /* Uses #121A22 text for 5.33:1 contrast */
  --color-brass: #C6AC7C;
  --color-linen: #283641;
  
  /* Focus Rings & Form States */
  --color-focus: #C6AC7C;
  --color-input-bg: #1B252E;
  --color-input-border: #3E4B57;
}
```

---

### 3. Typography System

| Role | Font Family | Size (Desktop) | Size (Mobile) | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `DM Serif Display`, serif | 64px (4rem) | 38px (2.375rem) | 1.1 | -0.02em |
| **Section Title (H2)**| `Manrope`, sans-serif | 42px (2.625rem) | 28px (1.75rem) | 1.2 | -0.015em |
| **Subsection (H3)** | `Manrope`, sans-serif | 28px (1.75rem) | 22px (1.375rem) | 1.3 | -0.01em |
| **Card Heading (H4)** | `Manrope`, sans-serif | 20px (1.25rem) | 18px (1.125rem) | 1.4 | -0.005em |
| **Lead Paragraph** | `Inter`, sans-serif | 18px (1.125rem) | 16px (1.0rem) | 1.6 | 0 |
| **Body Standard** | `Inter`, sans-serif | 16px (1.0rem) | 15px (0.9375rem) | 1.6 | 0 |
| **UI Meta / Label** | `Manrope`, sans-serif | 13px (0.8125rem) | 12px (0.75rem) | 1.4 | +0.03em |

---

### 4. Interactive Components & Micro-Interactions

1. **Buttons:**
   - Primary: Action Terracotta fill (`--color-terracotta-action`), rounded-md (6px), 14px Manrope SemiBold, subtle lift shadow on hover, active depression.
   - Secondary: Transparent with 1.5px border (`--color-border`), hover surface lift.
   - Ghost: Transparent with subtle text color shift and underline trace on hover.
2. **Theme Switcher:**
   - 3-segment pill or dropdown with Sun (Light), Moon (Dark), and Monitor (System) icons.
   - Smooth 200ms ease-out transitions on CSS custom properties.
3. **Motion Restrictions:**
   - Compliant with `@media (prefers-reduced-motion: reduce)`. Animations degrade gracefully to instant state toggles.

