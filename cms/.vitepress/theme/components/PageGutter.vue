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

const injectGutter = () => {
  // Skip on homepage
  if (page.value.relativePath === 'index.md') return

  // Find the VPDoc container
  const vpDoc = document.querySelector('.VPDoc')
  if (!vpDoc) {
    console.log('PageGutter: .VPDoc not found')
    return
  }

  // Check if gutter already exists
  if (document.querySelector('.page-title')) {
    console.log('PageGutter: Already injected')
    return
  }

  console.log('PageGutter: Injecting gutter for', page.value.relativePath)

  // Get the parent of VPDoc
  const parent = vpDoc.parentElement
  if (!parent) return

  // Create a wrapper div to hold both gutter and VPDoc
  const wrapper = document.createElement('div')
  wrapper.className = 'page-wrapper'

  // Create page-title div (contains all metadata)
  const pageTitle = document.createElement('div')
  pageTitle.className = 'page-title'

  // Title
  if (frontmatter.value.title) {
    const h1 = document.createElement('h1')
    h1.className = 'frontmatter-title text-pretcty'
    h1.textContent = frontmatter.value.title
    pageTitle.appendChild(h1)
    console.log('PageGutter: Added title', frontmatter.value.title)
  }

  // Subtitle
  if (frontmatter.value.subtitle) {
    const subtitle = document.createElement('div')
    subtitle.className = 'frontmatter-subtitle'
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

  // Created Date and Tags (for blog posts)
  if (createdDate.value || tags.value.length) {
    // Date metadata
    if (createdDate.value) {
      const dateDiv = document.createElement('div')
      dateDiv.className = 'frontmatter-created-at'
      dateDiv.textContent = createdDate.value
      pageTitle.appendChild(dateDiv)
      console.log('PageGutter: Added date', createdDate.value)
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
      console.log('PageGutter: Added tags', tags.value)
    }
  }

  // Build the new structure:
  // wrapper
  //   .page-title (gutter with metadata)
  //   .VPDoc (original content)

  // Insert wrapper before VPDoc in parent
  parent.insertBefore(wrapper, vpDoc)

  // Move VPDoc into wrapper
  wrapper.appendChild(vpDoc)

  // Insert page-title at the beginning of wrapper (before VPDoc)
  wrapper.insertBefore(pageTitle, vpDoc)

  // Hide default h1 inside VPDoc
  const defaultH1 = vpDoc.querySelector('.content h1')
  if (defaultH1) {
    (defaultH1 as HTMLElement).style.display = 'none'
    console.log('PageGutter: Hid default h1')
  }

  // Move aside elements from content to page-title gutter (like Daniel's site)
  const moveAsidesToGutter = () => {
    const contentAsides = vpDoc.querySelectorAll('.vp-doc aside')
    console.log(`PageGutter: Found ${contentAsides.length} asides to move`)

    contentAsides.forEach((aside, index) => {
      console.log(`PageGutter: Moving aside ${index + 1} to page-title`, aside.textContent?.substring(0, 50))
      // Clone the aside and add to page-title
      const asideClone = aside.cloneNode(true) as HTMLElement
      pageTitle.appendChild(asideClone)
      // Hide the original aside from content
      (aside as HTMLElement).style.display = 'none'
    })
  }

  // Move asides immediately
  moveAsidesToGutter()

  // Also move asides after a short delay in case they're rendered late
  setTimeout(moveAsidesToGutter, 500)
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
