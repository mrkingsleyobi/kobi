<script setup lang="ts">
import Term from './Term.vue'
import DescriptionText from './DescriptionText.vue'
import Usage from './Usage.vue'
import Cite from './Cite.vue'

defineProps<{
  // No props - uses child components
}>()
</script>

<template>
  <div class="definition">
    <slot />
  </div>
</template>

<style scoped>
.definition {
  position: relative;
  display: block;
  font-family: 'concourse-t3', -apple-system, sans-serif;
  font-size: 95%;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background-color: var(--bg-soft);
  border-radius: 6px;
  border: 1px solid var(--border);
  color: var(--text-1);
}
</style>
