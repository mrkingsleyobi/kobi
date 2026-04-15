<script setup lang="ts">
import { ref, computed } from 'vue'

interface TagFilter {
  name: string
  count: number
  active: boolean
}

const filters = ref<TagFilter[]>([
  { name: 'must', count: 1, active: true },
  { name: 'recommended', count: 4, active: false },
  { name: 'top', count: 3, active: false }
])

const emit = defineEmits<{
  (e: 'filter-change', activeFilters: string[]): void
}>()

const toggleFilter = (filterName: string) => {
  const filter = filters.value.find(f => f.name === filterName)
  if (filter) {
    filter.active = !filter.active
    updateActiveFilters()
  }
}

const updateActiveFilters = () => {
  const activeFilters = filters.value
    .filter(f => f.active)
    .map(f => f.name)
  emit('filter-change', activeFilters)
}

// Expose active filters
const activeFilters = computed(() => {
  return filters.value.filter(f => f.active).map(f => f.name)
})

defineExpose({
  activeFilters
})
</script>

<template>
  <div class="tag-filters">
    <button
      v-for="filter in filters"
      :key="filter.name"
      :class="['tag-filter', { active: filter.active }]"
      @click="toggleFilter(filter.name)"
    >
      <span class="tag-name">{{ filter.name }}</span>
      <span class="tag-count">({{ filter.count }})</span>
    </button>
  </div>
</template>

<style scoped>
.tag-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.tag-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.tag-filter:hover {
  background: var(--vp-c-bg-soft-hover);
  border-color: var(--vp-c-brand-1);
}

.tag-filter.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.tag-name {
  font-weight: 500;
}

.tag-count {
  font-size: 12px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .tag-filters {
    gap: 8px;
  }

  .tag-filter {
    padding: 6px 12px;
    font-size: 13px;
  }

  .tag-count {
    font-size: 11px;
  }
}
</style>