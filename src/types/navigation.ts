export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

// 6 primary desktop items + CTA
export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Domains', href: '/project-domains' },
  { label: 'Work', href: '/our-work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

// Full drawer and sitemap items
export const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Project Domains', href: '/project-domains' },
  { label: 'Our Work', href: '/our-work' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About Us', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];
