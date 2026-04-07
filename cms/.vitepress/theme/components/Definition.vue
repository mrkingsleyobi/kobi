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
  display: block;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}
</style>
