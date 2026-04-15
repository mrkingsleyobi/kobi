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

  // Find the VPDoc container and its content area
  const vpDoc = document.querySelector('.VPDoc')
  if (!vpDoc) {
    console.log('VPDoc not found')
    return
  }

  // Get the content area within VPDoc
  const content = vpDoc.querySelector('.content')
  if (!content) {
    console.log('VPDoc .content not found')
    return
  }

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

    // Add footer components for blog posts at the end of content
    if (isBlogPost.value) {
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

  // Insert page-title as first child of content area (for two-column layout)
  content.insertBefore(pageTitle, content.firstChild)
  console.log('Gutter inserted into content area for two-column layout')

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

/* Two-Column Grid Layout for Content Area */
.VPDoc .content {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  align-items: start;
  max-width: 960px;
  margin: 0 auto;
}

/* Page Title Gutter - Left Column */
.page-title {
  grid-column: 1;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  box-sizing: border-box;
  position: sticky;
  top: calc(var(--vp-nav-height) + 32px);
  max-height: calc(100vh - var(--vp-nav-height) - 64px);
  overflow-y: auto;
  text-align: left;
  font-size: 16px;
}

/* Main Content - Right Column */
.VPDoc .content .vp-doc {
  grid-column: 2;
}

/* Remove default padding from VPDoc container */
.VPDoc .container {
  max-width: 100%;
}

.page-title .frontmatter-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.page-title .frontmatter-subtitle {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 0 0 12px 0;
  line-height: 1.4;
  opacity: 0.8;
}

.page-title .frontmatter-created-at {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0 0 12px 0;
  opacity: 0.7;
}

.page-title .frontmatter-tags {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0 0 0;
}

.page-title .tag-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 14px;
  transition: opacity 0.2s ease;
  display: block;
}

.page-title .tag-link:hover {
  opacity: 0.8;
}

.page-title .description {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 12px 0 0 0;
  line-height: 1.4;
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
  .VPDoc .content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .page-title {
    grid-column: 1;
    position: static;
    padding: 24px 0;
    margin-bottom: 24px;
    border-bottom: 2px solid var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
  }

  .VPDoc .content .vp-doc {
    grid-column: 1;
  }

  .page-title .frontmatter-title {
    font-size: 24px;
  }

  .page-title .frontmatter-subtitle {
    font-size: 16px;
  }

  .page-title .frontmatter-tags {
    flex-wrap: wrap;
    flex-direction: row;
  }

  .footer-social-links {
    flex-wrap: wrap;
  }
}
</style>