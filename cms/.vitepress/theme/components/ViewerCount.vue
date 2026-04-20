<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  tags?: string[]
  createdDate?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  createdDate: null
})

// Reading time - calculated once on mount
const readingTime = ref<string | null>(null)

onMounted(() => {
  // Calculate reading time (rough estimate: 200 words per minute)
  const content = document.querySelector('.vp-doc')
  if (!content) return

  const text = content.innerText || ''
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  readingTime.value = `${minutes} min read`
})

// Simulate view count (in real implementation, this would come from analytics)
const viewCount = computed(() => {
  // Generate a consistent pseudo-random view count based on the URL
  const url = window.location.pathname
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash % 1000) + 100 // Between 100 and 1100 views
})
</script>

<template>
  <div class="viewer-count">
    <h4 class="stats-title">Post Stats</h4>

    <div class="stat-item">
      <span class="stat-label">Views:</span>
      <span class="stat-value">{{ viewCount.toLocaleString() }}</span>
    </div>

    <div v-if="readingTime" class="stat-item">
      <span class="stat-label">Reading time:</span>
      <span class="stat-value">{{ readingTime }}</span>
    </div>

    <div v-if="createdDate" class="stat-item">
      <span class="stat-label">Published:</span>
      <span class="stat-value">{{ createdDate }}</span>
    </div>

    <div v-if="tags && tags.length" class="stat-item">
      <span class="stat-label">Tags:</span>
      <span class="stat-value">{{ tags.length }}</span>
    </div>
  </div>
</template>

<style scoped>
.viewer-count {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 16px;
}

.stats-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .viewer-count {
    padding: 12px;
  }

  .stats-title {
    font-size: 13px;
  }

  .stat-item {
    padding: 6px 0;
  }

  .stat-label,
  .stat-value {
    font-size: 12px;
  }
}
</style>