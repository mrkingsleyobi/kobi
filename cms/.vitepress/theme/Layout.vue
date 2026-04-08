<script setup lang="ts">
import { onMounted, onUpdated, computed, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, useRouter } from 'vitepress'
import type { Frontmatter } from './types'
import { formatDate, parseTags } from './utils/format'

const { Layout } = DefaultTheme
const { frontmatter, page } = useData<Frontmatter>()
const router = useRouter()

// Function to move VPNav outside Layout wrapper
const moveNavbarOutsideLayout = async () => {
  await nextTick()

  const navbar = document.querySelector('.VPNav')
  const layout = document.querySelector('.Layout')
  const app = document.querySelector('#app')

  if (!navbar || !layout || !app) {
    console.log('Layout: Could not find navbar, layout, or app')
    return
  }

  // Check if navbar is already in correct position (sibling of Layout)
  if (navbar.parentElement === app && navbar.nextElementSibling === layout) {
    console.log('Layout: Navbar already positioned correctly as sibling of Layout')
    return
  }

  // Move navbar to be sibling of Layout (before it)
  app.insertBefore(navbar, layout)

  console.log('Layout: Moved VPNav to be sibling of Layout wrapper')
}

const tags = computed(() => parseTags(frontmatter.value.tags))
const createdDate = computed(() =>
  frontmatter.value.created_at ? formatDate(frontmatter.value.created_at) : null
)
const updatedDate = computed(() =>
  frontmatter.value.updated_at && frontmatter.value.updated_at !== frontmatter.value.created_at
    ? formatDate(frontmatter.value.updated_at)
    : null
)

const showGutter = computed(() => page.value.relativePath !== 'index.md')

// Store observer reference to avoid multiple instances
let navbarObserver: MutationObserver | null = null

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

// Function to hide/show navbar based on page
const updateNavbarVisibility = () => {
  const navbar = document.querySelector('.VPNavBar')
  if (!navbar) return

  // Clean up existing observer
  if (navbarObserver) {
    navbarObserver.disconnect()
    navbarObserver = null
  }

  if (page.value.relativePath === 'index.md') {
    navbar.classList.add('hide-navbar')
    navbar.style.display = 'none'
    navbar.style.visibility = 'hidden'
    navbar.style.opacity = '0'

    // Keep it hidden even if VitePress tries to show it
    navbarObserver = new MutationObserver(() => {
      if (navbar.classList.contains('hide-navbar') && navbar.style.display !== 'none') {
        navbar.style.display = 'none'
        navbar.style.visibility = 'hidden'
        navbar.style.opacity = '0'
      }
    })
    navbarObserver.observe(navbar, {
      attributes: true,
      attributeFilter: ['class', 'style']
    })
  } else {
    navbar.classList.remove('hide-navbar')
    navbar.style.display = ''
    navbar.style.visibility = ''
    navbar.style.opacity = ''
  }
}

// Function to inject/re-inject gutter
const injectGutter = () => {
  // Skip on homepage - no gutter needed, no cleanup, no DOM manipulation at all
  if (page.value.relativePath === 'index.md') {
    console.log('Layout: Skipping gutter for homepage - no DOM manipulation')
    return
  }

  // For non-homepage only: clean up existing gutters, page titles, and dp-doc wrappers first
  const allWrappers = document.querySelectorAll('.page-wrapper')
  const allPageTitles = document.querySelectorAll('.page-title')
  const allDpDocs = document.querySelectorAll('.dp-doc')

  // Restore any previously wrapped content back to original structure
  allDpDocs.forEach(wrapper => {
    const main = wrapper.querySelector('.main')
    const docFooter = wrapper.querySelector('.VPDocFooter')

    if (main && wrapper.parentElement) {
      wrapper.parentElement.insertBefore(main, wrapper)
    }
    if (docFooter && wrapper.parentElement) {
      wrapper.parentElement.appendChild(docFooter)
    }
    wrapper.remove()
  })

  allWrappers.forEach(wrapper => {
    const vpDoc = wrapper.querySelector('.VPDoc')
    if (vpDoc && wrapper.parentElement) {
      wrapper.parentElement.insertBefore(vpDoc, wrapper)
    }
    wrapper.remove()
  })

  allPageTitles.forEach(title => {
    title.remove()
  })

  console.log('Layout: Cleaned up', allWrappers.length, 'wrappers,', allPageTitles.length, 'page titles, and', allDpDocs.length, 'dp-doc wrappers')

  // Find VPContent (not VPDoc)
  const vpContent = document.querySelector('.VPContent')
  if (!vpContent) {
    console.log('Layout: VPContent not found, retrying...')
    return
  }

  // Find the content div within VPDoc
  const doc = vpContent.querySelector('.VPDoc')
  if (!doc) {
    console.log('Layout: VPDoc not found in VPContent, retrying...')
    return
  }

  const content = doc.querySelector('.content')
  if (!content) {
    console.log('Layout: .content not found in VPDoc, retrying...')
    return
  }

  const app = document.querySelector('#app')
  if (!app) {
    console.log('Layout: #app not found')
    return
  }

  // Create page-title
  const pageTitle = document.createElement('div')
  pageTitle.className = 'page-title'

  // Add metadata
  if (frontmatter.value.title) {
    const h1 = document.createElement('h1')
    h1.textContent = frontmatter.value.title
    pageTitle.appendChild(h1)
  }

  if (frontmatter.value.subtitle) {
    const subtitle = document.createElement('div')
    subtitle.className = 'subtitle'
    subtitle.textContent = frontmatter.value.subtitle
    pageTitle.appendChild(subtitle)
  }

  if (createdDate.value) {
    const meta = document.createElement('div')
    meta.className = 'meta-info'
    const time = document.createElement('time')
    time.textContent = createdDate.value
    meta.appendChild(time)
    pageTitle.appendChild(meta)
  }

  if (tags.value && tags.value.length) {
    const tagsContainer = document.createElement('div')
    tagsContainer.className = 'tags'
    tags.value.forEach(tag => {
      const tagEl = document.createElement('a')
      tagEl.className = 'tag'
      tagEl.textContent = tag
      tagEl.href = `/archives/?tag=${tag.toLowerCase()}`
      tagsContainer.appendChild(tagEl)
    })
    pageTitle.appendChild(tagsContainer)
  }

  // Create dp-doc wrapper
  const dpDocs = document.createElement('div')
  dpDocs.className = 'dp-doc'

  // Find .main element
  const mainElement = document.querySelector('.main')

  // Move main into dp-doc wrapper
  if (mainElement) {
    dpDocs.appendChild(mainElement)
  }

  // Get app, navbar, and footer elements
  const navbar = document.querySelector('.VPNav')
  const vpFooter = document.querySelector('.VPFooter')

  if (!app) {
    console.log('Layout: Could not find app')
    return
  }

  // Structure: VPNav, page-title, dp-doc, VPFooter are all siblings under #app
  // Insert page-title after navbar
  if (navbar) {
    app.insertBefore(pageTitle, navbar.nextElementSibling)
  } else {
    app.insertBefore(pageTitle, app.firstChild)
  }

  // Insert dp-doc after page-title
  app.insertBefore(dpDocs, pageTitle.nextElementSibling)

  // Move VPFooter after dp-doc
  if (vpFooter) {
    app.insertBefore(vpFooter, dpDocs.nextElementSibling)
  }

  // Hide VPContent since we've extracted its content
  vpContent.style.display = 'none'

  // Hide default h1 in content
  const defaultH1 = content.querySelector('h1')
  if (defaultH1) {
    defaultH1.style.display = 'none'
  }

  console.log('Layout: Created page-title, dp-doc, and VPFooter as siblings to Layout and header for', page.value.relativePath, 'with title:', frontmatter.value.title)
}

onMounted(() => {
  setTimeout(updateNavbarVisibility, 100)
  setTimeout(injectGutter, 200)
  setTimeout(addFooterSocialLinks, 300)
})

onUpdated(() => {
  setTimeout(updateNavbarVisibility, 100)
  setTimeout(injectGutter, 200)
  setTimeout(addFooterSocialLinks, 300)
})

// Watch for route changes
watch(() => page.value.relativePath, (newPath, oldPath) => {
  console.log('Layout: Route changed from', oldPath, 'to', newPath)

  // Update navbar visibility for all routes
  updateNavbarVisibility()

  // Only inject gutter on non-homepage pages
  if (newPath !== 'index.md') {
    setTimeout(injectGutter, 100)
  } else {
    console.log('Layout: On homepage, gutter handled by CSS')
  }
})

// Watch for frontmatter changes
watch(() => frontmatter.value, () => {
  console.log('Layout: Frontmatter changed')
  setTimeout(injectGutter, 100)
}, { deep: true })
</script>

<template>
  <!-- Layout component disabled - content moved outside to sibling structure -->
</template>

<style>
/* Hide skip to content link on landing page */
.VPSkipLink {
  display: none !important;
}
</style>
