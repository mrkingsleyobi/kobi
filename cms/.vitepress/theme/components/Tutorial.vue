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
  background-color: rgba(60, 135, 114, 0.1);
  border-left: 3px solid var(--vp-c-brand-1);
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  border-radius: 4px;
  font-style: italic;
}
</style>
