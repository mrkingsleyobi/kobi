<script setup lang="ts">
defineProps<{
  // No props needed - just renders slot content
}>()
</script>

<template>
  <div class="definition-cite">
    <slot />
  </div>
</template>

<style scoped>
.definition-cite {
  display: block;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  text-align: right;
  font-style: italic;
}
</style>
