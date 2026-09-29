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

// blog-split sidebar field sets vary by page type - see README
// "Two-column sidebar layout pattern".
const relativePath = computed(() => page.value.relativePath)

const isBlogPost = computed(() => !!frontmatter.value.created_at)
const isBlogIndex = computed(() => relativePath.value === 'blog/index.md')
const isProjects = computed(() => relativePath.value.startsWith('projects/'))

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
  <div class="page-title blog-split-sidebar">
    <h1 v-if="frontmatter.title" class="frontmatter-title text-pretcty">
      {{ frontmatter.title }}
    </h1>

    <!-- Blog index: live subtitle (post count / date range) overrides static subtitle -->
    <div v-if="isBlogIndex && blogIndexSubtitle" class="frontmatter-subtitle">
      {{ blogIndexSubtitle }}
    </div>
    <div v-else-if="frontmatter.subtitle" class="frontmatter-subtitle">
      {{ frontmatter.subtitle }}
    </div>

    <!--
      Per README "Two-column sidebar layout pattern": static pages and
      Archives show ONLY title + italic subtitle in the sidebar - no
      description line, no live elements, no duplicated H1 in the body.
    -->

    <!-- Blog post: date, tags, author, AIL badge, spinner verb, reading-now -->
    <template v-if="isBlogPost">
      <div v-if="createdDate" class="frontmatter-created-at">
        {{ createdDate }}
      </div>

      <div v-if="tags.length" class="frontmatter-tags">
        <a
          v-for="tag in tags"
          :key="tag"
          :href="`/archives/?tag=${tag.toLowerCase()}`"
          class="tag-link"
        >
          #{{ tag }}
        </a>
      </div>

      <div v-if="frontmatter.author" class="frontmatter-author">
        {{ frontmatter.author }}
      </div>

      <AilBadge v-if="frontmatter.ail !== undefined" :level="frontmatter.ail" />

      <SpinnerVerbs />
      <ViewerCount />
    </template>

    <!-- Blog index: spinner verb + reading-now, no author/tags/AIL -->
    <template v-else-if="isBlogIndex">
      <SpinnerVerbs />
      <ViewerCount />
    </template>

    <!-- Projects: date, tags, author - no reading-now -->
    <template v-else-if="isProjects">
      <div v-if="createdDate" class="frontmatter-created-at">
        {{ createdDate }}
      </div>

      <div v-if="tags.length" class="frontmatter-tags">
        <a
          v-for="tag in tags"
          :key="tag"
          :href="`/archives/?tag=${tag.toLowerCase()}`"
          class="tag-link"
        >
          #{{ tag }}
        </a>
      </div>

      <div v-if="frontmatter.author" class="frontmatter-author">
        {{ frontmatter.author }}
      </div>
    </template>

    <!-- Archives / static pages: title + subtitle only, nothing else -->
  </div>
</template>

<style scoped>
.page-title {
  position: absolute !important;
  left: 1.5rem !important;
  top: 60px !important;
  width: 14rem !important;
  text-align: right !important;
  font-weight: 400;
  border-top: solid 3px var(--vp-c-brand-1) !important;
  padding-top: 5px !important;
  z-index: 1;
  background: transparent !important;
  box-sizing: border-box !important;
  margin: 0 !important;
}

.frontmatter-title {
  font-family: inherit !important;
  text-transform: inherit !important;
  letter-spacing: inherit !important;
  font-size: 125% !important;
  line-height: 1.1 !important;
  border-bottom: inherit !important;
  margin-top: 0rem !important;
  margin-bottom: .8rem !important;
  font-weight: bolder !important;
  border-top: 0 !important;
  padding-top: 0 !important;
  color: var(--vp-c-text-1) !important;
}

.frontmatter-subtitle {
  font-family: valkyrie-text, Georgia, serif !important;
  display: block !important;
  font-size: 95% !important;
  font-weight: 300 !important;
  color: var(--vp-c-text-2) !important;
  line-height: 1.25 !important;
  font-style: italic !important;
  margin-bottom: .8rem !important;
  -webkit-hyphens: none !important;
  hyphens: none !important;
}

.frontmatter-created-at {
  font-family: equity-text, Georgia, serif !important;
  display: block !important;
  font-size: .8rem !important;
  font-weight: 400 !important;
  line-height: 1.3 !important;
  margin-bottom: .6rem !important;
  color: var(--vp-c-text-2) !important;
}

.frontmatter-tags {
  display: block !important;
  margin-top: .5rem !important;
  line-height: 1.4 !important;
}

.tag-link {
  display: block !important;
  font-size: .75rem !important;
  color: var(--vp-c-brand-1) !important;
  text-decoration: none !important;
  margin-bottom: .2rem !important;
  transition: color 0.2s ease !important;
}

.tag-link:hover {
  color: var(--vp-c-brand-2) !important;
  text-decoration: underline !important;
}

.frontmatter-author {
  display: block !important;
  font-size: .75rem !important;
  color: var(--vp-c-text-3) !important;
  margin-top: .4rem !important;
  font-style: italic;
}

.description {
  font-size: .6875rem !important;
  color: var(--vp-c-text-3) !important;
  line-height: 1.4 !important;
  margin: 0 !important;
}

/*
  Downstream rules (positioning, responsive breakpoints, dark-mode overrides)
  live in custom.css and target .page-title / .frontmatter-* selectors, so
  markup/class names here are kept stable.
*/
</style>
