<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { BlogPostData } from '../types'
import ShareButtons from './ShareButtons.vue'
import FollowButtons from './FollowButtons.vue'

const posts = ref<BlogPostData[]>([])
const featuredPost = ref<BlogPostData | null>(null)
const loading = ref(true)
const currentPage = ref(1)
const postsPerPage = 6

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
          description: frontmatter.description || excerpt
        })
      }
    }

    // Sort by date (newest first)
    postData.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    posts.value = postData

    // Set first post as featured
    if (postData.length > 0) {
      featuredPost.value = postData[0]
    }
  } catch (error) {
    console.error('Error loading blog posts:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Computed properties for pagination
const totalPages = computed(() => {
  // Exclude featured post from pagination
  const nonFeaturedPosts = posts.value.filter((_, index) => index !== 0)
  return Math.ceil(nonFeaturedPosts.length / postsPerPage)
})

const paginatedPosts = computed(() => {
  // Exclude featured post and get posts for current page
  const nonFeaturedPosts = posts.value.filter((_, index) => index !== 0)
  const startIndex = (currentPage.value - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  return nonFeaturedPosts.slice(startIndex, endIndex)
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
</script>

<template>
  <div class="blog-home">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Loading posts...
    </div>

    <!-- Featured Post -->
    <section v-if="featuredPost && !loading" class="featured-section">
      <a :href="`/blog/${featuredPost.slug}`" class="featured-card">
        <div class="featured-image-wrapper">
          <img
            v-if="featuredPost.image"
            :src="featuredPost.image"
            :alt="featuredPost.title"
            class="featured-image"
          />
        </div>
        <div class="featured-content">
          <h2 class="featured-title">{{ featuredPost.title }}</h2>
          <p v-if="featuredPost.subtitle" class="featured-subtitle">{{ featuredPost.subtitle }}</p>
          <div class="featured-meta">
            <time class="featured-date">{{ formatDate(featuredPost.created_at) }}</time>
            <div v-if="featuredPost.tags && featuredPost.tags.length" class="featured-tags">
              <span v-for="tag in featuredPost.tags" :key="tag" class="tag">{{ tag }}</span>
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
          class="post-card"
          :class="{ alternate: index % 2 === 1 }"
        >
          <div v-if="post.image" class="post-image">
            <img :src="post.image" :alt="post.title" loading="lazy" />
          </div>
          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <time class="post-date">{{ formatDate(post.created_at) }}</time>
            <p v-if="post.subtitle" class="post-subtitle">{{ post.subtitle }}</p>
            <div v-if="post.tags && post.tags.length" class="post-tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
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

/* Featured Section - Full Width, Large Hero Image */
.featured-section {
  width: 100%;
  margin-bottom: 32px;
}

.featured-card {
  display: block;
  text-decoration: none;
  color: inherit;
  width: 100%;
}

.featured-image-wrapper {
  width: 100%;
  height: 500px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.featured-content {
  padding: 24px 32px 32px;
  max-width: 1200px;
  margin: 0 auto;
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
  margin-bottom: 16px;
  line-height: 1.5;
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.featured-date {
  font-size: 0.875rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.featured-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

/* Posts Container - Alternating Layout */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-card {
  display: flex;
  text-decoration: none;
  color: inherit;
  width: 100%;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  min-height: 200px;
}

.post-card:hover {
  box-shadow: 0 4px 12px color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
}

/* Image takes 40% width */
.post-card .post-image {
  flex: 0 0 40%;
  max-width: 480px;
  overflow: hidden;
  background: var(--vp-c-divider);
}

.post-card .post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Alternate direction */
.post-card.alternate {
  flex-direction: row-reverse;
}

.post-card.alternate .post-image {
  order: 2;
}

.post-content {
  flex: 1;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
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
  margin-bottom: 12px;
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

.tag {
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

  .post-card .post-image {
    flex: 0 0 45%;
    max-width: 540px;
  }

  .post-content {
    padding: 32px 40px;
  }

  .post-title {
    font-size: 1.5rem;
  }
}

/* Tablet - 768px to 1279px */
@media (min-width: 768px) and (max-width: 1279px) {
  .featured-image-wrapper {
    height: 450px;
  }

  .post-card .post-image {
    flex: 0 0 38%;
  }

  .post-content {
    padding: 20px 28px;
  }
}

/* Mobile - up to 767px */
@media (max-width: 767px) {
  .blog-home {
    padding: 0;
  }

  .featured-image-wrapper {
    height: 280px;
  }

  .featured-content {
    padding: 20px 20px 24px;
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

  /* Stack vertically on mobile */
  .post-card {
    flex-direction: column !important;
  }

  .post-card .post-image {
    flex: none;
    width: 100%;
    max-width: 100%;
    height: 200px;
  }

  .post-card.alternate .post-image {
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

  .post-card .post-image {
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
