<script setup lang="ts">
import { onMounted, watch, nextTick, computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import type { Frontmatter } from './types'
import { formatDate, parseTags } from './utils/format'
import ShareButtons from './components/ShareButtons.vue'
import FollowButtons from './components/FollowButtons.vue'
import SupportSection from './components/SupportSection.vue'
import SearchSection from './components/SearchSection.vue'

const { Layout } = DefaultTheme
const { frontmatter, page } = useData<Frontmatter>()

const tags = computed(() => parseTags(frontmatter.value.tags))
const createdDate = computed(() =>
  frontmatter.value.created_at ? formatDate(frontmatter.value.created_at) : null
)

// Computed to detect if this is a blog post
const isBlogPost = computed(() => {
  return !!frontmatter.value.created_at
})

// Computed to detect if footer components should be shown
// Only show on: blog index, blog posts, and archive page
const shouldShowFooterComponents = computed(() => {
  const currentPath = page.value.relativePath

  // Blog index page
  if (currentPath === 'blog/index.md') {
    return true
  }

  // Archive page
  if (currentPath === 'archives/index.md') {
    return true
  }

  // Blog posts (have created_at)
  if (frontmatter.value.created_at) {
    return true
  }

  return false
})

// Computed for current page URL
const currentUrl = computed(() => {
  return typeof window !== 'undefined' ? window.location.href : ''
})

// Computed for current page title
const currentTitle = computed(() => {
  return frontmatter.value.title || 'Kingsley Obi'
})

// Function to inject page gutter
const injectPageGutter = () => {
  console.log('injectPageGutter called for', page.value.relativePath)

  // Skip on homepage
  if (page.value.relativePath === 'index.md') {
    console.log('Skipping gutter for homepage')
    return
  }

  // Find the VPDoc container
  const vpDoc = document.querySelector('.VPDoc')
  if (!vpDoc) {
    console.log('VPDoc not found')
    return
  }

  // Get the container within VPDoc (this is where we'll inject the gutter)
  const container = vpDoc.querySelector('.container')
  if (!container) {
    console.log('VPDoc .container not found')
    return
  }

  // Get the content area within VPDoc
  const content = vpDoc.querySelector('.content')
  if (!content) {
    console.log('VPDoc .content not found')
    return
  }

  // Set container as positioning context for absolute gutter
  container.style.position = 'relative'
  console.log('Set container position to relative for gutter positioning')

  // Check if gutter already exists
  const existingGutter = document.querySelector('.page-title')
  if (existingGutter) {
    console.log('Gutter already exists, removing and recreating')
    existingGutter.remove()
  }

  console.log('Creating gutter for', frontmatter.value.title)

  // Create page-title div (contains all metadata)
  const pageTitle = document.createElement('div')
  pageTitle.className = 'page-title'

  // Title
  if (frontmatter.value.title) {
    const h1 = document.createElement('h1')
    h1.className = 'frontmatter-title text-pretcty'
    h1.textContent = frontmatter.value.title
    pageTitle.appendChild(h1)
    console.log('Added title:', frontmatter.value.title)
  }

  // Subtitle
  if (frontmatter.value.subtitle) {
    const subtitle = document.createElement('div')
    subtitle.className = 'frontmatter-subtitle'
    subtitle.textContent = frontmatter.value.subtitle
    pageTitle.appendChild(subtitle)
  }

  // Description (for non-blog pages)
  if (frontmatter.value.description && !frontmatter.value.created_at) {
    const description = document.createElement('div')
    description.className = 'description'
    description.textContent = frontmatter.value.description
    pageTitle.appendChild(description)
  }

  // Created Date and Tags (for blog posts)
  if (createdDate.value || tags.value.length) {
    // Date metadata
    if (createdDate.value) {
      const dateDiv = document.createElement('div')
      dateDiv.className = 'frontmatter-created-at'
      dateDiv.textContent = createdDate.value
      pageTitle.appendChild(dateDiv)
    }

    // Tags
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

    // Add viewer-count component for blog posts
    const viewerCountDiv = document.createElement('div')
    viewerCountDiv.className = 'viewer-count'

    // Simulate view count (consistent pseudo-random based on URL)
    const url = window.location.pathname
    let hash = 0
    for (let i = 0; i < url.length; i++) {
      hash = ((hash << 5) - hash) + url.charCodeAt(i)
      hash |= 0
    }
    const viewCount = Math.abs(hash % 50) + 5 // Between 5 and 55

    viewerCountDiv.innerHTML = `<span class="viewer-count-number">${viewCount}</span> reading now`
    pageTitle.appendChild(viewerCountDiv)

    // Add footer components for blog index, blog posts, and archive page
    if (shouldShowFooterComponents.value) {
      const encodedUrl = encodeURIComponent(currentUrl.value)
      const encodedTitle = encodeURIComponent(currentTitle.value)

      // Create footer container that goes in the main content area (right column)
      const blogPostFooter = document.createElement('div')
      blogPostFooter.className = 'blog-post-footer'

      // Share Buttons
      const shareSection = document.createElement('div')
      shareSection.className = 'share-section'
      shareSection.innerHTML = `
        <div class="button-group">
          <span class="section-label">Share</span>
          <div class="share-row">
            <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener noreferrer" class="share-button x-share" title="Share on X">
              <span>Post</span>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-button linkedin-share" title="LinkedIn">
              <span>LinkedIn</span>
            </a>
            <a href="https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}" target="_blank" rel="noopener noreferrer" class="share-button hn-share" title="Hacker News">
              <span>Hacker News</span>
            </a>
            <a href="https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}" target="_blank" rel="noopener noreferrer" class="share-button reddit-share" title="Reddit">
              <span>Reddit</span>
            </a>
            <a href="mailto:?subject=${encodedTitle}&body=${encodedUrl}" class="share-button email-share" title="Forward">
              <span>Forward</span>
            </a>
          </div>
        </div>
      `
      blogPostFooter.appendChild(shareSection)

      // Follow Buttons
      const followSection = document.createElement('div')
      followSection.className = 'cta-section'
      followSection.innerHTML = `
        <div class="button-group">
          <span class="section-label">Follow</span>
          <div class="cta-row">
            <a href="/feed.rss" target="_blank" rel="noopener noreferrer" class="cta-button newsletter" title="Newsletter">
              <span>Get The Newsletter</span>
            </a>
            <a href="https://x.com/mrkingsleyobi" target="_blank" rel="noopener noreferrer" class="cta-button x-follow" title="X">
              <span>Follow On X</span>
            </a>
            <a href="https://youtube.com/@mrkingsleyobi" target="_blank" rel="noopener noreferrer" class="cta-button youtube" title="YouTube">
              <span>Subscribe On YouTube</span>
            </a>
            <a href="https://linkedin.com/in/mrkingsleyobi" target="_blank" rel="noopener noreferrer" class="cta-button linkedin" title="LinkedIn">
              <span>Follow On LinkedIn</span>
            </a>
          </div>
        </div>
      `
      blogPostFooter.appendChild(followSection)

      // Donation Box (SupportSection)
      const donationBox = document.createElement('div')
      donationBox.className = 'donation-box'
      donationBox.innerHTML = `
        <h2 class="donation-heading">supporting = loving</h2>
        <div class="donation-divider"></div>
        <p class="donation-intro">
          For <strong>2 years</strong> I've been creating ad-free technical tutorials and essays here.
          This is a one-person effort that's also my livelihood. If it makes your day easier or more pleasant in any way,
          please consider supporting the work with a monthly or one-time donation.
        </p>
        <p class="donation-intro">
          It helps me make more content, and is deeply appreciated as well. 🫶🏼
        </p>
        <div class="donation-columns">
          <div class="donation-column donation-column--monthly">
            <h4 class="column-heading">Monthly Support</h4>
            <div class="column-divider"></div>
            <div class="tier-list">
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $5</a>
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $10</a>
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $25</a>
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $50</a>
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $100</a>
            </div>
          </div>
          <div class="donation-column">
            <h4 class="column-heading">One-Time Support</h4>
            <div class="column-divider"></div>
            <div class="tier-list">
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $5</a>
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $10</a>
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $25</a>
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $50</a>
              <a href="#" target="_blank" rel="noopener" class="tier-link"><span class="tier-heart">♥</span> $100</a>
            </div>
          </div>
        </div>
      `
      blogPostFooter.appendChild(donationBox)

      // Search Section
      const searchSection = document.createElement('section')
      searchSection.className = 'search-section'
      searchSection.innerHTML = `
        <div class="search-wrapper">
          <span class="section-label">Search</span>
          <div class="search-container">
            <span class="search-icon vp-icon"></span>
            <input
              type="text"
              class="search-input"
              placeholder="Search all 10 posts across 2.25 years and 20 tags..."
              onkeypress="if(event.key === 'Enter') { window.location.href = '/archives/?search=' + encodeURIComponent(this.value); }"
            />
          </div>
        </div>
      `
      blogPostFooter.appendChild(searchSection)

      // Insert at the end of the vp-doc content (right column)
      const vpDoc = document.querySelector('.VPDoc .content .vp-doc')
      if (vpDoc) {
        vpDoc.appendChild(blogPostFooter)
      }
    }
  }

  // Insert page-title as first child of container (for proper absolute positioning)
  container.insertBefore(pageTitle, container.firstChild)
  console.log('Gutter inserted into container for two-column layout')

  // Hide ALL h1 elements in VPDoc content EXCEPT those in .page-title
  const allH1s = vpDoc.querySelectorAll('h1')
  let hiddenCount = 0
  allH1s.forEach((h1) => {
    // Don't hide H1s that are inside .page-title (that's our title!)
    if (!h1.closest('.page-title')) {
      (h1 as HTMLElement).style.display = 'none'
      hiddenCount++
    }
  })
  console.log('Hidden', hiddenCount, 'h1 elements (excluded .page-title H1s)')
}

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
  console.log('Layout onMounted fired')
  setTimeout(addThemeTitleClass, 100)
  setTimeout(addFooterSocialLinks, 200)

  // Try multiple approaches to inject gutter
  setTimeout(() => {
    console.log('Attempting to inject gutter...')
    injectPageGutter()

    // If it didn't work, try again with a longer delay
    setTimeout(() => {
      if (!document.querySelector('.page-title')) {
        console.log('First attempt failed, trying again...')
        injectPageGutter()
      }
    }, 500)
  }, 100)
})

// Watch for route changes to re-inject gutter
watch(() => page.value.relativePath, async (newPath, oldPath) => {
  console.log('Route changed from', oldPath, 'to', newPath)
  await nextTick()

  // Remove existing gutter if present
  const existingGutter = document.querySelector('.page-title')
  if (existingGutter) {
    console.log('Removing existing gutter')
    existingGutter.remove()
  }

  // Inject new gutter
  setTimeout(() => {
    console.log('Injecting gutter for new route...')
    injectPageGutter()

    // Retry if needed
    setTimeout(() => {
      if (!document.querySelector('.page-title')) {
        console.log('Retry injecting gutter...')
        injectPageGutter()
      }
    }, 300)
  }, 100)
})
</script>

<template>
  <Layout />
</template>

<style>
/* Hide skip to content link on landing page */
.VPSkipLink {
  display: none !important;
}

/* Daniel Miessler Body Typography - Foundation */
body {
  font-family: valkyrie-text, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica Neue, Arial, sans-serif !important;
  margin-left: auto !important;
  margin-right: auto !important;
  width: 100% !important;
  max-width: 1000px !important;
  min-height: 100% !important;
  position: relative !important;
  z-index: 1 !important;
  -webkit-font-smoothing: subpixel-antialiased !important;
  font-weight: 500 !important;
  line-height: 1.45 !important;
  font-size: .91rem !important;
  font-variant-numeric: oldstyle-nums !important;
  background-color: var(--vp-c-bg, #EAE9DF) !important;
  color: var(--vp-c-text-1, #2c1810) !important;
}

/* Two-Column Layout for Content Area - Daniel Miessler Style */
.VPDoc .content {
  position: relative !important;
  max-width: 1000px !important;
  margin: 0 auto !important;
  margin-left: 356px !important;
  margin-right: 60px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Page Title Gutter - Daniel Miessler Absolute Positioning */
.page-title {
  position: absolute !important;
  left: 1.5rem !important;
  top: 60px !important;
  width: 10rem !important;
  text-align: right !important;
  font-weight: 400;
  border-top: solid 3px var(--vp-c-brand-1) !important;
  padding-top: 5px !important;
  z-index: 1;
  background: transparent !important;
  box-sizing: border-box !important;
  margin: 0 !important;
}

/* Main Content Area */
.VPDoc .content .vp-doc {
  width: 100%;
}

/* Daniel Miessler Content Typography */
.VPDoc .content,
.VPDoc .vp-doc,
.vp-doc {
  font-family: valkyrie-text, Georgia, serif !important;
  font-size: .91rem !important;
  line-height: 1.45 !important;
  font-weight: 500 !important;
  color: var(--vp-c-text-1) !important;
}

/* Paragraph Styling - Daniel Miessler Style */
.VPDoc .vp-doc p,
.vp-doc p {
  margin-bottom: 1.25rem !important;
  line-height: 1.45 !important;
  font-weight: 500 !important;
}

/* First paragraph styling - remove the larger first paragraph */
.VPDoc .content p:first-of-type {
  font-size: .91rem !important;
  line-height: 1.45 !important;
  font-weight: 400 !important;
  color: var(--vp-c-text-1) !important;
}

/* Heading Styling - Daniel Miessler Style */
.VPDoc .vp-doc h2,
.vp-doc h2 {
  font-family: advocate-n34, valkyrie-text, Georgia, serif !important;
  margin-top: 1.25rem !important;
  margin-bottom: 1.25rem !important;
  padding-top: .4rem !important;
  padding-bottom: .4rem !important;
  text-transform: lowercase !important;
  font-weight: 200 !important;
  font-size: 128% !important;
  line-height: 1.3 !important;
  color: var(--vp-c-text-1) !important;
}

.VPDoc .vp-doc h3,
.vp-doc h3 {
  font-family: heliotrope-caps, valkyrie-text, Georgia, serif !important;
  margin-top: 1.25rem !important;
  margin-bottom: 1.25rem !important;
  padding-top: .4rem !important;
  padding-bottom: .4rem !important;
  text-transform: lowercase !important;
  font-size: 108% !important;
  font-weight: 400 !important;
  line-height: 1.3 !important;
  color: var(--vp-c-text-1) !important;
}

/* Remove top margin from first elements */
.VPDoc .vp-doc > div > p:first-child,
.VPDoc .vp-doc > div > h1:first-child,
.VPDoc .vp-doc > div > *:first-child:not(.custom-block),
.VPDoc .vp-doc p:first-of-type,
.VPDoc .vp-doc > p:first-child,
.VPDoc .vp-doc > p:first-of-type {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* Remove default padding from VPDoc container */
.VPDoc .container {
  max-width: 1000px !important;
  margin: 0 auto !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* VPDoc itself should be full width */
.VPDoc {
  max-width: 100% !important;
}

/* VPContent should allow full width */
.VPContent {
  max-width: 100% !important;
}

/* Daniel Miessler Typography Styles for Frontmatter */
.page-title .frontmatter-title {
  font-family: inherit !important;
  text-transform: inherit !important;
  letter-spacing: inherit !important;
  font-size: 125% !important;
  line-height: 1.1 !important;
  border-bottom: inherit !important;
  margin-top: 0rem !important;
  margin-bottom: .8rem !important;
  font-weight: bolder !important;
  border-top: 0 !important;
  padding-top: 0 !important;
  color: var(--vp-c-text-1) !important;
}

.page-title .frontmatter-subtitle {
  font-family: valkyrie-text, Georgia, serif !important;
  display: block !important;
  font-size: 95% !important;
  font-weight: 300 !important;
  color: var(--vp-c-text-2) !important;
  line-height: 1.25 !important;
  font-style: italic !important;
  margin-bottom: .8rem !important;
  -webkit-hyphens: none !important;
  hyphens: none !important;
}

.page-title .frontmatter-created-at {
  font-family: equity-text, Georgia, serif !important;
  display: block !important;
  font-size: .8rem !important;
  font-weight: 400 !important;
  line-height: 1.3 !important;
  margin-bottom: .6rem !important;
  color: var(--vp-c-text-2) !important;
}

.page-title .frontmatter-tags {
  display: block !important;
  margin-top: .5rem !important;
  line-height: 1.4 !important;
}

.page-title .tag-link {
  display: block !important;
  font-size: .75rem !important;
  color: var(--vp-c-brand-1) !important;
  text-decoration: none !important;
  margin-bottom: .2rem !important;
  transition: color 0.2s ease !important;
}

.page-title .tag-link:hover {
  color: var(--vp-c-brand-2) !important;
  text-decoration: underline !important;
}

.page-title .description {
  font-size: .6875rem !important;
  color: var(--vp-c-text-3) !important;
  line-height: 1.4 !important;
  margin: 0 !important;
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

/* Blog Post Footer - at bottom of content */
.blog-post-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* Share Section Styles */
.blog-post-footer .share-section {
  margin-bottom: 1.5rem;
}

.blog-post-footer .button-group {
  display: flex;
  align-items: center;
  gap: .5rem;
  justify-content: flex-start;
}

.blog-post-footer .section-label {
  font-family: concourse-t3, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: .5rem;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--vp-c-text-3);
  font-weight: 400;
  opacity: .8;
}

.blog-post-footer .share-row,
.blog-post-footer .cta-row {
  display: flex;
  gap: .25rem;
  flex-wrap: wrap;
}

.blog-post-footer .share-button,
.blog-post-footer .cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .2rem;
  padding: .15rem .35rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  transition: all .15s ease;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  opacity: .9;
  text-decoration: none;
  font-family: concourse-t2, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: .575rem;
  font-weight: 400;
  letter-spacing: .01em;
  text-transform: capitalize;
}

.blog-post-footer .share-button:hover,
.blog-post-footer .cta-button:hover {
  opacity: 1;
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-divider);
  transform: translateY(-1px);
}

.blog-post-footer .cta-button {
  padding: .125rem .3rem;
  font-size: .5rem;
  background: var(--vp-c-bg-soft);
}

.blog-post-footer .cta-button:hover {
  opacity: 1;
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

/* Donation Box Styles */
.blog-post-footer .donation-box {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  margin: 2rem 0;
}

.blog-post-footer .donation-heading {
  font-family: equity-text-a, Georgia, serif;
  font-size: .9375rem;
  font-weight: 300;
  color: var(--vp-c-text-2);
  margin: 0 0 .2rem;
  letter-spacing: -.01em;
}

.blog-post-footer .donation-divider {
  width: 100%;
  height: 1px;
  background: var(--vp-c-divider);
  margin-bottom: .625rem;
}

.blog-post-footer .donation-intro {
  font-family: equity-text-a, Georgia, serif;
  font-size: .6875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem;
}

.blog-post-footer .donation-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 0;
}

.blog-post-footer .donation-column {
  min-width: 0;
}

.blog-post-footer .donation-column--monthly {
  text-align: right;
}

.blog-post-footer .donation-column--monthly .tier-link {
  justify-content: flex-end;
}

.blog-post-footer .column-heading {
  font-family: concourse-t3, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: .5625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--vp-c-text-2);
  margin: 0 0 .2rem;
}

.blog-post-footer .column-divider {
  width: 100%;
  height: 1px;
  background: var(--vp-c-divider);
  margin-bottom: .75rem;
}

.blog-post-footer .tier-list {
  display: flex;
  flex-direction: column;
  gap: .125rem;
}

.blog-post-footer .tier-link {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  font-family: equity-text-a, Georgia, serif;
  font-size: .6875rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color .15s ease;
  padding: 0;
}

.blog-post-footer .tier-link:hover {
  color: var(--vp-c-text-1);
}

.blog-post-footer .tier-heart {
  color: var(--vp-c-text-3);
  font-size: .625rem;
  transition: color .15s ease;
}

.blog-post-footer .tier-link:hover .tier-heart {
  color: var(--vp-c-red-1);
}

/* Search Section Styles */
.blog-post-footer .search-section {
  margin-bottom: 1rem;
}

.blog-post-footer .search-wrapper {
  display: flex;
  align-items: center;
  gap: .5rem;
  justify-content: flex-start;
}

.blog-post-footer .search-container {
  position: relative;
  width: 100%;
}

.blog-post-footer .search-icon.vp-icon {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' stroke-width='1.6' viewBox='0 0 20 20'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' d='m14.386 14.386 4.088 4.088-4.088-4.088A7.533 7.533 0 1 1 3.733 3.733a7.533 7.533 0 0 1 10.653 10.653z'/%3E%3C/svg%3E");
  mask: var(--icon) no-repeat;
  mask-size: 100% 100%;
  -webkit-mask: var(--icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  background-color: currentColor;
  display: inline-block;
}

.blog-post-footer .search-icon {
  position: absolute;
  left: .75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
  pointer-events: none;
  width: 14px;
  height: 14px;
}

.blog-post-footer .search-input {
  width: 100%;
  padding: .5rem .75rem .5rem 2.5rem;
  font-family: concourse-t3, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: .75rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  transition: all .2s ease;
  border-radius: 3px;
  color: var(--vp-c-text-1);
  height: 36px;
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

/* Daniel Miessler List Styling */
.VPDoc .vp-doc ul,
.VPDoc .vp-doc ol,
.vp-doc ul,
.vp-doc ol {
  margin-bottom: 1.25rem !important;
  padding-left: 1.5rem !important;
  line-height: 1.45 !important;
}

.VPDoc .vp-doc li,
.vp-doc li {
  margin-bottom: 0.5rem !important;
  line-height: 1.45 !important;
  column-break-inside: avoid !important;
  -moz-column-break-inside: avoid !important;
  break-inside: avoid-column !important;
}

/* Daniel Miessler Link Styling */
.VPDoc .vp-doc a,
.vp-doc a {
  color: var(--vp-c-brand-1) !important;
  text-decoration: none !important;
  transition: color 0.2s ease !important;
}

.VPDoc .vp-doc a:hover,
.vp-doc a:hover {
  color: var(--vp-c-brand-2) !important;
  text-decoration: underline !important;
}

/* Daniel Miessler Blockquote Styling */
.VPDoc .vp-doc blockquote,
.vp-doc blockquote {
  margin: 1.25rem 0 !important;
  padding: 0.5rem 1rem !important;
  border-left: 3px solid var(--vp-c-brand-1) !important;
  background: var(--vp-c-bg-soft) !important;
  color: var(--vp-c-text-2) !important;
  font-style: italic !important;
  line-height: 1.45 !important;
}

/* Daniel Miessler Code Styling */
.VPDoc .vp-doc code,
.vp-doc code {
  font-family: triplicate-text, 'SF Mono', Monaco, monospace !important;
  font-size: 0.9em !important;
  background: var(--vp-c-bg-soft) !important;
  padding: 0.2em 0.4em !important;
  border-radius: 3px !important;
}

.VPDoc .vp-doc pre,
.vp-doc pre {
  margin: 1.25rem 0 !important;
  padding: 1rem !important;
  background: var(--vp-c-bg-soft) !important;
  border-radius: 4px !important;
  overflow-x: auto !important;
  line-height: 1.4 !important;
}

/* Daniel Miessler Table Styling */
.VPDoc .vp-doc table,
.vp-doc table {
  margin: 1.25rem 0 !important;
  border-collapse: collapse !important;
  width: 100% !important;
  font-size: .91rem !important;
}

.VPDoc .vp-doc table th,
.VPDoc .vp-doc table td,
.vp-doc table th,
.vp-doc table td {
  border: 1px solid var(--vp-c-divider) !important;
  padding: 0.75rem 1rem !important;
  text-align: left !important;
}

.VPDoc .vp-doc table th,
.vp-doc table th {
  background: var(--vp-c-bg-soft) !important;
  font-weight: 600 !important;
}

.VPDoc .vp-doc table tr:hover,
.vp-doc table tr:hover {
  background: var(--vp-c-bg-soft) !important;
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

/* Responsive Design - Single column on mobile/tablet */
@media (max-width: 960px) {
  body {
    max-width: 100% !important;
    padding: 0 1rem;
  }

  .VPDoc .content {
    margin-left: 20px !important;
    margin-right: 20px !important;
    max-width: 100% !important;
  }

  .VPDoc .container {
    margin-left: 20px !important;
    margin-right: 20px !important;
    max-width: 100% !important;
  }

  .page-title {
    position: static !important;
    width: auto !important;
    text-align: left !important;
    left: 0 !important;
    margin-top: 40px !important;
    margin-bottom: 1.5rem !important;
    border: none !important;
    padding: 0 !important;
  }

  .page-title .frontmatter-title {
    font-size: 1.125rem !important;
  }

  .page-title .frontmatter-subtitle {
    font-size: 0.9375rem !important;
  }

  .page-title .frontmatter-tags {
    flex-wrap: wrap;
    flex-direction: row;
  }

  .footer-social-links {
    flex-wrap: wrap;
  }
}

/* Extra small mobile */
@media (max-width: 520px) {
  body {
    max-width: 100% !important;
    padding: 0 1rem;
  }

  .page-title {
    margin-top: 30px !important;
  }

  .VPDoc .content {
    margin-left: 15px !important;
    margin-right: 15px !important;
    max-width: 100% !important;
  }

  .VPDoc .container {
    margin-left: 15px !important;
    margin-right: 15px !important;
    max-width: 100% !important;
  }

  .page-title aside {
    background: var(--vp-c-bg-soft);
    padding: .3rem .5rem;
    width: 90%;
    border: 1px solid var(--vp-c-divider);
    border-left: 3px solid var(--vp-c-divider)
  }

  .page-title aside>p:last-child {
    margin-bottom: 0
  }
}
</style>