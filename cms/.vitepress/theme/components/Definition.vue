<template>
  <definition>
    <term v-if="term">{{ term }}</term>
    <description><slot /></description>
    <usage v-if="usage">{{ usage }}</usage>
    <cite v-if="cite">{{ cite }}</cite>
  </definition>
</template>

<script setup lang="ts">
defineProps<{
  term?: string
  usage?: string
  cite?: string
}>()
</script>
