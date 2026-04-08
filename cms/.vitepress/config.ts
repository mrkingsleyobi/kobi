import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kingsley Obi',
  description: 'Cybersecurity, AI, Technology, and Philosophy',
  lang: 'en-US',
  base: '/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:title', content: 'Kingsley Obi' }],
    ['meta', { property: 'og:site_name', content: 'Kingsley Obi' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://kingsleyobi.com/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@kingsleyobi' }]
  ],

  lastUpdated: false,
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: 'Blog', link: '/blog/' },
      { text: 'Telos', link: '/telos/' },
      { text: 'Manifesto', link: '/manifesto/' },
      { text: 'Projects', link: '/projects/' },
      { text: 'About', link: '/about/' }
    ],

    aside: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kingsleyobi' },
      { icon: 'twitter', link: 'https://twitter.com/kingsleyobi' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/kingsleyobi' }
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: '© 2024 Kingsley Obi'
    },

    editLink: false,
    outline: false,
    skipToContentLabel: false
  },

  markdown: {
    lineNumbers: true,
    config: (md) => {
      // Add custom markdown-it plugins if needed
    }
  },

  buildEnd: async (siteConfig) => {
    // Generate RSS feed
    const fs = await import('fs')
    const path = await import('path')

    const rssItems = []
    const blogDir = path.join(siteConfig.root, 'cms/blog')

    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

      for (const file of files) {
        const content = fs.readFileSync(path.join(blogDir, file), 'utf-8')
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
            rssItems.push({
              title: frontmatter.title,
              url: `https://kingsleyobi.com/blog/${frontmatter.slug}`,
              date: frontmatter.created_at,
              description: frontmatter.description || frontmatter.subtitle
            })
          }
        }
      }
    }

    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Kingsley Obi</title>
    <link>https://kingsleyobi.com</link>
    <description>Cybersecurity, AI, Technology, and Philosophy</description>
    <language>en-us</language>
${rssItems.map(item => `    <item>
      <title>${item.title}</title>
      <link>${item.url}</link>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${item.description}</description>
    </item>`).join('\n')}
  </channel>
</rss>`

    fs.writeFileSync(path.join(siteConfig.outDir, 'feed.rss'), rss)
  }
})
