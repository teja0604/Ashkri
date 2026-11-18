export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '#services' },
  { label: 'Domains', href: '#domains' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#why-ashkri' },
  { label: 'Pricing', href: '#pricing' },
];

