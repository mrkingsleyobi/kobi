<template>
  <h1 class="topic-title">{{ title }}</h1>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.topic-title {
  font-family: 'Georgia', serif;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--vp-c-brand-1);
}
</style>
