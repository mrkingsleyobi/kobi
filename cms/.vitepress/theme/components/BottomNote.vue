<script setup lang="ts">
// BottomNote component - displays notes/references at the bottom of posts
</script>

<template>
  <div class="bottom-note">
    <slot />
  </div>
</template>

<style scoped>
.bottom-note {
  display: block;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.bottom-note :deep(ol) {
  margin-left: 1.5rem;
}

.bottom-note :deep(li) {
  margin-bottom: 0.5rem;
}
</style>
