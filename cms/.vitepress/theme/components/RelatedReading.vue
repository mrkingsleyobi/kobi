<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import { loadAllPosts } from '../utils/posts'
import { parseTags } from '../utils/format'
import type { BlogPostData, Frontmatter } from '../types'

const { frontmatter, page } = useData<Frontmatter>()

const related = ref<BlogPostData[]>([])

onMounted(async () => {
  try {
    const posts = await loadAllPosts()
    const currentSlug = page.value.relativePath.replace(/^blog\//, '').replace(/\.md$/, '')
    const currentTags = parseTags(frontmatter.value.tags).map((t) => t.toLowerCase())

    const others = posts.filter((p) => p.slug !== currentSlug)

    const scored = others
      .map((p) => {
        const overlap = p.tags.filter((t) => currentTags.includes(t.toLowerCase())).length
        return { post: p, overlap }
      })
      .sort((a, b) => {
        if (b.overlap !== a.overlap) return b.overlap - a.overlap
        return new Date(b.post.created_at || 0).getTime() - new Date(a.post.created_at || 0).getTime()
      })

    related.value = scored.slice(0, 5).map((s) => s.post)
  } catch (error) {
    console.error('RelatedReading: failed to load posts', error)
  }
})
</script>

<template>
  <div v-if="related.length" class="related-reading">
    <h2 class="related-reading-heading">Related Reading</h2>
    <ul class="related-reading-list">
      <li v-for="post in related" :key="post.slug" class="related-reading-item">
        <a :href="`/blog/${post.slug}`" class="related-reading-link">
          <span class="related-reading-title">{{ post.title }}</span>
          <span class="related-reading-arrow" aria-hidden="true">&rarr;</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.related-reading {
  margin: 3rem 0 2rem;
  padding: 1.75rem 2rem;
  background: var(--custom-c-bg-soft);
  border-radius: 12px;
}

.related-reading-heading {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem;
  border: none;
  padding: 0;
}

.related-reading-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.related-reading-item {
  border-bottom: 1px solid var(--custom-c-border);
}

.related-reading-item:last-child {
  border-bottom: none;
}

.related-reading-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 1rem;
}

.related-reading-link:hover .related-reading-title {
  color: var(--vp-c-brand-1);
}

.related-reading-link:hover .related-reading-arrow {
  transform: translateX(4px);
}

.related-reading-title {
  transition: color 0.2s ease;
}

.related-reading-arrow {
  flex-shrink: 0;
  color: var(--vp-c-brand-1);
  transition: transform 0.2s ease;
}

@media (max-width: 520px) {
  .related-reading {
    padding: 1.25rem 1.25rem;
    margin: 2rem 0 1.5rem;
  }

  .related-reading-link {
    font-size: 0.9rem;
  }
}
</style>
