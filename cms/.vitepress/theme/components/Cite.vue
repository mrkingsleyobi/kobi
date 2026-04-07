<script setup lang="ts">
defineProps<{
  // No props needed - just renders slot content
}>()
</script>

<template>
  <div class="cite">
    <slot />
  </div>
</template>

<style scoped>
.cite {
  display: block;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  text-align: right;
}
</style>
