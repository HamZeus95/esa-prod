"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Project_1 = require("../models/Project");
const router = (0, express_1.Router)();
// Generate XML sitemap
router.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = process.env.FRONTEND_URL || 'https://ezzoghbi-structural.com';
        // Static pages
        const staticPages = [
            { url: '/', priority: '1.0', changefreq: 'weekly' },
            { url: '/about', priority: '0.8', changefreq: 'monthly' },
            { url: '/services', priority: '0.8', changefreq: 'monthly' },
            { url: '/projects', priority: '0.9', changefreq: 'weekly' },
            { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        ];
        // Get dynamic project pages
        const projects = await Project_1.Project.find({ status: 'active' }).select('_id updatedAt');
        const projectPages = projects.map((project) => ({
            url: `/projects/${project._id}`,
            priority: '0.6',
            changefreq: 'monthly',
            lastmod: project.updatedAt.toISOString()
        }));
        // Combine all pages
        const allPages = [...staticPages, ...projectPages];
        // Generate XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;
        res.set('Content-Type', 'application/xml');
        res.send(sitemap);
    }
    catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).send('Error generating sitemap');
    }
});
// Generate robots.txt
router.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.FRONTEND_URL || 'https://ezzoghbi-structural.com';
    const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/api/seo/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /uploads/temp/

# Allow important resources
Allow: /uploads/*.jpg
Allow: /uploads/*.jpeg
Allow: /uploads/*.png
Allow: /uploads/*.webp
Allow: /uploads/*.mp4
Allow: /uploads/*.webm`;
    res.set('Content-Type', 'text/plain');
    res.send(robots);
});
exports.default = router;
//# sourceMappingURL=seo.js.map