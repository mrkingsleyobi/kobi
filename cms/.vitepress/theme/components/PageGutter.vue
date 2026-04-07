<script setup lang="ts">
import { onMounted, onUpdated, computed, watch } from 'vue'
import { useData } from 'vitepress'
import type { Frontmatter } from '../types'
import { formatDate, parseTags } from '../utils/format'

const { frontmatter, page } = useData<Frontmatter>()

const tags = computed(() => parseTags(frontmatter.value.tags))
const createdDate = computed(() =>
  frontmatter.value.created_at ? formatDate(frontmatter.value.created_at) : null
)
const updatedDate = computed(() =>
  frontmatter.value.updated_at && frontmatter.value.updated_at !== frontmatter.value.created_at
    ? formatDate(frontmatter.value.updated_at)
    : null
)

const injectGutter = () => {
  // Skip on homepage
  if (page.value.relativePath === 'index.md') return

  // Find the content container
  const content = document.querySelector('.VPDoc .content')
  if (!content) {
    console.log('PageGutter: .VPDoc .content not found')
    return
  }

  // Check if gutter already exists
  if (document.querySelector('.page-title')) {
    console.log('PageGutter: Already injected')
    return
  }

  console.log('PageGutter: Injecting gutter for', page.value.relativePath)

  // Get the container
  const container = content.closest('.VPDoc')
  if (!container) return

  // Create page title wrapper (div, not aside)
  const pageTitle = document.createElement('div')
  pageTitle.className = 'page-title'

  // Title
  if (frontmatter.value.title) {
    const h1 = document.createElement('h1')
    h1.textContent = frontmatter.value.title
    pageTitle.appendChild(h1)
    console.log('PageGutter: Added title', frontmatter.value.title)
  }

  // Subtitle
  if (frontmatter.value.subtitle) {
    const subtitle = document.createElement('div')
    subtitle.className = 'subtitle'
    subtitle.textContent = frontmatter.value.subtitle
    pageTitle.appendChild(subtitle)
    console.log('PageGutter: Added subtitle', frontmatter.value.subtitle)
  }

  // Description (for non-blog pages)
  if (frontmatter.value.description && !frontmatter.value.created_at) {
    const description = document.createElement('div')
    description.className = 'description'
    description.textContent = frontmatter.value.description
    pageTitle.appendChild(description)
  }

  // Insert page title at the beginning of container
  container.insertBefore(pageTitle, container.firstChild)

  // For blog posts, add metadata aside
  if (createdDate.value || tags.value.length) {
    const aside = document.createElement('aside')
    aside.className = 'page-gutter'

    // Date metadata
    if (createdDate.value) {
      const metaInfo = document.createElement('div')
      metaInfo.className = 'meta-info'

      const time = document.createElement('time')
      time.textContent = createdDate.value
      aside.appendChild(time)

      if (updatedDate.value) {
        const updated = document.createElement('span')
        updated.textContent = ` · Updated ${updatedDate.value}`
        aside.appendChild(updated)
      }
      console.log('PageGutter: Added date', createdDate.value)
    }

    // Tags
    if (tags.value && tags.value.length) {
      tags.value.forEach(tag => {
        const tagEl = document.createElement('span')
        tagEl.className = 'tag'
        tagEl.textContent = tag
        aside.appendChild(tagEl)
      })
      console.log('PageGutter: Added tags', tags.value)
    }

    // Insert after page title
    if (pageTitle.nextSibling) {
      container.insertBefore(aside, pageTitle.nextSibling)
    } else {
      container.appendChild(aside)
    }
  }

  // Hide default h1
  const defaultH1 = container.querySelector('.content h1')
  if (defaultH1) {
    (defaultH1 as HTMLElement).style.display = 'none'
    console.log('PageGutter: Hid default h1')
  }
}

onMounted(() => {
  // Wait a bit for DOM to be ready
  setTimeout(injectGutter, 100)
})

onUpdated(() => {
  // Re-inject on route changes
  setTimeout(injectGutter, 100)
})

// Watch for page changes
watch(() => page.value.relativePath, () => {
  setTimeout(injectGutter, 100)
})
</script>

<template>
  <!-- Client-side component that injects gutter into DOM -->
</template>
