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

const followLinks = computed(() => [
  {
    name: 'Newsletter',
    icon: 'mdi:email-outline',
    url: '/feed.rss',
    className: 'newsletter',
    label: 'Get The Newsletter'
  },
  {
    name: 'X',
    icon: 'ri:twitter-x-fill',
    url: 'https://x.com/mrkingsleyobi',
    className: 'x-follow',
    label: 'Follow On X'
  },
  {
    name: 'YouTube',
    icon: 'mdi:youtube',
    url: 'https://youtube.com/@mrkingsleyobi',
    className: 'youtube',
    label: 'Subscribe On YouTube'
  },
  {
    name: 'LinkedIn',
    icon: 'mdi:linkedin',
    url: 'https://linkedin.com/in/mrkingsleyobi',
    className: 'linkedin',
    label: 'Follow On LinkedIn'
  }
])
</script>

<template>
  <div class="cta-section">
    <div class="button-group">
      <span class="section-label">Follow</span>
      <div class="cta-row">
        <a
          v-for="link in followLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-button"
          :class="link.className"
          :title="link.name"
        >
          <Icon :icon="link.icon" width="16" height="16" />
          <span>{{ link.label }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cta-section {
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

.cta-row {
    display: flex;
    gap: .25rem;
    flex-wrap: wrap;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    gap: .2rem;
    padding: .125rem .3rem;
    font-family: concourse-t2, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: .5rem;
    font-weight: 400;
    text-decoration: none;
    text-transform: capitalize;
    letter-spacing: .01em;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    transition: all .15s ease;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-2);
    opacity: .85;
}

.cta-button:hover {
    opacity: 1;
    background: var(--vp-c-bg-soft);
    border-color: var(--vp-c-divider)
}

.cta-button svg {
    opacity: .6;
    width: 12px;
    height: 12px
}

.cta-button.newsletter:hover {
    color: var(--vp-c-text-1)
}

.cta-button.newsletter:hover svg {
    opacity: .8
}

.cta-button.youtube:hover {
    color: var(--vp-c-text-1)
}

.cta-button.youtube:hover svg {
    opacity: .8
}

.cta-button.linkedin:hover {
    color: var(--vp-c-text-1)
}

.cta-button.linkedin:hover svg {
    opacity: .8
}

.cta-button.x-follow:hover {
    color: var(--vp-c-text-1)
}

.cta-button.x-follow:hover svg {
    opacity: .8
}


@media (max-width: 768px) {
  .cta-section {
    margin: 20px 0 0 0;
  }

  .cta-row {
    gap: .25rem;
  }

  .cta-button {
    padding: .1rem .25rem;
    font-size: .475rem;
    flex: 1 1 calc(50% - 4px);
    justify-content: center;
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  .cta-button {
    flex: 1 1 100%;
    min-width: 100%;
  }
}
</style>
