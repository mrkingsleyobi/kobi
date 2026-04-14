<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

// Get post count and stats from parent or use defaults
const props = defineProps<{
  postCount?: number
  yearsActive?: string
  tagCount?: number
}>()

const defaultPostCount = props.postCount || 10
const defaultYearsActive = props.yearsActive || '2.25'
const defaultTagCount = props.tagCount || 20

const placeholderText = computed(() =>
  `Search all ${defaultPostCount} posts across ${defaultYearsActive} years and ${defaultTagCount} tags...`
)

const performSearch = () => {
  if (searchQuery.value.trim()) {
    // Redirect to archives page with search query
    window.location.href = `/archives/?search=${encodeURIComponent(searchQuery.value)}`
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    performSearch()
  }
}
</script>

<template>
  <section class="search-section">
    <div class="search-wrapper">
      <span class="section-label">Search</span>
      <div class="search-container">
        <span class="search-icon vp-icon">🔍</span>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="placeholderText"
          @keypress="handleKeyPress"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.search-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.search-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 3px rgba(var(--vp-c-brand-rgb), 0.1);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .search-section {
    padding: 24px 16px;
  }

  .search-input {
    padding: 14px 14px 14px 44px;
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 20px 12px;
  }

  .search-input {
    padding: 12px 12px 12px 40px;
    font-size: 0.75rem;
  }

  .search-icon {
    left: 12px;
    font-size: 1.125rem;
  }
}
</style>