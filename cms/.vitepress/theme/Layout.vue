<script setup lang="ts">
import { onMounted, onUpdated, computed, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, useRouter } from 'vitepress'
import type { Frontmatter } from './types'
import { formatDate, parseTags } from './utils/format'
import ShareButtons from './components/ShareButtons.vue'
import FollowButtons from './components/FollowButtons.vue'

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

    // Create and mount share/follow buttons for blog posts AFTER DOM is updated
    // Only inject for individual blog posts, not the blog index page
    if (page.value.relativePath.startsWith('blog/') && page.value.relativePath !== 'blog/index.md') {
      await nextTick()

      const postFooter = document.createElement('div')
      postFooter.className = 'post-footer-buttons'

      const postUrl = `https://kingsleyobi.com/${page.value.relativePath.replace('.md', '')}`
      const postTitle = frontmatter.value.title || page.value.title

      // Create share section
      const shareSection = document.createElement('div')
      shareSection.className = 'share-section'
      shareSection.innerHTML = `
        <div class="button-group">
          <span class="section-label">Share</span>
          <div class="share-row">
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}" target="_blank" rel="noopener noreferrer" class="share-button x-share" title="Share on X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              <span>Post</span>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}" target="_blank" rel="noopener noreferrer" class="share-button linkedin-share" title="Share on LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
              <span>LinkedIn</span>
            </a>
            <a href="https://news.ycombinator.com/submitlink?u=${encodeURIComponent(postUrl)}&t=${encodeURIComponent(postTitle)}" target="_blank" rel="noopener noreferrer" class="share-button hn-share" title="Share on Hacker News">
              <span class="hn-icon">HN</span><span> Hacker News</span>
            </a>
            <a href="https://www.reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postTitle)}" target="_blank" rel="noopener noreferrer" class="share-button reddit-share" title="Share on Reddit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12A12 12 0 0 0 24 12a12 12 0 0 0-12-12zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"></path></svg>
              <span>Reddit</span>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}" target="_blank" rel="noopener noreferrer" class="share-button facebook-share" title="Share on Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
              <span>Facebook</span>
            </a>
            <a href="mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(postUrl)}" target="_blank" rel="noopener noreferrer" class="share-button email-share" title="Share via Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17.238 3.28l-7.928 7.1L4.216 6.28a.5.5 0 1 0-.672.744l8.5 7.75a.5.5 0 0 0 .672 0l8.5-7.75a.5.5 0 0 0-.672-.744z"></path></svg>
              <span>Forward</span>
            </a>
          </div>
        </div>
      `

      // Create follow section
      const followSection = document.createElement('div')
      followSection.className = 'cta-section'
      followSection.innerHTML = `
        <div class="button-group">
          <span class="section-label">Follow</span>
          <div class="cta-row">
            <a href="/feed.rss" target="_blank" rel="noopener noreferrer" class="cta-button newsletter" title="Newsletter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17.238 3.28l-7.928 7.1L4.216 6.28a.5.5 0 1 0-.672.744l8.5 7.75a.5.5 0 0 0 .672 0l8.5-7.75a.5.5 0 0 0-.672-.744z"></path></svg>
              <span>Get The Newsletter</span>
            </a>
            <a href="https://x.com/mrkingsleyobi" target="_blank" rel="noopener noreferrer" class="cta-button x-follow" title="X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              <span>Follow On X</span>
            </a>
            <a href="https://youtube.com/@mrkingsleyobi" target="_blank" rel="noopener noreferrer" class="cta-button youtube" title="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
              <span>Subscribe On YouTube</span>
            </a>
            <a href="https://linkedin.com/in/mrkingsleyobi" target="_blank" rel="noopener noreferrer" class="cta-button linkedin" title="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
              <span>Follow On LinkedIn</span>
            </a>
          </div>
        </div>
      `

      postFooter.appendChild(shareSection)
      postFooter.appendChild(followSection)

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

/* Post Footer Buttons - injected within blog post content */
.post-footer-buttons {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-divider);
}

.post-footer-buttons .share-section,
.post-footer-buttons .cta-section {
  margin-bottom: 24px;
}

.post-footer-buttons .share-section:last-child,
.post-footer-buttons .cta-section:last-child {
  margin-bottom: 0;
}

.post-footer-buttons .button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-footer-buttons .section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.post-footer-buttons .share-row,
.post-footer-buttons .cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.post-footer-buttons .share-button,
.post-footer-buttons .cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.post-footer-buttons .share-button::before,
.post-footer-buttons .cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vp-c-brand-1);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  z-index: 0;
}

.post-footer-buttons .share-button:hover,
.post-footer-buttons .cta-button:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-footer-buttons .share-button:hover::before,
.post-footer-buttons .cta-button:hover::before {
  opacity: 1;
}

.post-footer-buttons .share-button:hover svg,
.post-footer-buttons .share-button:hover span,
.post-footer-buttons .cta-button:hover svg,
.post-footer-buttons .cta-button:hover span {
  color: white;
  position: relative;
  z-index: 1;
}

.post-footer-buttons .share-button svg,
.post-footer-buttons .cta-button svg {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.post-footer-buttons .share-button span,
.post-footer-buttons .cta-button span {
  position: relative;
  z-index: 1;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.post-footer-buttons .hn-icon {
  font-weight: 700;
  font-size: 0.8125rem;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.post-footer-buttons .share-button:active,
.post-footer-buttons .cta-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .post-footer-buttons .share-row,
  .post-footer-buttons .cta-row {
    gap: 8px;
  }

  .post-footer-buttons .share-button,
  .post-footer-buttons .cta-button {
    padding: 9px 14px;
    font-size: 0.8125rem;
    flex: 1 1 calc(50% - 4px);
    justify-content: center;
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  .post-footer-buttons .share-button,
  .post-footer-buttons .cta-button {
    flex: 1 1 100%;
    min-width: 100%;
  }
}
</style>
