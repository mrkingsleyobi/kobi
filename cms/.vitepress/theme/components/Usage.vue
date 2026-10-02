<script setup lang="ts">
defineProps<{
  // No props needed - just renders slot content
}>()
</script>

<template>
  <div class="usage">
    <slot />
  </div>
</template>

<style scoped>
.usage {
  display: block;
  font-family: 'equity-text-b', Georgia, serif;
  font-style: italic;
  margin-bottom: 0.75rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border);
  color: var(--text-2);
}
</style>
