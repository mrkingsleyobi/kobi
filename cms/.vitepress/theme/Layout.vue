<script setup lang="ts">
import { onMounted, onUpdated, computed, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, useRouter } from 'vitepress'
import type { Frontmatter } from './types'
import { formatDate, parseTags } from './utils/format'

const { Layout } = DefaultTheme
const { frontmatter, page } = useData<Frontmatter>()
const router = useRouter()

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

  // For non-homepage only: clean up existing gutters first
  const allWrappers = document.querySelectorAll('.page-wrapper')
  allWrappers.forEach(wrapper => {
    const vpDoc = wrapper.querySelector('.VPDoc')
    if (vpDoc && wrapper.parentElement) {
      wrapper.parentElement.insertBefore(vpDoc, wrapper)
    }
    wrapper.remove()
  })
  console.log('Layout: Cleaned up', allWrappers.length, 'existing gutters')

  // Find the current VPDoc
  const doc = document.querySelector('.VPDoc')
  if (!doc) {
    console.log('Layout: VPDoc not found, retrying...')
    return
  }

  const parent = doc.parentElement
  if (!parent) {
    console.log('Layout: VPDoc parent not found')
    return
  }

  // Create wrapper
  const wrapper = document.createElement('div')
  wrapper.className = 'page-wrapper'

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

  // Wrap structure
  parent.insertBefore(wrapper, doc)
  wrapper.appendChild(pageTitle)
  wrapper.appendChild(doc)

  // Hide default h1
  const defaultH1 = doc.querySelector('.content h1')
  if (defaultH1) {
    defaultH1.style.display = 'none'
  }

  console.log('Layout: Injected gutter for', page.value.relativePath, 'with title:', frontmatter.value.title, 'Total gutters in DOM:', document.querySelectorAll('.page-wrapper').length)
}

onMounted(() => {
  setTimeout(updateNavbarVisibility, 100)
  setTimeout(injectGutter, 200)
})

onUpdated(() => {
  setTimeout(updateNavbarVisibility, 100)
  setTimeout(injectGutter, 200)
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
  <Layout />
</template>
