import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kingsley Obi',
  description: 'Cybersecurity, AI, Technology, and Philosophy. Expert AI coaching and agentic engineering consultation. Personalized sessions on autonomous AI systems, neural networks, and multi-agent orchestration. Book your consultation today.',
  lang: 'en-US',
  base: '/',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:title', content: 'Kingsley Obi' }],
    ['meta', { property: 'og:site_name', content: 'Kingsley Obi' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://kingsleyobi.com/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@mrkingsleyobi' }],
    ['script', { src: 'https://code.iconify.design/iconify-icon/1.0.8/iconify-icon.min.js', defer: true }],
    [
      'script',
      {},
      "(function(){try{var t=localStorage.getItem('kobi-theme');if(t!=='sepia'&&t!=='dusk'&&t!=='normal'){t='normal'}var r=document.documentElement;r.setAttribute('data-theme',t);if(t==='dusk'){r.classList.add('dark')}}catch(e){}})();"
    ]
  ],

  lastUpdated: false,
  cleanUrls: true,

  // Disable VitePress's own light/dark toggle - the redesign has its own
  // persisted three-way (Normal/Sepia/Dusk) theme switcher in the footer,
  // see cms/.vitepress/theme/components/ThemeSwitcher.vue.
  appearance: false,

  // NOTE: VitePress's built-in local search is intentionally disabled.
  // The redesign's header search icon opens a custom CommandPalette (⌘K)
  // component instead - see cms/.vitepress/theme/components/CommandPalette.vue.

  // NOTE: themeConfig/nav/footer/sidebar options are intentionally omitted.
  // Layout.vue no longer extends VitePress's DefaultTheme - the header, nav,
  // and footer are fully custom components (Header.vue/Footer.vue) rendered
  // directly from the approved Lavish prototype markup, so VitePress's own
  // themeConfig-driven chrome is never mounted.

  markdown: {
    lineNumbers: true,
    config: (md) => {
      // Allow HTML tags in markdown (required for <aside> elements)
      md.set({ html: true })
    }
  },

  vue: {
    template: {
      compilerOptions: {
        // <iconify-icon> is a web component loaded via the Iconify CDN script
        // in head - tell Vue's compiler not to try to resolve it as a Vue
        // component (used in MobileDrawer.vue / OverflowMenu.vue).
        isCustomElement: (tag) => tag === 'iconify-icon'
      }
    }
  },

  buildEnd: async (siteConfig) => {
    // Generate RSS feed
    const fs = await import('fs')
    const path = await import('path')

    const rssItems = []
    // siteConfig.root is already the VitePress source dir (cms/), so the
    // blog directory lives directly under it - not cms/cms/blog.
    const blogDir = path.join(siteConfig.root, 'blog')

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
    <description>Cybersecurity, AI, Technology, and Philosophy. Expert AI coaching and agentic engineering consultation. Personalized sessions on autonomous AI systems, neural networks, and multi-agent orchestration. Book your consultation today.</description>
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
