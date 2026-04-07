<script setup lang="ts">
import { onMounted, computed } from 'vue'
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

onMounted(() => {
  // Skip on homepage
  if (page.value.relativePath === 'index.md') return

  const doc = document.querySelector('.VPDoc')
  if (!doc) return

  // Check if gutter already exists
  if (doc.querySelector('.page-gutter')) return

  // Create page title wrapper (div, not aside)
  const pageTitle = document.createElement('div')
  pageTitle.className = 'page-title'

  // Title
  if (frontmatter.value.title) {
    const h1 = document.createElement('h1')
    h1.textContent = frontmatter.value.title
    pageTitle.appendChild(h1)
  }

  // Subtitle
  if (frontmatter.value.subtitle) {
    const subtitle = document.createElement('div')
    subtitle.className = 'subtitle'
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

  // Insert page title at the beginning
  doc.insertBefore(pageTitle, doc.firstChild)

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
    }

    // Tags
    if (tags.value && tags.value.length) {
      const tagsContainer = document.createElement('div')
      tagsContainer.className = 'tags'

      tags.value.forEach(tag => {
        const tagEl = document.createElement('span')
        tagEl.className = 'tag'
        tagEl.textContent = tag
        tagsContainer.appendChild(tagEl)
      })

      aside.appendChild(tagsContainer)
    }

    // Insert after page title
    if (pageTitle.nextSibling) {
      doc.insertBefore(aside, pageTitle.nextSibling)
    } else {
      doc.appendChild(aside)
    }
  }

  // Hide default h1
  const defaultH1 = doc.querySelector('.VPDoc h1')
  if (defaultH1) {
    (defaultH1 as HTMLElement).style.display = 'none'
  }
})
</script>

<template>
  <!-- Client-side component that injects gutter into DOM -->
</template>
