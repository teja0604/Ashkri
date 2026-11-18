import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "360px",
      sm: "390px",
      md: "768px",
      lg: "1280px",
      xl: "1440px",
      "2xl": "1920px",
    },
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
        },
        surface: {
          primary: "var(--surface-primary)",
          elevated: "var(--surface-elevated)",
        },
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        accent: {
          terracotta: "var(--accent-terracotta)",
          action: "var(--accent-action)",
          brass: "var(--accent-brass)",
        },
        seam: {
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          error: "var(--status-error)",
          info: "var(--status-info)",
        },
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-dm-serif)", "serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      boxShadow: {
        editorial: "0 4px 20px -2px rgba(26, 32, 44, 0.05), 0 2px 6px -1px rgba(26, 32, 44, 0.03)",
        "editorial-elevated": "0 10px 30px -4px rgba(26, 32, 44, 0.08), 0 4px 10px -2px rgba(26, 32, 44, 0.04)",
        focus: "0 0 0 3px var(--focus-ring)",
      },
      borderRadius: {
        editorial: "6px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

