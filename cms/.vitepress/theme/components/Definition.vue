<template>
  <div class="definition">
    <div v-if="term" class="term">{{ term }}</div>
    <div class="description"><slot /></div>
    <div v-if="usage" class="usage">{{ usage }}</div>
    <div v-if="cite" class="cite">{{ cite }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  term?: string
  usage?: string
  cite?: string
}>()
</script>

<style scoped>
.definition {
  display: block;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.definition .term {
  display: block;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}

.definition .description {
  display: block;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.definition .usage {
  display: block;
  font-style: italic;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.definition .cite {
  display: block;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  text-align: right;
}
</style>
