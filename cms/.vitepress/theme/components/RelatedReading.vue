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
  <div v-if="related.length" class="related-reading-card">
    <div class="related-reading-heading">Related Reading</div>
    <div class="related-reading-list">
      <a
        v-for="post in related"
        :key="post.slug"
        class="related-reading-row"
        :href="`/blog/${post.slug}`"
      >
        <span class="related-reading-title">{{ post.title }}</span>
        <span class="related-reading-arrow" aria-hidden="true">&rarr;</span>
      </a>
    </div>
  </div>
</template>
