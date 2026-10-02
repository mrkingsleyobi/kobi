<script setup lang="ts">
defineProps<{
  // No props needed - just renders slot content
}>()
</script>

<template>
  <div class="term">
    <slot />
  </div>
</template>

<style scoped>
.term {
  display: block;
  font-family: 'concourse-caps', -apple-system, sans-serif;
  text-transform: lowercase;
  font-size: 120%;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-1);
}
</style>
