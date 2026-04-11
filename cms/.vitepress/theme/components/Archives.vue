<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vitepress'

interface BlogPostData {
  slug: string
  title: string
  subtitle?: string
  created_at: string
  tags: string[]
  image?: string
}

interface FilterState {
  search: string
  years: string[]
  tags: string[]
}

const router = useRouter()
const route = useRoute()

const posts = ref<BlogPostData[]>([])
const loading = ref(true)
const filters = ref<FilterState>({
  search: '',
  years: [],
  tags: []
})
const currentPage = ref(1)
const postsPerPage = 8

// Official blog tags from CLAUDE.md
const officialTags = [
  'top', 'future', 'politics', 'cybersecurity', 'reading', 'society',
  'science', 'philosophy', 'nationalsecurity', 'ai', 'culture', 'personal',
  'innovation', 'business', 'meaning', 'technology', 'ethics', 'productivity',
  'writing', 'creativity', 'tutorial', 'apple', 'recommended'
]

onMounted(async () => {
  await loadPosts()
  loadFiltersFromURL()
})

const loadPosts = async () => {
  try {
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

        const slug = path.split('/').pop()?.replace('.md', '') || ''
        if (slug === 'index') continue

        const imageMatch = content.match(/!\[.*?\]\((\/images\/.+?\.(jpg|png|jpeg|gif|webp))\)/)
        const image = imageMatch ? imageMatch[1] : null

        postData.push({
          slug,
          title: frontmatter.title || 'Untitled',
          subtitle: frontmatter.subtitle || '',
          created_at: frontmatter.created_at || '',
          tags: frontmatter.tags ? frontmatter.tags.split('|').map((t: string) => t.trim()) : [],
          image
        })
      }
    }

    postData.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    posts.value = postData
  } catch (error) {
    console.error('Error loading posts:', error)
  } finally {
    loading.value = false
  }
}

// Extract all years from posts
const availableYears = computed(() => {
  const years = new Set(posts.value.map(post =>
    new Date(post.created_at).getFullYear().toString()
  ))
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
})

// Count posts per year
const yearCounts = computed(() => {
  const counts: Record<string, number> = {}
  posts.value.forEach(post => {
    const year = new Date(post.created_at).getFullYear().toString()
    counts[year] = (counts[year] || 0) + 1
  })
  return counts
})

// Count posts per tag
const tagCounts = computed(() => {
  const counts: Record<string, number> = {}
  posts.value.forEach(post => {
    post.tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  return counts
})

// Filter posts based on current filters
const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    // Search filter
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      const matchesSearch =
        post.title.toLowerCase().includes(searchLower) ||
        post.subtitle.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      if (!matchesSearch) return false
    }

    // Year filter
    if (filters.value.years.length > 0) {
      const postYear = new Date(post.created_at).getFullYear().toString()
      if (!filters.value.years.includes(postYear)) return false
    }

    // Tag filter
    if (filters.value.tags.length > 0) {
      if (!filters.value.tags.some(tag => post.tags.includes(tag))) return false
    }

    return true
  })
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  return filteredPosts.value.slice(startIndex, endIndex)
})

// Format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Toggle year filter
const toggleYear = (year: string) => {
  const index = filters.value.years.indexOf(year)
  if (index > -1) {
    filters.value.years.splice(index, 1)
  } else {
    filters.value.years.push(year)
  }
  currentPage.value = 1
  updateURL()
}

// Toggle tag filter
const toggleTag = (tag: string) => {
  const index = filters.value.tags.indexOf(tag)
  if (index > -1) {
    filters.value.tags.splice(index, 1)
  } else {
    filters.value.tags.push(tag)
  }
  currentPage.value = 1
  updateURL()
}

// Clear all filters
const clearFilters = () => {
  filters.value = {
    search: '',
    years: [],
    tags: []
  }
  currentPage.value = 1
  updateURL()
}

// Load filters from URL query params
const loadFiltersFromURL = () => {
  const query = route.query
  if (query.search) filters.value.search = query.search as string
  if (query.years) filters.value.years = (query.years as string).split(',')
  if (query.tags) filters.value.tags = (query.tags as string).split(',')
}

// Update URL with current filters
const updateURL = () => {
  const query: Record<string, string> = {}
  if (filters.value.search) query.search = filters.value.search
  if (filters.value.years.length > 0) query.years = filters.value.years.join(',')
  if (filters.value.tags.length > 0) query.tags = filters.value.tags.join(',')

  router.push({ path: route.path, query })
}

// Watch for URL changes
watch(() => route.query, () => {
  loadFiltersFromURL()
})

// Go to specific page
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
  <div class="archives-page">
    <!-- Search Section -->
    <div class="search-section">
      <div class="search-container">
        <input
          v-model="filters.search"
          type="text"
          class="search-input"
          placeholder="Search posts..."
        />
        <button v-if="filters.search || filters.years.length || filters.tags.length"
                @click="clearFilters"
                class="clear-filters-btn">
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Filters Container -->
    <div class="filters-container">
      <!-- Years Section -->
      <div class="years-section">
        <label>Years</label>
        <div class="year-list">
          <button
            v-for="year in availableYears"
            :key="year"
            class="year-btn"
            :class="{ active: filters.years.includes(year) }"
            @click="toggleYear(year)"
          >
            {{ year }} <span class="year-count">({{ yearCounts[year] }})</span>
          </button>
        </div>
      </div>

      <!-- Tags Section -->
      <div class="tags-section">
        <label>Tags</label>
        <div class="tag-list">
          <button
            v-for="tag in officialTags"
            :key="tag"
            class="tag"
            :class="{ active: filters.tags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            <span class="tag-name">{{ tag }}</span>
            <span class="tag-count">({{ tagCounts[tag] || 0 }})</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="results-section">
      <div class="section-label">
        {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'Post' : 'Posts' }}
        <span v-if="filters.search || filters.years.length || filters.tags.length">
          filtered from {{ posts.length }} total posts
        </span>
      </div>

      <div v-if="paginatedPosts.length === 0" class="no-results">
        <p>No posts found matching your filters.</p>
        <button @click="clearFilters" class="clear-filters-btn">Clear All Filters</button>
      </div>

      <div v-else class="posts-list">
        <article
          v-for="(post, index) in paginatedPosts"
          :key="post.slug"
          class="post-layout"
          :class="{ alternate: index % 2 === 1 }"
        >
          <a :href="`/blog/${post.slug}`" class="post-link-wrapper">
            <div class="post-container">
              <div v-if="post.image" class="post-thumbnail">
                <img :src="post.image" :alt="post.title" loading="lazy" />
              </div>
              <div class="post-content">
                <div class="post-main">
                  <h2 class="post-title">{{ post.title }}</h2>
                  <time class="post-date" :datetime="post.created_at">
                    {{ formatDate(post.created_at) }}
                  </time>
                </div>
                <p v-if="post.subtitle" class="post-subtitle">{{ post.subtitle }}</p>
                <div v-if="post.tags.length" class="post-tags">
                  <span v-for="tag in post.tags" :key="tag" class="post-tag">#{{ tag }}</span>
                </div>
              </div>
            </div>
          </a>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          ← Previous
        </button>
        <div class="page-info">
          <input
            :value="currentPage"
            type="text"
            class="page-input"
            readonly
          />
          <span class="page-separator">/</span>
          <span class="total-pages">{{ totalPages }}</span>
        </div>
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archives-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Search Section */
.search-section {
  margin-bottom: 32px;
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.clear-filters-btn {
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

.clear-filters-btn:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

/* Filters Container */
.filters-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  margin-bottom: 40px;
}

.years-section,
.tags-section {
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.year-list,
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.year-btn,
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.year-btn:hover,
.tag:hover {
  border-color: var(--vp-c-brand-1);
}

.year-btn.active,
.tag.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.year-count,
.tag-count {
  font-size: 0.75rem;
  opacity: 0.7;
}

/* Results Section */
.results-section {
  margin-top: 40px;
}

.section-label {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--vp-c-text-2);
}

.no-results p {
  font-size: 1.125rem;
  margin-bottom: 20px;
}

/* Posts List */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-layout {
  width: 100%;
}

.post-link-wrapper {
  display: block;
  text-decoration: none;
  color: inherit;
}

.post-container {
  display: flex;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  min-height: 200px;
}

.post-container:hover {
  box-shadow: 0 4px 12px color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
}

.post-layout.alternate .post-container {
  flex-direction: row-reverse;
}

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

.post-layout.alternate .post-thumbnail {
  order: 2;
}

.post-content {
  flex: 1;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.page-btn {
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

.page-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-input {
  width: 50px;
  padding: 6px 8px;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-weight: 500;
}

.page-separator {
  color: var(--vp-c-text-2);
}

.total-pages {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .archives-page {
    padding: 20px 16px;
  }

  .filters-container {
    grid-template-columns: 1fr;
  }

  .post-container {
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

  .pagination {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .archives-page {
    padding: 16px 12px;
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

  .search-container {
    flex-direction: column;
  }

  .clear-filters-btn {
    width: 100%;
  }
}
</style>
