<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface BlogPostData {
  slug: string
  title: string
  subtitle?: string
  created_at: string
  tags: string[]
  image?: string
}

const posts = ref<BlogPostData[]>([])
const loading = ref(true)
const selectedYear = ref<string | null>(null)
const selectedTag = ref<string | null>(null)

onMounted(async () => {
  console.log('ArchivesList mounted')
  await loadPosts()
  console.log('Posts loaded:', posts.value.length)
  console.log('Available years:', availableYears.value)
  console.log('All tags:', allTags.value)
})

const loadPosts = async () => {
  try {
    console.log('Starting to load posts...')
    const blogModules = import.meta.glob('/blog/*.md', { query: '?raw', import: 'default' })
    console.log('Found blog modules:', Object.keys(blogModules).length)
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
    console.log('Successfully loaded posts:', posts.value.length)
  } catch (error) {
    console.error('Error loading posts:', error)
  } finally {
    loading.value = false
    console.log('Loading complete, loading.value:', loading.value)
  }
}

const availableYears = computed(() => {
  const years = new Set(posts.value.map(post =>
    new Date(post.created_at).getFullYear().toString()
  ))
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
})

const yearCounts = computed(() => {
  const counts: Record<string, number> = {}
  posts.value.forEach(post => {
    const year = new Date(post.created_at).getFullYear().toString()
    counts[year] = (counts[year] || 0) + 1
  })
  return counts
})

const allTags = computed(() => {
  const tagSet = new Set<string>()
  posts.value.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
})

const tagCounts = computed(() => {
  const counts: Record<string, number> = {}
  posts.value.forEach(post => {
    post.tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  return counts
})

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    if (selectedYear.value) {
      const postYear = new Date(post.created_at).getFullYear().toString()
      if (postYear !== selectedYear.value) return false
    }
    if (selectedTag.value) {
      if (!post.tags.includes(selectedTag.value)) return false
    }
    return true
  })
})

const selectYear = (year: string) => {
  selectedYear.value = year
  selectedTag.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const selectTag = (tag: string) => {
  selectedTag.value = tag
  selectedYear.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  selectedYear.value = null
  selectedTag.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="archives-list">
    <div v-if="loading" class="loading">
      Loading posts...
    </div>

    <div v-else>
      <div v-if="!selectedYear && !selectedTag">
        <h1>Search the Archives</h1>
        <p class="intro-text">
          Explore {{ posts.length }} posts on multiple topics
        </p>

        <!-- Years Section -->
        <div class="filters-section">
          <h2>Years</h2>
          <div class="inline-filters">
            <a
              v-for="year in availableYears"
              :key="year"
              @click="selectYear(year)"
              class="filter-link">
              {{ year }} ({{ yearCounts[year] }})
            </a>
          </div>
        </div>

        <!-- Tags Section -->
        <div class="filters-section">
          <h2>Tags</h2>
          <div class="inline-filters">
            <a
              v-for="tag in allTags"
              :key="tag"
              @click="selectTag(tag)"
              class="filter-link">
              {{ tag }} ({{ tagCounts[tag] || 0 }})
            </a>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="selectedYear || selectedTag" class="results-section">
        <div class="posts-list">
          <article v-for="post in filteredPosts" :key="post.slug" class="post-item">
            <a :href="`/blog/${post.slug}`" class="post-link">
              <h3 class="post-title">{{ post.title }}</h3>
              <p v-if="post.subtitle" class="post-subtitle">{{ post.subtitle }}</p>
              <time class="post-date">{{ formatDate(post.created_at) }}</time>
              <div v-if="post.tags.length" class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="post-tag">#{{ tag }}</span>
              </div>
            </a>
          </article>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <a @click="clearFilters" class="pagination-link">← Back to filters</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archives-list {
  width: 100%;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.intro-text {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 32px;
  line-height: 1.5;
}

/* Filters Section */
.filters-section {
  margin-bottom: 32px;
}

.filters-section h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.inline-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  line-height: 1.8;
}

.filter-link {
  display: inline;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  cursor: pointer;
  margin-right: 4px;
}

.filter-link:hover {
  text-decoration: underline;
}

/* Results Section */
.results-section {
  margin-top: 32px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: var(--vp-c-text-2);
  font-size: 1rem;
}

/* Posts List */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.post-item {
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 24px;
}

.post-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.post-subtitle {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.post-date {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  font-weight: 400;
  margin-bottom: 8px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-tag {
  font-size: 0.75rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  padding: 32px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.pagination-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.pagination-link:hover {
  text-decoration: underline;
}
</style>
