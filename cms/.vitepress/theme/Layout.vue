<script setup lang="ts">
import { onMounted, computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import type { Frontmatter } from './types'
import { formatDate, parseTags } from './utils/format'

const { Layout } = DefaultTheme
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

const showGutter = computed(() => page.value.relativePath !== 'index.md')

onMounted(() => {
  setTimeout(() => {
    const doc = document.querySelector('.VPDoc')
    if (!doc) return

    const parent = doc.parentElement
    if (!parent) return

    // Check if already wrapped
    if (parent.querySelector('.page-wrapper')) return

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
      tags.value.forEach(tag => {
        const tagEl = document.createElement('span')
        tagEl.className = 'tag'
        tagEl.textContent = tag
        pageTitle.appendChild(tagEl)
      })
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
  }, 200)
})
</script>

<template>
  <Layout />
</template>
