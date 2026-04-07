<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import PageGutter from './components/PageGutter.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <PageGutter />
  </Layout>
</template>
