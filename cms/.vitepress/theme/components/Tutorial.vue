<script setup lang="ts">
// Tutorial component - displays content in a styled tutorial/aside block
</script>

<template>
  <div class="tutorial">
    <slot />
  </div>
</template>

<style scoped>
.tutorial {
  display: block;
  margin: 1.5rem 0;
  background: var(--bg-soft);
  font-size: 90%;
  font-family: 'concourse-t3', -apple-system, sans-serif;
  padding: 1rem;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.tutorial :deep(title) {
  display: block;
  text-transform: lowercase;
  font-family: 'concourse-c4', -apple-system, sans-serif;
  font-size: 120%;
  margin-bottom: 1rem;
  color: var(--text-1);
}
</style>
