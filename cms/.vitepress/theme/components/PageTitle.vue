<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import type { Frontmatter } from '../types'
import { formatDate, parseTags } from '../utils/format'
import { loadAllPosts } from '../utils/posts'
import SpinnerVerbs from './SpinnerVerbs.vue'
import ViewerCount from './ViewerCount.vue'
import AilBadge from './AilBadge.vue'

const { frontmatter, page } = useData<Frontmatter>()

const tags = computed(() => parseTags(frontmatter.value.tags))
const createdDate = computed(() =>
  frontmatter.value.created_at ? formatDate(frontmatter.value.created_at) : null
)

// blog-split sidebar field sets vary by page type, matching the prototype's
// renderBlogSidebar() / renderBlogPostSidebar() / renderPageSidebar() calls
// 1:1 (see README "Two-column sidebar layout pattern").
const relativePath = computed(() => page.value.relativePath)

const isBlogPost = computed(() => relativePath.value.startsWith('blog/') && !!frontmatter.value.created_at)
const isBlogIndex = computed(() => relativePath.value === 'blog/index.md')
const isProjects = computed(() => relativePath.value === 'projects/index.md')

// Static pages (Telos, Ideas, Predictions, Archives, Consulting, About,
// Members) show title + subtitle only - no live spinner/reading-now, no
// created date, no tags, no author line (renderPageSidebar(..., {noLive:true})).
const isStaticPage = computed(() => !isBlogPost.value && !isBlogIndex.value && !isProjects.value)

// Live subtitle for the blog index: post count + date range.
const blogIndexSubtitle = ref<string | null>(null)

onMounted(async () => {
  if (!isBlogIndex.value) return
  try {
    const posts = await loadAllPosts()
    if (!posts.length) return
    const dates = posts
      .map((p) => new Date(p.created_at))
      .filter((d) => !isNaN(d.getTime()))
    if (!dates.length) {
      blogIndexSubtitle.value = `${posts.length} posts`
      return
    }
    const oldest = new Date(Math.min(...dates.map((d) => d.getTime())))
    const newest = new Date(Math.max(...dates.map((d) => d.getTime())))
    const oldestYear = oldest.getFullYear()
    const newestYear = newest.getFullYear()
    const range = oldestYear === newestYear ? `${oldestYear}` : `${oldestYear}\u2013${newestYear}`
    blogIndexSubtitle.value = `${posts.length} posts \u00b7 ${range}`
  } catch (error) {
    console.error('Error loading post stats for sidebar subtitle:', error)
  }
})
</script>

<template>
  <div class="blog-split-left">
    <div class="bsl-fm-title">{{ frontmatter.title }}</div>
    <div v-if="isBlogIndex" class="bsl-fm-subtitle">{{ blogIndexSubtitle || frontmatter.subtitle }}</div>
    <div v-else class="bsl-fm-subtitle">{{ frontmatter.subtitle }}</div>

    <div v-if="isBlogPost || isProjects" class="bsl-fm-created">{{ createdDate }}</div>

    <div v-if="isBlogPost || isProjects" class="fm-tags" style="justify-content:flex-end;">
      <span v-for="tag in tags" :key="tag" class="fm-tag">#{{ tag }}</span>
    </div>

    <div v-if="isBlogPost || isBlogIndex || isProjects" class="bsl-fm-author">
      by <span style="font-weight:700; color:var(--text-2);">Kingsley Obi</span>
    </div>

    <AilBadge v-if="isBlogPost && typeof frontmatter.ail === 'number'" :level="frontmatter.ail" />

    <template v-if="isBlogPost || isBlogIndex || isProjects">
      <SpinnerVerbs />
      <ViewerCount v-if="!isProjects" />
    </template>
  </div>
</template>
