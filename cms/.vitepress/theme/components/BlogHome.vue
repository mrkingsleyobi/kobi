<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { BlogPostData } from '../types'
import ShareButtons from './ShareButtons.vue'
import FollowButtons from './FollowButtons.vue'
import ContentStats from './ContentStats.vue'
import SupportSection from './SupportSection.vue'

const posts = ref<BlogPostData[]>([])
const featuredPost = ref<BlogPostData | null>(null)
const curatedPosts = ref<BlogPostData[]>([])
const loading = ref(true)
const currentPage = ref(1)
const postsPerPage = 6
const activeTagFilter = ref<string>('must') // Default to 'must' to match Daniel's site

onMounted(async () => {
  try {
    // Dynamically import all blog post metadata
    const blogModules = import.meta.glob('/blog/*.md', { as: 'raw' })

    const postData: BlogPostData[] = []

    for (const path in blogModules) {
      const content = await blogModules[path]()
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/)

      if (frontmatterMatch) {
        const frontmatter: any = {}
        const lines = frontmatterMatch[1].split('\n')

        for (const line of lines) {
          const match = line.match(/^(\w+):\s*(.+)$/)
          if (match) {
            const [, key, value] = match
            frontmatter[key] = value.replace(/^["']|["']$/g, '')
          }
        }

        // Parse slug from path
        const slug = path.split('/').pop()?.replace('.md', '') || ''

        // Skip index.md
        if (slug === 'index') continue

        // Get first image from content for thumbnail
        const imageMatch = content.match(/!\[.*?\]\((\/images\/.+?\.(jpg|png|jpeg|gif|webp))\)/)
        const image = imageMatch ? imageMatch[1] : null

        // Get excerpt (first actual text paragraph)
        const afterFrontmatter = content.replace(/^---[\s\S]*?---\n\n/, '')
        const contentLines = afterFrontmatter.split('\n').filter(line =>
          line.trim() &&
          !line.trim().startsWith('![') &&
          !line.trim().startsWith('<caption>') &&
          !line.trim().startsWith('<callout>')
        )
        const excerpt = contentLines.length > 0 ? contentLines[0].substring(0, 150) + '...' : ''

        postData.push({
          slug,
          title: frontmatter.title || 'Untitled',
          subtitle: frontmatter.subtitle || '',
          created_at: frontmatter.created_at || '',
          tags: frontmatter.tags ? frontmatter.tags.split('|').map((t: string) => t.trim()) : [],
          image,
          excerpt,
          description: frontmatter.description || excerpt,
          curation: frontmatter.curation || undefined
        })
      }
    }

    // Sort by date (newest first)
    postData.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    posts.value = postData

    // Set featured post as curated post if available, otherwise first post
    const featuredCuration = postData.find(post => post.curation === 'featured')
    if (featuredCuration) {
      featuredPost.value = featuredCuration
    } else if (postData.length > 0) {
      featuredPost.value = postData[0]
    }

    // Set curated posts (featured, recommended, top)
    curatedPosts.value = postData.filter(post =>
      post.curation === 'featured' || post.curation === 'recommended' || post.curation === 'top'
    )
  } catch (error) {
    console.error('Error loading blog posts:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

// Tag-based filtering for recommended section (Daniel's approach)
// IMPORTANT: Grid should be EMPTY initially, only show posts AFTER filter is clicked
const hasInteractedWithFilters = ref(false)

const recommendedPosts = computed(() => {
  // Don't show anything until user interacts with filters
  if (!hasInteractedWithFilters.value) {
    return []
  }

  if (activeTagFilter.value === 'all') {
    return posts.value.slice(0, 8) // Limit to 8 posts for grid
  }

  // Filter by tags
  return posts.value.filter(post =>
    post.tags.some(tag =>
      tag.toLowerCase() === activeTagFilter.value.toLowerCase()
    )
  ).slice(0, 8)
})

// Shuffled recommended posts for shuffle button
const shuffledPosts = ref<BlogPostData[]>([])

const shuffleRecommended = () => {
  hasInteractedWithFilters.value = true // Mark as interacted
  const shuffled = [...recommendedPosts.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  shuffledPosts.value = shuffled
}

// Initialize shuffled posts (empty array initially)
watch(recommendedPosts, (newPosts) => {
  shuffledPosts.value = [...newPosts]
}, { immediate: true })

// Computed properties for main content filtering (keeping existing logic)
const filteredPosts = computed(() => {
  // Show all posts in main content (filters only affect recommended section)
  return posts.value
})

// Update paginatedPosts to use filteredPosts
const paginatedPosts = computed(() => {
  // Exclude featured post and get posts for current page from filtered results
  const nonFeaturedPosts = filteredPosts.value.filter((_, index) => index !== 0)
  const startIndex = (currentPage.value - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  return nonFeaturedPosts.slice(startIndex, endIndex)
})

// Update totalPages to use filteredPosts
const totalPages = computed(() => {
  // Exclude featured post from pagination
  const nonFeaturedPosts = filteredPosts.value.filter((_, index) => index !== 0)
  return Math.ceil(nonFeaturedPosts.length / postsPerPage)
})

const goToPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const setTagFilter = (tag: string) => {
  hasInteractedWithFilters.value = true // Mark as interacted
  activeTagFilter.value = tag
  // Reshuffle when filter changes
  shuffleRecommended()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Computed property for stats (super precise like Daniel's)
const stats = computed(() => {
  if (posts.value.length === 0) return { yearsActive: '0' }

  const dates = posts.value
    .map(post => new Date(post.created_at))
    .filter(date => !isNaN(date.getTime()))

  if (dates.length === 0) return { yearsActive: '0' }

  const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())))
  const newestDate = new Date(Math.max(...dates.map(d => d.getTime())))

  const yearsDiff = newestDate.getFullYear() - oldestDate.getFullYear()
  const monthsDiff = newestDate.getMonth() - oldestDate.getMonth()
  const totalMonths = yearsDiff * 12 + monthsDiff

  return {
    yearsActive: (totalMonths / 12).toFixed(10) // Super precise like Daniel
  }
})

// Tag counts for filters
const tagCounts = computed(() => {
  const counts = {
    must: posts.value.filter(p => p.tags.some(t => t.toLowerCase() === 'must')).length,
    recommended: posts.value.filter(p => p.tags.some(t => t.toLowerCase() === 'recommended')).length,
    top: posts.value.filter(p => p.tags.some(t => t.toLowerCase() === 'top')).length
  }
  return counts
})
</script>

<template>
  <div class="blog-home">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Loading posts...
    </div>

    <!-- Content Statistics -->
    <ContentStats v-if="!loading" />

    <!-- Content Curation Filters -->
    <section v-if="!loading && curatedPosts.length > 0" class="curation-filters">
      <h2 class="section-header">
        Top/Recommended Content <span class="content-age">(across {{ stats.yearsActive }} years)</span>
        <a href="/archives/" class="search-button-inline" title="Search all posts">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </a>
        <button class="shuffle-button-inline" title="Show different posts" @click="shuffleRecommended">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
        </button>
      </h2>
      <div class="tag-filters">
        <button
          v-if="tagCounts.must > 0"
          class="tag-filter"
          :class="{ active: activeTagFilter === 'must' }"
          @click="setTagFilter('must')"
        >
          <span class="tag-name">must</span>
          <span class="tag-count">({{ tagCounts.must }})</span>
        </button>
        <button
          v-if="tagCounts.recommended > 0"
          class="tag-filter"
          :class="{ active: activeTagFilter === 'recommended' }"
          @click="setTagFilter('recommended')"
        >
          <span class="tag-name">recommended</span>
          <span class="tag-count">({{ tagCounts.recommended }})</span>
        </button>
        <button
          v-if="tagCounts.top > 0"
          class="tag-filter"
          :class="{ active: activeTagFilter === 'top' }"
          @click="setTagFilter('top')"
        >
          <span class="tag-name">top</span>
          <span class="tag-count">({{ tagCounts.top }})</span>
        </button>
      </div>
    </section>

    <!-- Recommended Grid -->
    <section v-if="!loading && shuffledPosts.length > 0" class="recommended-grid-section">
      <div class="recommended-grid">
        <a
          v-for="post in shuffledPosts"
          :key="post.slug"
          :href="`/blog/${post.slug}`"
          class="grid-card"
        >
          <div v-if="post.image" class="grid-image">
            <img :src="post.image" :alt="post.title" loading="lazy" />
          </div>
          <div class="grid-content">
            <h3 class="grid-title">{{ post.title }}</h3>
            <time class="grid-date">{{ formatDate(post.created_at) }}</time>
            <p v-if="post.subtitle" class="grid-subtitle">{{ post.subtitle }}</p>
            <div v-if="post.tags && post.tags.length" class="grid-tags">
              <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">#{{ tag }}</span>
            </div>
          </div>
        </a>
      </div>
    </section>

    <!-- Empty Grid Placeholder (Daniel's site shows empty grid initially) -->
    <section v-if="!loading && shuffledPosts.length === 0" class="recommended-grid-section">
      <div class="recommended-grid"></div>
    </section>

    <!-- Featured Blog -->
    <section v-if="featuredPost && !loading" class="featured-section">
      <h2 class="section-title-featured">Featured Blog</h2>
      <a :href="`/blog/${featuredPost.slug}`" class="featured-card">
        <div class="featured-image-wrapper">
          <img
            v-if="featuredPost.image"
            :src="featuredPost.image"
            :alt="featuredPost.title"
            class="featured-image"
          />
          <div class="featured-overlay"></div>
        </div>
        <div class="featured-content">
          <div class="featured-content-left">
            <h2 class="featured-title">{{ featuredPost.title }}</h2>
            <p v-if="featuredPost.subtitle" class="featured-subtitle">{{ featuredPost.subtitle }}</p>
          </div>
          <div class="featured-content-right">
            <div class="featured-date">{{ formatDate(featuredPost.created_at) }}</div>
            <div v-if="featuredPost.tags && featuredPost.tags.length" class="featured-tags">
              <span v-for="tag in featuredPost.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </a>
    </section>

    <!-- Latest Content -->
    <section v-if="posts.length > 1 && !loading" class="latest-section">
      <h2 class="section-title">Latest Content</h2>

      <div class="posts-container">
        <a
          v-for="(post, index) in paginatedPosts"
          :key="post.slug"
          :href="`/blog/${post.slug}`"
          class="post-link-wrapper"
        >
          <article class="post-layout" :class="{ alternate: index % 2 === 1 }">
            <div class="post-container">
              <div v-if="post.image" class="post-thumbnail">
                <img :src="post.image" :alt="post.title" loading="lazy" />
              </div>
              <div class="post-content">
                <div class="post-main">
                  <h2 class="post-title">{{ post.title }}</h2>
                  <time class="post-date" :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
                </div>
                <p v-if="post.subtitle" class="post-subtitle">{{ post.subtitle }}</p>
                <div v-if="post.tags && post.tags.length" class="post-tags">
                  <span v-for="tag in post.tags" :key="tag" class="post-tag">#{{ tag }}</span>
                </div>
              </div>
            </div>
          </article>
        </a>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          ← Previous
        </button>

        <div class="pagination-pages">
          <button
            v-for="page in totalPages"
            :key="page"
            class="pagination-page"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next →
        </button>
      </div>
    </section>

    <!-- Share and Follow Buttons -->
    <section v-if="!loading" class="share-follow-section">
      <div class="share-follow-container">
        <ShareButtons url="https://kingsleyobi.com/blog/" title="Blog" />
        <FollowButtons url="https://kingsleyobi.com/blog/" title="Blog" />
      </div>
    </section>

    <!-- Support Section -->
    <SupportSection v-if="!loading" />
  </div>
</template>

<style scoped>
/* Daniel Miessler Layout Structure - Full Width, Minimal Padding */

.blog-home {
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

/* Content Curation Filters */
.curation-filters {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 32px;
  padding: 0 20px;
}

.section-header {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.content-age {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.search-button-inline,
.shuffle-button-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s ease;
  text-decoration: none;
}

.search-button-inline:hover,
.shuffle-button-inline:hover {
  color: var(--vp-c-brand-1);
}

.search-button-inline svg,
.shuffle-button-inline svg {
  width: 12px;
  height: 12px;
}

.tag-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  padding: 16px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}

.tag-filter {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-transform: lowercase;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-filter:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.tag-filter.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.tag-name {
  font-weight: 500;
}

.tag-count {
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 400;
}

/* Featured Section - Full Width, Large Hero Image */
.featured-section {
  width: 100%;
  margin-bottom: 32px;
}

.section-title-featured {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
  padding: 0 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.featured-card {
  display: block;
  text-decoration: none;
  color: inherit;
  width: 100%;
  position: relative;
}

.featured-image-wrapper {
  width: 100%;
  height: 500px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  position: relative;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.featured-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
  pointer-events: none;
}

.featured-content {
  padding: 24px 32px 32px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.featured-content-left {
  flex: 1;
  min-width: 0;
}

.featured-content-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.featured-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.featured-subtitle {
  font-size: 1.0625rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.featured-date {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.featured-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.featured-tags .tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* Latest Section - Full Width Container */
.latest-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
}

/* Posts Container - Alternating Layout (Daniel's structure) */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-link-wrapper {
  display: block;
  text-decoration: none;
  color: inherit;
}

.post-layout {
  display: flex;
  width: 100%;
}

.post-layout.alternate {
  flex-direction: row-reverse;
}

.post-container {
  display: flex;
  width: 100%;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  min-height: 200px;
}

.post-link-wrapper:hover .post-container {
  box-shadow: 0 4px 12px color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
}

/* Image takes 40% width */
.post-thumbnail {
  flex: 0 0 40%;
  max-width: 480px;
  overflow: hidden;
  background: var(--vp-c-divider);
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.post-content {
  flex: 1;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.post-main {
  margin-bottom: 12px;
}

.post-title {
  font-size: 1.3125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.post-date {
  font-size: 0.8125rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.post-subtitle {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin-bottom: 12px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.pagination-btn {
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 6px;
  align-items: center;
}

.pagination-page {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-page:hover {
  border-color: var(--vp-c-brand-1);
}

.pagination-page.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

/* Desktop - 1280px and up */
@media (min-width: 1280px) {
  .featured-image-wrapper {
    height: 550px;
  }

  .featured-content {
    padding: 32px 20px 40px;
  }

  .featured-title {
    font-size: 2.125rem;
  }

  .post-thumbnail {
    flex: 0 0 45%;
    max-width: 540px;
  }

  .post-content {
    padding: 32px 40px;
  }

  .post-title {
    font-size: 1.5rem;
  }

  .recommended-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .grid-image {
    height: 200px;
  }
}

/* Tablet - 768px to 1279px */
@media (min-width: 768px) and (max-width: 1279px) {
  .featured-image-wrapper {
    height: 450px;
  }

  .post-thumbnail {
    flex: 0 0 38%;
  }

  .post-content {
    padding: 20px 28px;
  }

  .recommended-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .featured-content {
    flex-direction: column;
  }

  .featured-content-right {
    align-items: flex-start;
  }

  .featured-tags {
    justify-content: flex-start;
  }
}

/* Mobile - up to 767px */
@media (max-width: 767px) {
  .blog-home {
    padding: 0;
  }

  .section-header {
    font-size: 1rem;
    flex-direction: column;
    gap: 8px;
  }

  .featured-image-wrapper {
    height: 280px;
  }

  .featured-content {
    padding: 20px 20px 24px;
    flex-direction: column;
  }

  .featured-content-right {
    align-items: flex-start;
  }

  .featured-tags {
    justify-content: flex-start;
  }

  .featured-title {
    font-size: 1.5rem;
  }

  .featured-subtitle {
    font-size: 1rem;
  }

  .latest-section {
    padding: 0 16px 40px;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .section-title-featured {
    font-size: 1.25rem;
    padding: 0 16px;
  }

  /* Stack vertically on mobile */
  .post-layout {
    flex-direction: column !important;
  }

  .post-thumbnail {
    flex: none;
    width: 100%;
    max-width: 100%;
    height: 200px;
  }

  .post-layout.alternate .post-thumbnail {
    order: 0;
  }

  .post-content {
    padding: 20px;
  }

  .post-title {
    font-size: 1.1875rem;
  }

  .post-subtitle {
    font-size: 0.875rem;
  }

  .pagination {
    flex-direction: column;
    gap: 16px;
  }

  .pagination-pages {
    flex-wrap: wrap;
    justify-content: center;
  }

  .recommended-grid-section {
    padding: 0 16px;
  }

  .recommended-grid {
    grid-template-columns: 1fr;
  }

  .tag-filters {
    padding: 12px;
  }
}

/* Small Mobile - up to 480px */
@media (max-width: 480px) {
  .featured-image-wrapper {
    height: 220px;
  }

  .featured-content {
    padding: 16px 16px 20px;
  }

  .latest-section {
    padding: 0 12px 32px;
  }

  .section-title-featured {
    padding: 0 12px;
  }

  .post-thumbnail {
    height: 180px;
  }

  .post-content {
    padding: 16px;
  }

  .post-title {
    font-size: 1.125rem;
  }

  .pagination {
    padding-top: 20px;
  }

  .recommended-grid-section {
    padding: 0 12px;
  }

  .grid-content {
    padding: 12px;
  }

  .grid-image {
    height: 160px;
  }
}

/* Share and Follow Section */
.share-follow-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.share-follow-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 768px) {
  .share-follow-section {
    padding: 0 16px 40px;
  }
}

@media (max-width: 480px) {
  .share-follow-section {
    padding: 0 12px 32px;
  }
}
</style>
