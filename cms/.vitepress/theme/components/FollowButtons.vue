<script setup lang="ts">
import { icon } from '../utils/icons'

const followLinks = [
  { key: 'mail', label: 'Get the Newsletter', url: '/feed.rss' },
  { key: 'x', label: 'Follow on X', url: 'https://x.com/mrkingsleyobi' },
  { key: 'yt', label: 'Subscribe on YouTube', url: 'https://youtube.com/@mrkingsleyobi' },
  { key: 'li', label: 'Follow on LinkedIn', url: 'https://linkedin.com/in/mrkingsleyobi' }
]
</script>

<template>
  <div class="follow-row">
    <a
      v-for="link in followLinks"
      :key="link.key"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="follow-btn"
    >
      <span class="share-ic" v-html="icon[link.key]" />{{ link.label }}
    </a>
  </div>
</template>
