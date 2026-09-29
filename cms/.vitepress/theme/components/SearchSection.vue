<script setup lang="ts">
import { ref, computed } from 'vue'
import { searchIcon } from '../utils/icons'

const searchQuery = ref('')

const props = defineProps<{
  postCount?: number
  yearsActive?: string
  tagCount?: number
}>()

const placeholderText = computed(() => {
  if (!props.postCount) return 'Search all posts…'
  const years = props.yearsActive ? ` across ${props.yearsActive} years` : ''
  const tags = props.tagCount ? ` and ${props.tagCount} tags` : ''
  return `Search all ${props.postCount} posts${years}${tags}…`
})

function performSearch() {
  if (searchQuery.value.trim()) {
    window.location.href = `/archives/?search=${encodeURIComponent(searchQuery.value)}`
  }
}
function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') performSearch()
}
</script>

<template>
  <div class="search-box">
    <span v-html="searchIcon" />
    <input v-model="searchQuery" type="text" :placeholder="placeholderText" @keypress="handleKeyPress" />
  </div>
</template>
