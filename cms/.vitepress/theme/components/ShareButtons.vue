<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  url?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: () => (typeof window !== 'undefined' ? window.location.href : ''),
  title: () => (typeof document !== 'undefined' ? document.title : '')
})

const encodedUrl = computed(() => encodeURIComponent(props.url))
const encodedTitle = computed(() => encodeURIComponent(props.title))

// Labels/glyphs match .share-btn markup in the prototype exactly (text-only,
// no icon font - see post-footer-block / blog index footer).
const shareLinks = computed(() => [
  { name: 'Post', glyph: '\u{1D54F}', url: `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}` },
  { name: 'LinkedIn', glyph: 'in', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}` },
  { name: 'Hacker News', glyph: 'Y', url: `https://news.ycombinator.com/submitlink?u=${encodedUrl.value}&t=${encodedTitle.value}` },
  { name: 'Reddit', glyph: '', url: `https://www.reddit.com/submit?url=${encodedUrl.value}&title=${encodedTitle.value}` },
  { name: 'Facebook', glyph: 'f', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}` },
  { name: 'Forward', glyph: '\u2709', url: `mailto:?subject=${encodedTitle.value}&body=${encodedUrl.value}` }
])
</script>

<template>
  <div class="share-row">
    <a
      v-for="link in shareLinks"
      :key="link.name"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="share-btn"
      :title="link.name"
    ><span v-if="link.glyph" class="share-ic-text">{{ link.glyph }}</span>{{ link.name }}</a>
  </div>
</template>
