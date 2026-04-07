<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div class="daniel-hero">
    <h1>{{ frontmatter.hero?.name || 'Kingsley Obi' }}</h1>
    <p class="tagline">{{ frontmatter.hero?.text || frontmatter.hero?.tagline }}</p>

    <div v-if="frontmatter.hero?.actions" class="daniel-hero-actions">
      <a
        v-for="action in frontmatter.hero.actions"
        :key="action.link"
        :href="action.link"
      >
        {{ action.text }}
      </a>
    </div>
  </div>

  <Content />
</template>

<style scoped>
</style>
