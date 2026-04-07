<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import type { Frontmatter, BlogPost } from '../types'

const { frontmatter } = useData<Frontmatter>()

const blogPosts = computed<BlogPost[]>(() => {
  const posts = frontmatter.value.posts || []
  return posts.map(post => ({
    ...post,
    processedTags: Array.isArray(post.tags) ? post.tags : []
  }))
})
</script>

<template>
  <div class="daniel-blog-list">
    <h1>{{ frontmatter.title || 'Blog' }}</h1>
    <p v-if="frontmatter.subtitle" class="tagline">{{ frontmatter.subtitle }}</p>

    <div
      v-for="post in blogPosts"
      :key="post.slug"
      class="daniel-blog-post"
    >
      <h2 class="daniel-blog-post-title">
        <a :href="`/blog/${post.slug}`">{{ post.title }}</a>
      </h2>
      <div class="daniel-blog-post-meta">
        <time v-if="post.date">{{ post.date }}</time>
        <span v-if="post.processedTags && post.processedTags.length">
          · {{ post.processedTags.join(', ') }}
        </span>
      </div>
      <p v-if="post.excerpt" class="daniel-blog-post-excerpt">{{ post.excerpt }}</p>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.tagline {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}
</style>
