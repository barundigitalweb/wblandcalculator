import type { APIRoute } from 'astro';

const pages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: 'irregular-land-calculator', priority: '0.9', changefreq: 'weekly' },
  { url: 'katha-to-sqft-west-bengal', priority: '0.9', changefreq: 'weekly' },
  { url: 'satak-to-katha-calculator', priority: '0.9', changefreq: 'weekly' },
  { url: 'bigha-to-katha-west-bengal', priority: '0.8', changefreq: 'monthly' },
  { url: 'chatak-to-sqft', priority: '0.8', changefreq: 'monthly' },
  { url: 'wb-stamp-duty-calculator', priority: '0.8', changefreq: 'weekly' },
  { url: 'about', priority: '0.5', changefreq: 'monthly' },
  { url: 'privacy-policy', priority: '0.5', changefreq: 'monthly' },
  { url: 'terms', priority: '0.5', changefreq: 'monthly' },
  { url: 'disclaimer', priority: '0.5', changefreq: 'monthly' },
  { url: 'contact', priority: '0.5', changefreq: 'monthly' }
];

export const GET: APIRoute = async () => {
  const siteUrl = 'https://wblandcalculator.com';
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}/${page.url ? `${page.url}/` : ''}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
