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

  // Create gutter element
  const gutter = document.createElement('aside')
  gutter.className = 'page-gutter'

  let html = '<div class="page-title-wrapper">'

  // Title
  if (frontmatter.value.title) {
    html += `<h1>${frontmatter.value.title}</h1>`
  }

  // Subtitle
  if (frontmatter.value.subtitle) {
    html += `<p class="subtitle">${frontmatter.value.subtitle}</p>`
  }

  // Description (for non-blog pages)
  if (frontmatter.value.description && !frontmatter.value.created_at) {
    html += `<p class="description">${frontmatter.value.description}</p>`
  }

  // Date metadata (for blog posts)
  if (createdDate.value) {
    html += '<div class="meta-info">'
    html += `<time>${createdDate.value}</time>`
    if (updatedDate.value) {
      html += `<span> · Updated ${updatedDate.value}</span>`
    }
    html += '</div>'
  }

  // Tags
  if (tags.value && tags.value.length) {
    html += '<div class="tags">'
    tags.value.forEach(tag => {
      html += `<span class="tag">${tag}</span>`
    })
    html += '</div>'
  }

  html += '</div>'

  gutter.innerHTML = html

  // Hide default h1
  const defaultH1 = doc.querySelector('.VPDoc h1')
  if (defaultH1) {
    (defaultH1 as HTMLElement).style.display = 'none'
  }

  // Insert gutter at the beginning of VPDoc
  doc.insertBefore(gutter, doc.firstChild)
})
</script>

<template>
  <!-- Client-side component that injects gutter into DOM -->
</template>
