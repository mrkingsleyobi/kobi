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
  font-family: 'advocate-c41', Georgia, serif;
  font-size: 90%;
  font-style: normal;
  text-transform: lowercase;
  margin-top: 0.75rem;
  color: var(--text-2);
}
</style>
