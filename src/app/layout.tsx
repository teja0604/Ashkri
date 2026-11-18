import type { Metadata, Viewport } from 'next';
import { manrope, inter, dmSerif } from '@/lib/fonts';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Navbar } from '@/components/navigation/Navbar';
import { FooterSection } from '@/components/sections/10-Footer';
import { getCanonicalSiteUrl } from '@/lib/site-url';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalSiteUrl()),
  title: 'ASHKRI Academic Solutions | Engineering Project Mentorship & Technology Guidance',
  description:
    'ASHKRI Academic Solutions provides engineering students across India with project consultation, technical mentoring, and structured development guidance across modern engineering domains.',
  keywords: [
    'Academic Project Assistance India',
    'Engineering Project Guidance',
    'Final Year Project Mentorship',
    'CSE Project Guidance',
    'AI Data Science Projects',
    'IoT Embedded Systems Assistance',
    'ASHKRI Technologies',
  ],
  authors: [{ name: 'ASHKRI Technologies' }],
  creator: 'ASHKRI Technologies',
  publisher: 'ASHKRI Technologies',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'ASHKRI Academic Solutions | Your Project Idea. Our Technical Guidance.',
    description:
      'Professional engineering project guidance and technical mentoring for final-year engineering students across India.',
    siteName: 'ASHKRI Academic Solutions',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASHKRI Academic Solutions',
    description: 'Engineering Intelligence. Enabling Innovation.',
  },
  icons: {
    icon: '/assets/brand/ashkri-logo.png',
    apple: '/assets/brand/ashkri-logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F1EA' },
    { media: '(prefers-color-scheme: dark)', color: '#121A22' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${inter.variable} ${dmSerif.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen flex flex-col font-body bg-bg-primary text-ink-primary antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <FooterSection />
        </ThemeProvider>
      </body>
    </html>
  );
}

