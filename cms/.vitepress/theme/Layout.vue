<script setup lang="ts">
import { onMounted, onUpdated, computed, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, useRouter } from 'vitepress'
import { createApp } from 'vue'
import type { Frontmatter } from './types'
import { formatDate, parseTags } from './utils/format'
import ShareButtons from './components/ShareButtons.vue'
import FollowButtons from './components/FollowButtons.vue'
import SupportSection from './components/SupportSection.vue'
import SearchSection from './components/SearchSection.vue'

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

const showGutter = computed(() => page.value.relativePath !== 'index.md')

// Store observer reference to avoid multiple instances
let navbarObserver: MutationObserver | null = null

// Track current injection to prevent double-injection
let currentInjectedPath: string | null = null
let isInjecting = false

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

// Function to clean up existing gutter elements
const cleanupGutter = () => {
  const allWrappers = document.querySelectorAll('.page-wrapper')
  const allPageTitles = document.querySelectorAll('.page-title')
  const allDpDocs = document.querySelectorAll('.dp-doc')
  const allMyContents = document.querySelectorAll('.my-content')

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

  // Clean up my-content wrappers
  allMyContents.forEach(wrapper => {
    wrapper.remove()
  })

  // Show VPContent and Layout again after cleanup
  const vpContent = document.querySelector('.VPContent')
  const layout = document.querySelector('.Layout')

  if (vpContent) {
    vpContent.style.display = ''
  }

  if (layout) {
    layout.style.display = ''
  }

  console.log('Layout: Cleaned up', allWrappers.length, 'wrappers,', allPageTitles.length, 'page titles,', allDpDocs.length, 'dp-doc wrappers, and', allMyContents.length, 'my-content wrappers')
}

// Function to inject/re-inject gutter
const injectGutter = async () => {
  console.log('Layout: [INJECTGUTTER] Function called')
  console.log('Layout: [INJECTGUTTER] Current page:', page.value.relativePath)
  console.log('Layout: [INJECTGUTTER] isInjecting:', isInjecting)
  console.log('Layout: [INJECTGUTTER] currentInjectedPath:', currentInjectedPath)

  // Prevent duplicate injections
  if (isInjecting) {
    console.log('Layout: [INJECTGUTTER] Already injecting, skipping duplicate call')
    return
  }

  // Skip on homepage - no gutter needed, no cleanup, no DOM manipulation at all
  if (page.value.relativePath === 'index.md') {
    console.log('Layout: [INJECTGUTTER] Skipping gutter for homepage - no DOM manipulation')
    return
  }

  // Check if we're already on the correct page
  if (currentInjectedPath === page.value.relativePath) {
    console.log('Layout: [INJECTGUTTER] Already injected for', page.value.relativePath, '- skipping')
    return
  }

  isInjecting = true
  console.log('Layout: [INJECTGUTTER] Starting gutter injection for', page.value.relativePath)

  try {
    // Wait for Vue to finish rendering
    await nextTick()

    // Clean up existing gutters first
    cleanupGutter()

    // Wait for cleanup to complete
    await nextTick()

    // Wait for VPDoc to actually exist in the DOM
    let attempts = 0
    let doc = document.querySelector('.VPDoc')
    while (!doc && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 50))
      doc = document.querySelector('.VPDoc')
      attempts++
      console.log('Layout: Waiting for VPDoc... attempt', attempts)
    }

    if (!doc) {
      console.log('Layout: VPDoc not found after 20 attempts')
      isInjecting = false
      return
    }

    const content = doc.querySelector('.content')
    if (!content) {
      console.log('Layout: .content not found in VPDoc')
      isInjecting = false
      return
    }

    const app = document.querySelector('#app')
    if (!app) {
      console.log('Layout: #app not found')
      isInjecting = false
      return
    }

    // Get navbar and vpFooter for later use
    const navbar = document.querySelector('.VPNav')
    const vpFooter = document.querySelector('.VPFooter')
    const vpContent = document.querySelector('.VPContent')
    const layout = document.querySelector('.Layout')

    // Create page-title
    const pageTitle = document.createElement('div')
    pageTitle.className = 'page-title'

    // Add metadata
    if (frontmatter.value.title) {
      const h1 = document.createElement('h1')
      h1.className = 'frontmatter-title text-pretcty'
      h1.textContent = frontmatter.value.title
      pageTitle.appendChild(h1)
    }

    if (frontmatter.value.subtitle) {
      const subtitle = document.createElement('div')
      subtitle.className = 'frontmatter-subtitle'
      subtitle.textContent = frontmatter.value.subtitle
      pageTitle.appendChild(subtitle)
    }

    if (createdDate.value) {
      const dateDiv = document.createElement('div')
      dateDiv.className = 'frontmatter-created-at'
      dateDiv.textContent = createdDate.value
      pageTitle.appendChild(dateDiv)
    }

    if (tags.value && tags.value.length) {
      const tagsContainer = document.createElement('div')
      tagsContainer.className = 'frontmatter-tags'
      tags.value.forEach(tag => {
        const tagEl = document.createElement('a')
        tagEl.className = 'tag-link'
        tagEl.href = `/archives/?tag=${tag.toLowerCase()}`
        tagEl.textContent = `#${tag}`
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

    // Get app, navbar, and layout elements (already declared above)
    if (!app || !layout) {
      console.log('Layout: Could not find app or layout')
      isInjecting = false
      return
    }

    // Create my-content wrapper to contain page-title and dp-doc
    const myContent = document.createElement('div')
    myContent.className = 'my-content'

    // Append page-title and dp-doc to my-content
    myContent.appendChild(pageTitle)
    myContent.appendChild(dpDocs)

    // Structure: VPNav, my-content (containing page-title and dp-doc), Layout, VPFooter are all siblings
    // Insert my-content after navbar
    if (navbar) {
      app.insertBefore(myContent, navbar.nextElementSibling)
    } else {
      app.insertBefore(myContent, app.firstChild)
    }

    // Move VPFooter after Layout
    if (vpFooter && layout) {
      app.insertBefore(vpFooter, layout.nextElementSibling)
    }

    // Hide the original Layout element since we're using my-content wrapper
    layout.style.display = 'none'

    // Hide VPContent since we've extracted its content
    if (vpContent) {
      vpContent.style.display = 'none'
    }

    // Hide default h1 in content
    const defaultH1 = content.querySelector('h1')
    if (defaultH1) {
      defaultH1.style.display = 'none'
    }

    // Create and mount components for blog posts AFTER DOM is updated
    // Only inject for individual blog posts, not the blog index page
    if (page.value.relativePath.startsWith('blog/') && page.value.relativePath !== 'blog/index.md') {
      await nextTick()

      const postFooter = document.createElement('div')
      postFooter.className = 'post-footer-components'

      const postUrl = `https://kingsleyobi.com/${page.value.relativePath.replace('.md', '')}`
      const postTitle = frontmatter.value.title || page.value.title

      // Create SearchSection
      const searchContainer = document.createElement('div')
      searchContainer.className = 'search-section-container'
      const searchApp = createApp(SearchSection, {
        postCount: 10,
        yearsActive: '2.25',
        tagCount: 20
      })
      searchApp.mount(searchContainer)
      postFooter.appendChild(searchContainer)

      // Create SupportSection
      const supportContainer = document.createElement('div')
      supportContainer.className = 'support-section-container'
      const supportApp = createApp(SupportSection)
      supportApp.mount(supportContainer)
      postFooter.appendChild(supportContainer)

      // Create ShareButtons
      const shareContainer = document.createElement('div')
      shareContainer.className = 'share-buttons-container'
      const shareApp = createApp(ShareButtons, {
        url: postUrl,
        title: postTitle
      })
      shareApp.mount(shareContainer)
      postFooter.appendChild(shareContainer)

      // Create FollowButtons
      const followContainer = document.createElement('div')
      followContainer.className = 'follow-buttons-container'
      const followApp = createApp(FollowButtons, {
        url: postUrl,
        title: postTitle
      })
      followApp.mount(followContainer)
      postFooter.appendChild(followContainer)

      // Add to dp-doc after main content
      dpDocs.appendChild(postFooter)
    }

    // Update state to track successful injection
    currentInjectedPath = page.value.relativePath
    console.log('Layout: Successfully created my-content wrapper for', page.value.relativePath, 'with title:', frontmatter.value.title)

  } catch (error) {
    console.error('Layout: Error during gutter injection:', error)
  } finally {
    isInjecting = false
  }
}

onMounted(() => {
  setTimeout(moveNavbarOutsideLayout, 50)
  setTimeout(addThemeTitleClass, 75)
  setTimeout(updateNavbarVisibility, 100)
  setTimeout(() => {
    injectGutter()
  }, 300)
  setTimeout(addFooterSocialLinks, 400)
})

onUpdated(() => {
  setTimeout(moveNavbarOutsideLayout, 50)
  setTimeout(addThemeTitleClass, 75)
  setTimeout(updateNavbarVisibility, 100)
  // Note: injectGutter is now handled by the route watcher, not onUpdated
  setTimeout(addFooterSocialLinks, 300)
})

// Watch for route changes
watch(() => page.value.relativePath, async (newPath, oldPath) => {
  console.log('Layout: [WATCH] Route changed from', oldPath, 'to', newPath)
  console.log('Layout: [WATCH] Current injected path:', currentInjectedPath)
  console.log('Layout: [WATCH] isInjecting:', isInjecting)

  // Update navbar visibility for all routes
  updateNavbarVisibility()

  // Apply theme title class to navbar
  addThemeTitleClass()

  // Only inject gutter on non-homepage pages
  if (newPath !== 'index.md') {
    console.log('Layout: [WATCH] Scheduling gutter injection in 300ms...')
    // Longer delay to ensure Vue has finished rendering the new page
    setTimeout(() => {
      console.log('Layout: [WATCH] executing scheduled gutter injection')
      injectGutter()
    }, 300)
  } else {
    console.log('Layout: [WATCH] On homepage, gutter handled by CSS')
    // Clean up any existing gutter when navigating to homepage
    cleanupGutter()
    // Reset injection state
    currentInjectedPath = null
  }
})

// Also use VitePress router hooks for more reliable navigation detection
router.onAfterRouteChanged = () => {
  console.log('Layout: [ROUTER HOOK] onAfterRouteChanged fired')
  console.log('Layout: [ROUTER HOOK] Current path:', page.value.relativePath)

  if (page.value.relativePath !== 'index.md') {
    console.log('Layout: [ROUTER HOOK] Scheduling gutter injection in 400ms...')
    setTimeout(() => {
      console.log('Layout: [ROUTER HOOK] Executing gutter injection from router hook')
      injectGutter()
    }, 400)
  } else {
    console.log('Layout: [ROUTER HOOK] Homepage detected, cleaning up')
    cleanupGutter()
    currentInjectedPath = null
  }
}

// Watch for frontmatter changes
watch(() => frontmatter.value, () => {
  console.log('Layout: Frontmatter changed')
  setTimeout(injectGutter, 100)
}, { deep: true })
</script>

<template>
  <Layout />
</template>

<style>
/* Hide skip to content link on landing page */
.VPSkipLink {
  display: none !important;
}

/* Post Footer Components - injected within blog post content */
.post-footer-components {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-footer-components > div {
  margin-bottom: 0;
}

.post-footer-components > div:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .post-footer-components {
    gap: 20px;
    padding-top: 24px;
  }
}
</style>
