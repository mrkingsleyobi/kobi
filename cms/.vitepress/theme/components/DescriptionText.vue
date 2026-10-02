<script setup lang="ts">
defineProps<{
  // No props needed - just renders slot content
}>()
</script>

<template>
  <div class="description-text">
    <slot />
  </div>
</template>

<style scoped>
.description-text {
  display: block;
  margin-bottom: 0.75rem;
  line-height: 1.6;
}
</style>
