<script setup lang="ts">
import { computed } from 'vue'
import type { BlogPost } from '../types'

interface Props {
  date?: string
  tags?: string[] | string
  updatedDate?: string
}

const props = defineProps<Props>()

const parsedTags = computed(() => {
  if (!props.tags) return []
  if (Array.isArray(props.tags)) return props.tags
  return props.tags.split('|').map(t => t.trim()).filter(Boolean)
})
</script>

<template>
  <div class="post-meta">
    <time v-if="date">{{ date }}</time>
    <span v-if="updatedDate"> · Updated {{ updatedDate }}</span>
    <span v-if="parsedTags.length"> · {{ parsedTags.join(', ') }}</span>
  </div>
</template>

<style scoped>
.post-meta {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1rem;
}
</style>
