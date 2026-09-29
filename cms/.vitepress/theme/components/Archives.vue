<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { loadAllPosts } from '../utils/posts'
import { formatDate } from '../utils/format'
import { OFFICIAL_TAGS } from '../types'
import type { BlogPostData } from '../types'

const posts = ref<BlogPostData[]>([])
const loading = ref(true)
const search = ref('')
const activeYears = ref<string[]>([])
const activeTags = ref<string[]>([])
const currentPage = ref(1)
const postsPerPage = 8

onMounted(async () => {
  try {
    posts.value = await loadAllPosts()
  } catch (error) {
    console.error('Archives: failed to load posts', error)
  } finally {
    loading.value = false
  }
  loadFiltersFromURL()
})

function loadFiltersFromURL() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const q = params.get('search')
  if (q) search.value = q
}

const availableYears = computed(() => {
  const years = new Set(posts.value.map((p) => new Date(p.created_at).getFullYear().toString()))
  return Array.from(years)
    .filter((y) => y !== 'NaN')
    .sort((a, b) => parseInt(b) - parseInt(a))
})

const yearCounts = computed(() => {
  const counts: Record<string, number> = {}
  posts.value.forEach((p) => {
    const y = new Date(p.created_at).getFullYear().toString()
    counts[y] = (counts[y] || 0) + 1
  })
  return counts
})

const tagCounts = computed(() => {
  const counts: Record<string, number> = {}
  posts.value.forEach((p) => p.tags.forEach((t) => { counts[t] = (counts[t] || 0) + 1 }))
  return counts
})

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    if (search.value) {
      const q = search.value.toLowerCase()
      const matches =
        post.title.toLowerCase().includes(q) ||
        (post.subtitle || '').toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      if (!matches) return false
    }
    if (activeYears.value.length) {
      const year = new Date(post.created_at).getFullYear().toString()
      if (!activeYears.value.includes(year)) return false
    }
    if (activeTags.value.length) {
      if (!activeTags.value.some((t) => post.tags.includes(t))) return false
    }
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / postsPerPage)))
const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  return filteredPosts.value.slice(start, start + postsPerPage)
})

function toggleYear(year: string) {
  const i = activeYears.value.indexOf(year)
  if (i > -1) activeYears.value.splice(i, 1)
  else activeYears.value.push(year)
  currentPage.value = 1
}
function toggleTag(tag: string) {
  const i = activeTags.value.indexOf(tag)
  if (i > -1) activeTags.value.splice(i, 1)
  else activeTags.value.push(tag)
  currentPage.value = 1
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value -= 1
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

const yearsActive = computed(() => {
  if (!posts.value.length) return undefined
  const dates = posts.value.map((p) => new Date(p.created_at)).filter((d) => !isNaN(d.getTime()))
  if (!dates.length) return undefined
  const oldest = Math.min(...dates.map((d) => d.getTime()))
  const newest = Math.max(...dates.map((d) => d.getTime()))
  return ((newest - oldest) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)
})
</script>

<template>
  <div class="search-box" style="margin-top:16px;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
    <input v-model="search" type="text" :placeholder="`Explore all ${posts.length} posts across ${yearsActive || ''} years and ${OFFICIAL_TAGS.length} tags…`" />
  </div>

  <div class="facet-block">
    <div class="facet-label">Years</div>
    <div class="facet-row">
      <button
        v-for="year in availableYears"
        :key="year"
        class="facet-pill"
        :class="{ tier: activeYears.includes(year) }"
        @click="toggleYear(year)"
      >{{ year }} ({{ yearCounts[year] }})</button>
    </div>
  </div>

  <div class="facet-block">
    <div class="facet-label">Tags</div>
    <div class="facet-row">
      <button
        v-for="tag in OFFICIAL_TAGS"
        :key="tag"
        class="facet-pill"
        :class="{ tier: activeTags.includes(tag) }"
        @click="toggleTag(tag)"
      >{{ tag.toUpperCase() }} ({{ tagCounts[tag] || 0 }})</button>
    </div>
  </div>

  <div class="facet-label" style="margin-top:36px;">Latest content</div>
  <div v-if="loading" class="blog-list archive-list">Loading…</div>
  <div v-else class="blog-list archive-list">
    <a v-for="post in pagedPosts" :key="post.slug" class="fm-row" :href="`/blog/${post.slug}`">
      <div class="fm-thumb" :style="post.image ? { backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}" />
      <div class="fm-body">
        <div class="fm-main">
          <div class="fm-title">{{ post.title }}</div>
          <div class="fm-date">{{ formatDate(post.created_at) }}</div>
        </div>
        <div class="fm-excerpt">{{ post.excerpt }}</div>
        <div class="fm-tags">
          <span v-for="tag in post.tags" :key="tag" class="fm-tag">#{{ tag }}</span>
        </div>
      </div>
    </a>
  </div>

  <div class="pagination" style="margin-top:1.2rem;">
    <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">&larr; Previous</button>
    <div class="page-info"><span class="page-cur">{{ currentPage }}</span><span class="page-sep">/</span><span class="page-total">{{ totalPages }}</span></div>
    <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">Next &rarr;</button>
  </div>
</template>
