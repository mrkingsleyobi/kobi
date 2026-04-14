<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  url?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: () => typeof window !== 'undefined' ? window.location.href : '',
  title: () => typeof document !== 'undefined' ? document.title : ''
})

const encodedUrl = computed(() => encodeURIComponent(props.url))
const encodedTitle = computed(() => encodeURIComponent(props.title))

const shareLinks = computed(() => [
  {
    name: 'X',
    icon: 'ri:twitter-x-fill',
    url: `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`,
    className: 'x-share',
    label: 'Post'
  },
  {
    name: 'LinkedIn',
    icon: 'mdi:linkedin',
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`,
    className: 'linkedin-share',
    label: 'LinkedIn'
  },
  {
    name: 'Hacker News',
    icon: 'simple-icons:hackernews',
    url: `https://news.ycombinator.com/submitlink?u=${encodedUrl.value}&t=${encodedTitle.value}`,
    className: 'hn-share',
    label: 'Hacker News'
  },
  {
    name: 'Reddit',
    icon: 'mdi:reddit',
    url: `https://www.reddit.com/submit?url=${encodedUrl.value}&title=${encodedTitle.value}`,
    className: 'reddit-share',
    label: 'Reddit'
  },
  {
    name: 'Facebook',
    icon: 'mdi:facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
    className: 'facebook-share',
    label: 'Facebook'
  },
  {
    name: 'Email',
    icon: 'mdi:email-outline',
    url: `mailto:?subject=${encodedTitle.value}&body=${encodedUrl.value}`,
    className: 'email-share',
    label: 'Forward'
  }
])
</script>

<template>
  <div class="share-section">
    <div class="button-group">
      <span class="section-label">Share</span>
      <div class="share-row">
        <a
          v-for="link in shareLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="share-button"
          :class="link.className"
          :title="`Share on ${link.name}`"
        >
          <Icon v-if="link.icon" :icon="link.icon" width="16" height="16" />
          <span>{{ link.label }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-section {
  margin: 32px 0 24px 0;
}

.button-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.section-label {
  font-family: 'concourse-text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: .5rem;
  font-weight: 400;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: .1em;
  opacity: .8;
}

.share-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.share-button {
  display: inline-flex;
  align-items: center;
  gap: .2rem;
  padding: .15rem .35rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-1);
  font-size: .575rem;
  font-weight: 400;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  opacity: .9;
}

.share-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vp-c-brand-1);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  z-index: 0;
}

.share-button:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.share-button:hover::before {
  opacity: 1;
}

.share-button:hover span,
.share-button:hover .iconify {
  color: white;
  position: relative;
  z-index: 1;
}

.share-button .iconify {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.share-button span {
  position: relative;
  z-index: 1;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.share-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .share-section {
    margin: 32px 0 20px 0;
  }

  .share-row {
    gap: .25rem;
  }

  .share-button {
    padding: .125rem .3rem;
    font-size: .5rem;
    flex: 1 1 calc(50% - 4px);
    justify-content: center;
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  .share-button {
    flex: 1 1 100%;
    min-width: 100%;
  }
}
</style>
