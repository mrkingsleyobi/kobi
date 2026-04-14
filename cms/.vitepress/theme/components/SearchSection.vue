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
        <span class="search-icon vp-icon"></span>
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
    margin-bottom: 1rem
}

.search-wrapper {
    display: flex;
    align-items: center;
    gap: .5rem;
    justify-content: flex-start
}

.section-label {
    font-family: concourse-t3,-apple-system,BlinkMacSystemFont,sans-serif;
    font-size: .5rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--vp-c-text-3);
    font-weight: 400;
    opacity: .8
}

.search-container {
    position: relative;
    width: 100%;
}

.search-icon.vp-icon {
    --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' stroke-width='1.6' viewBox='0 0 20 20'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' d='m14.386 14.386 4.088 4.088-4.088-4.088A7.533 7.533 0 1 1 3.733 3.733a7.533 7.533 0 0 1 10.653 10.653z'/%3E%3C/svg%3E");
    mask: var(--icon) no-repeat;
    mask-size: 100% 100%;
    -webkit-mask: var(--icon) no-repeat;
    -webkit-mask-size: 100% 100%;
    background-color: currentColor;
    display: inline-block
}

.search-icon {
    position: absolute;
    left: .75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--vp-c-text-3);
    pointer-events: none;
    width: 14px;
    height: 14px;
}

.search-input {
    width: 100%;
    padding: .5rem .75rem .5rem 2.5rem;
    font-family: concourse-t3, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: .75rem;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
    transition: all .2s ease;
    border-radius: 3px;
    color: var(--vp-c-text-1);
    height: 36px;
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