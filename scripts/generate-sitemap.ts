#!/usr/bin/env bun

/**
 * Sitemap Generator for VitePress
 * Generates sitemap.xml after build
 */

import { writeFileSync, readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DOMAIN = 'https://kingsleyobi.com'
const OUT_DIR = 'cms/.vitepress/dist'

interface SitemapEntry {
  url: string
  changefreq: string
  priority: number
  lastmod?: string
}

const entries: SitemapEntry[] = [
  { url: '', changefreq: 'daily', priority: 1.0 },
  { url: '/blog/', changefreq: 'daily', priority: 0.9 },
  { url: '/telos/', changefreq: 'weekly', priority: 0.8 },
  { url: '/manifesto/', changefreq: 'weekly', priority: 0.7 },
  { url: '/projects/', changefreq: 'weekly', priority: 0.7 },
  { url: '/about/', changefreq: 'monthly', priority: 0.6 }
]

// Add blog posts
const blogDir = join(process.cwd(), 'cms/blog')
if (existsSync(blogDir)) {
  const files = readdirSync(blogDir).filter(f => f.endsWith('.md'))

  for (const file of files) {
    const content = readFileSync(join(blogDir, file), 'utf-8')
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/)

    if (frontmatterMatch) {
      const frontmatter: any = {}
      const lines = frontmatterMatch[1].split('\n')

      for (const line of lines) {
        const match = line.match(/^(\w+):\s*(.+)$/)
        if (match) {
          const [, key, value] = match
          frontmatter[key] = value.replace(/^["']|["']$/g, '')
        }
      }

      if (frontmatter.status === 'published') {
        entries.push({
          url: `/blog/${frontmatter.slug}`,
          changefreq: 'monthly',
          priority: 0.8,
          lastmod: frontmatter.updated_at || frontmatter.created_at
        })
      }
    }
  }
}

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${DOMAIN}${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`

writeFileSync(join(OUT_DIR, 'sitemap.xml'), sitemap)
console.log('✅ Sitemap generated successfully')
