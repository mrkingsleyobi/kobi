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
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}
</style>
