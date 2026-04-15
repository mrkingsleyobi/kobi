<script setup lang="ts">
import { onMounted, computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import type { Frontmatter } from './types'
import PageGutter from './components/PageGutter.vue'

const { Layout } = DefaultTheme
const { frontmatter, page } = useData<Frontmatter>()

// Function to add footer social links
const addFooterSocialLinks = () => {
  const footer = document.querySelector('.VPFooter')
  if (!footer) return

  // Check if we've already added the links
  if (footer.querySelector('.footer-social-links')) return

  // Create social links container
  const socialLinks = document.createElement('div')
  socialLinks.className = 'footer-social-links'

  // Define all social links with Iconify icons
  const links = [
    { url: 'mailto:contact@kingsleyobi.com', icon: 'mdi:email', label: 'Email' },
    { url: 'https://linkedin.com/in/mrkingsleyobi', icon: 'mdi:linkedin', label: 'LinkedIn' },
    { url: 'https://youtube.com/@mrkingsleyobi', icon: 'mdi:youtube', label: 'YouTube' },
    { url: 'https://x.com/mrkingsleyobi', icon: 'simple-icons:x', label: 'X' },
    { url: 'https://github.com/mrkingsleyobi', icon: 'mdi:github', label: 'GitHub' },
    { url: '/podcast', icon: 'mdi:podcast', label: 'Podcast' },
    { url: '/feed.rss', icon: 'mdi:rss', label: 'RSS' }
  ]

  // Create link elements with Iconify
  links.forEach(link => {
    const a = document.createElement('a')
    a.href = link.url
    a.title = link.label
    a.target = '_blank'
    a.rel = 'noopener noreferrer'

    // Create iconify-icon element
    const icon = document.createElement('iconify-icon')
    icon.setAttribute('icon', link.icon)
    icon.setAttribute('width', '24')
    icon.setAttribute('height', '24')

    a.appendChild(icon)
    socialLinks.appendChild(a)
  })

  // Insert at the beginning of footer (before the message)
  footer.insertBefore(socialLinks, footer.firstChild)
}

// Function to add theme-title class to navbar title
const addThemeTitleClass = () => {
  const navbarTitle = document.querySelector('.VPNavBarTitle .title')
  if (navbarTitle) {
    const span = navbarTitle.querySelector('span')
    if (span && !span.classList.contains('theme-title')) {
      span.classList.add('theme-title')
    }
  }
}

onMounted(() => {
  setTimeout(addThemeTitleClass, 100)
  setTimeout(addFooterSocialLinks, 200)
})
</script>

<template>
  <Layout>
    <template #layout-top>
      <PageGutter />
    </template>
  </Layout>
</template>

<style>
/* Hide skip to content link on landing page */
.VPSkipLink {
  display: none !important;
}

/* Page Title Gutter - contains frontmatter */
.page-title {
  display: block;
  width: 100%;
  padding: 32px 24px;
  margin-bottom: 32px;
  margin-top: 0;
  border-bottom: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  box-sizing: border-box;
  clear: both;
  position: relative;
  z-index: 10;
}

.page-title .frontmatter-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.page-title .frontmatter-subtitle {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.page-title .frontmatter-created-at {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0 0 12px 0;
}

.page-title .frontmatter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0 0;
}

.page-title .tag-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 14px;
  transition: opacity 0.2s ease;
}

.page-title .tag-link:hover {
  opacity: 0.8;
}

.page-title .description {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin: 8px 0 0 0;
  line-height: 1.5;
}

.page-title .viewer-count {
  display: inline-block;
  margin-top: 16px;
  padding: 6px 12px;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.page-title .viewer-count-number {
  font-weight: 700;
}

/* Style aside elements in content */
.vp-doc aside {
  display: block !important;
  visibility: visible !important;
  padding: 24px 28px;
  margin: 40px 0;
  border-left: 6px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-style: italic;
  line-height: 1.8;
  border-radius: 8px;
  font-size: 17px;
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.vp-doc aside:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: var(--vp-c-brand-1);
  border-radius: 8px 0 0 8px;
}

/* Style callout and tutorial components */
.vp-doc .callout,
.vp-doc .tutorial {
  display: block;
  padding: 16px 20px;
  margin: 24px 0;
  border-left: 4px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

/* Footer Social Links */
.footer-social-links {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 16px;
}

.footer-social-links a {
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;
}

.footer-social-links a:hover {
  color: var(--vp-c-brand-1);
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    padding: 24px 16px;
    margin-bottom: 24px;
  }

  .page-title .frontmatter-title {
    font-size: 24px;
  }

  .page-title .frontmatter-subtitle {
    font-size: 16px;
  }

  .footer-social-links {
    flex-wrap: wrap;
  }
}
</style>