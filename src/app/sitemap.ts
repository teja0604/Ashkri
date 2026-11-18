import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ashkri.com'; // Canonical root
  const lastModified = new Date();

  const routes = [
    { url: '', priority: 1.0, changeFrequency: 'monthly' as const },
    { url: '/services', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/project-domains', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/pricing', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/our-work', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/privacy-policy', priority: 0.4, changeFrequency: 'yearly' as const },
    { url: '/terms-and-conditions', priority: 0.4, changeFrequency: 'yearly' as const },
    { url: '/refund-policy', priority: 0.4, changeFrequency: 'yearly' as const },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.url}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

