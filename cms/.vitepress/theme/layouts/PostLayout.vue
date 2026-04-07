<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import type { Frontmatter } from '../types'
import { formatDate, parseTags } from '../utils/format'

const { page, frontmatter } = useData<Frontmatter>()

const tags = computed(() => parseTags(frontmatter.value.tags))

const createdDate = computed(() =>
  frontmatter.value.created_at
    ? formatDate(frontmatter.value.created_at)
    : null
)

const updatedDate = computed(() =>
  frontmatter.value.updated_at && frontmatter.value.updated_at !== frontmatter.value.created_at
    ? formatDate(frontmatter.value.updated_at)
    : null
)
</script>

<template>
  <article class="daniel-post">
    <header class="daniel-post-header">
      <h1 class="daniel-post-title">{{ frontmatter.title }}</h1>
      <div class="daniel-post-meta">
        <time v-if="createdDate">{{ createdDate }}</time>
        <span v-if="updatedDate"> · Updated {{ updatedDate }}</span>
        <span v-if="tags && tags.length"> · {{ tags.join(', ') }}</span>
      </div>
    </header>

    <div class="daniel-post-content">
      <Content />
    </div>

    <nav class="daniel-post-nav">
      <a v-if="page.frontmatter.prev" :href="page.frontmatter.prev">← Previous</a>
      <span></span>
      <a v-if="page.frontmatter.next" :href="page.frontmatter.next">Next →</a>
    </nav>
  </article>
</template>

<style scoped>
.daniel-post-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.daniel-post-nav a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.daniel-post-nav a:hover {
  color: var(--vp-c-brand-1);
}
</style>
