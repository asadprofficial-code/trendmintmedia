// ============================================================
// generate-sitemap.js
// Run this AFTER adding/editing articles in articles/data.json
// to rebuild sitemap.xml at the project root.
//
// HOW TO USE:
//   node tools/generate-sitemap.js
// ============================================================

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://trendmintmedia.com';
const jsonPath = path.join(__dirname, '..', 'articles', 'data.json');
const outPath = path.join(__dirname, '..', 'sitemap.xml');

if (!fs.existsSync(jsonPath)) {
  console.error('ERROR: articles/data.json not found.');
  process.exit(1);
}

const articles = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function toIsoDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
}

const staticUrls = [
  { loc: `${SITE_URL}/`, priority: '1.0' },
  { loc: `${SITE_URL}/about`, priority: '0.6' },
  { loc: `${SITE_URL}/services`, priority: '0.6' },
  { loc: `${SITE_URL}/listings`, priority: '0.8' },
  { loc: `${SITE_URL}/contact`, priority: '0.5' },
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

staticUrls.forEach(u => {
  xml += `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>\n`;
});

articles.forEach(a => {
  xml += `  <url>\n`;
  xml += `    <loc>${SITE_URL}/article/${a.slug}</loc>\n`;
  xml += `    <lastmod>${toIsoDate(a.date)}</lastmod>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;
});

xml += '</urlset>\n';

fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Success! sitemap.xml created with ${articles.length} articles + 5 static pages.`);
