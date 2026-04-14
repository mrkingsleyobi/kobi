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
    margin-bottom: 1rem;
}

.button-group {
    display: flex;
    align-items: center;
    gap: .5rem;
    justify-content: flex-start;
}

.section-label {
    font-family: concourse-t3, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: .5rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--vp-c-text-3);
    font-weight: 400;
    opacity: .8;
}

.share-row {
    display: flex;
    gap: .25rem;
    flex-wrap: wrap;
}

.share-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .2rem;
    padding: .15rem .35rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    transition: all .15s ease;
    background: var(--vp-c-bg-elv);
    color: var(--vp-c-text-2);
    opacity: .9;
    text-decoration: none;
    font-family: concourse-t2, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: .575rem;
    font-weight: 400;
    letter-spacing: .01em;
    text-transform: capitalize;
}

.share-button[data-v-17b27531]:hover {
    opacity: 1;
    background: var(--vp-c-bg-elv);
    border-color: var(--vp-c-divider);
    transform: translateY(-1px)
}

.share-button svg[data-v-17b27531] {
    opacity: .7;
    width: 14px;
    height: 14px
}

.share-button:hover svg[data-v-17b27531] {
    opacity: 1
}

.hn-icon[data-v-17b27531] {
    font-family: concourse-t2,-apple-system,BlinkMacSystemFont,sans-serif;
    font-weight: 600;
    font-size: .575rem;
    opacity: .7
}

.share-button:hover .hn-icon[data-v-17b27531] {
    opacity: 1
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
