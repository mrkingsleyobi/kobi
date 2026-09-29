<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { loadAllPosts } from '../utils/posts'
import { formatDate } from '../utils/format'
import PostFooterBlock from './PostFooterBlock.vue'
import type { BlogPostData } from '../types'

const posts = ref<BlogPostData[]>([])
const loading = ref(true)
const activeFilter = ref<'all' | 'must' | 'recommended' | 'top'>('all')
const currentPage = ref(1)
const postsPerPage = 6

onMounted(async () => {
  try {
    posts.value = await loadAllPosts()
  } catch (error) {
    console.error('BlogHome: failed to load posts', error)
  } finally {
    loading.value = false
  }
})

function tierOf(post: BlogPostData): string | undefined {
  return post.curation?.toLowerCase()
}

const counts = computed(() => ({
  all: posts.value.length,
  must: posts.value.filter((p) => tierOf(p) === 'must').length,
  recommended: posts.value.filter((p) => tierOf(p) === 'recommended').length,
  top: posts.value.filter((p) => tierOf(p) === 'top').length
}))

const filteredPosts = computed(() => {
  if (activeFilter.value === 'all') return posts.value
  return posts.value.filter((p) => tierOf(p) === activeFilter.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / postsPerPage)))

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  return filteredPosts.value.slice(start, start + postsPerPage)
})

function setFilter(filter: 'all' | 'must' | 'recommended' | 'top') {
  activeFilter.value = filter
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
  const years = (newest - oldest) / (1000 * 60 * 60 * 24 * 365)
  return years.toFixed(1)
})

const tagCount = computed(() => {
  const set = new Set<string>()
  posts.value.forEach((p) => p.tags.forEach((t) => set.add(t.toLowerCase())))
  return set.size
})
</script>

<template>
  <p class="lede" style="margin-top:16px;">
    This is some of my favorite, most popular, and latest content. You can also
    <a href="/archives/" style="font-weight:700; text-decoration:underline; color:var(--accent-1);">browse and search the archives</a>.
  </p>

  <div class="filter-row">
    <button class="filter-chip" :class="{ on: activeFilter === 'all' }" @click="setFilter('all')">All<span class="n">{{ counts.all }}</span></button>
    <button class="filter-chip" :class="{ on: activeFilter === 'must' }" @click="setFilter('must')">Must<span class="n">{{ counts.must }}</span></button>
    <button class="filter-chip" :class="{ on: activeFilter === 'recommended' }" @click="setFilter('recommended')">Recommended<span class="n">{{ counts.recommended }}</span></button>
    <button class="filter-chip" :class="{ on: activeFilter === 'top' }" @click="setFilter('top')">Top<span class="n">{{ counts.top }}</span></button>
  </div>

  <div class="blog-list-divider" />
  <div class="blog-list-section-label">Latest Content</div>

  <div v-if="loading" class="blog-list">Loading…</div>
  <div v-else class="blog-list">
    <a v-for="post in pagedPosts" :key="post.slug" class="fm-row" :href="`/blog/${post.slug}`">
      <div class="fm-thumb" :style="post.image ? { backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}" />
      <div class="fm-body">
        <div class="fm-main">
          <div class="fm-title">{{ post.title }}</div>
          <div class="fm-date">{{ formatDate(post.created_at) }}</div>
        </div>
        <div class="fm-excerpt">{{ post.excerpt }}</div>
        <div class="fm-tags">
          <span v-for="tag in post.tags" :key="tag" class="fm-tag" :class="{ 'fm-tier': ['must', 'recommended', 'top'].includes(tag.toLowerCase()) }">#{{ tag }}</span>
        </div>
      </div>
    </a>
  </div>

  <div class="pagination" style="margin-top:1.2rem;">
    <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">&larr; Previous</button>
    <div class="page-info"><span class="page-cur">{{ currentPage }}</span><span class="page-sep">/</span><span class="page-total">{{ totalPages }}</span></div>
    <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">Next &rarr;</button>
  </div>

  <PostFooterBlock :post-count="counts.all" :years-active="yearsActive" :tag-count="tagCount" />
</template>
