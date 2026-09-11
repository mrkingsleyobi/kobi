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
  font-style: italic;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}
</style>
