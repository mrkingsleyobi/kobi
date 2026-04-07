<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { BlogPostData } from '../types'

const posts = ref<BlogPostData[]>([])
const featuredPost = ref<BlogPostData | null>(null)
const loading = ref(true)

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
        const imageMatch = content.match(/!\[.*?\]\((\/images\/.+?\)\s*<!--.*?-->)/)
        const image = imageMatch ? imageMatch[1] : null

        // Get excerpt (first paragraph after frontmatter)
        const excerptMatch = content.match(/^---[\s\S]*?---\n\n(.+?)(?:\n\n|\n$)/)
        const excerpt = excerptMatch ? excerptMatch[1].substring(0, 150) + '...' : ''

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
</script>

<template>
  <div class="blog-home">
    <!-- Hero Section -->
    <div class="blog-hero">
      <h1>Blog</h1>
      <p class="tagline">Thoughts on cybersecurity, AI, technology, and philosophy</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Loading posts...
    </div>

    <!-- Featured Post -->
    <section v-if="featuredPost && !loading" class="featured-post">
      <a :href="`/blog/${featuredPost.slug}`" class="featured-link">
        <div v-if="featuredPost.image" class="featured-image">
          <img :src="featuredPost.image" :alt="featuredPost.title" />
        </div>
        <div class="featured-content">
          <h2 class="featured-title">{{ featuredPost.title }}</h2>
          <p v-if="featuredPost.subtitle" class="featured-subtitle">{{ featuredPost.subtitle }}</p>
          <p class="featured-date">{{ formatDate(featuredPost.created_at) }}</p>
          <p v-if="featuredPost.excerpt" class="featured-excerpt">{{ featuredPost.excerpt }}</p>
        </div>
      </a>
    </section>

    <!-- Latest Content -->
    <section v-if="posts.length > 1 && !loading" class="latest-content">
      <h3 class="section-title">Latest Content</h3>
      <div class="posts-grid">
        <a
          v-for="post in posts.slice(1)"
          :key="post.slug"
          :href="`/blog/${post.slug}`"
          class="post-card"
        >
          <div v-if="post.image" class="post-image">
            <img :src="post.image" :alt="post.title" />
          </div>
          <div class="post-content">
            <h4 class="post-title">{{ post.title }}</h4>
            <p v-if="post.subtitle" class="post-subtitle">{{ post.subtitle }}</p>
            <p class="post-date">{{ formatDate(post.created_at) }}</p>
            <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.blog-hero {
  text-align: center;
  margin-bottom: 60px;
}

.blog-hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.blog-hero .tagline {
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

.featured-post {
  margin-bottom: 60px;
}

.featured-link {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.featured-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.featured-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 24px;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-content {
  padding: 0 20px;
}

.featured-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.featured-subtitle {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.featured-date {
  font-size: 0.875rem;
  color: var(--vp-c-brand-1);
  margin-bottom: 1rem;
  font-weight: 500;
}

.featured-excerpt {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 32px;
  color: var(--vp-c-text-1);
}

.latest-content {
  margin-top: 60px;
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-card {
  display: flex;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: var(--vp-c-bg-soft);
  align-items: center;
  gap: 20px;
  padding: 16px;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 6px;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  flex: 1;
  padding: 0;
  min-width: 0;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.post-subtitle {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.post-date {
  font-size: 0.8125rem;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.post-excerpt {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .blog-home {
    padding: 40px 20px;
  }

  .blog-hero h1 {
    font-size: 2rem;
  }

  .blog-hero .tagline {
    font-size: 1rem;
  }

  .featured-image {
    height: 250px;
  }

  .featured-title {
    font-size: 1.5rem;
  }

  .post-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-image {
    width: 100%;
    height: 150px;
  }
}
</style>
