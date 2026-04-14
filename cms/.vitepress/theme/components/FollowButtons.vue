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
  margin: 24px 0 0 0;
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

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: .2rem;
  padding: .125rem .3rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-1);
  font-size: .5rem;
  font-weight: 400;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  opacity: .85;
}

.cta-button::before {
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

.cta-button:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cta-button:hover::before {
  opacity: 1;
}

.cta-button:hover span,
.cta-button:hover .iconify {
  color: white;
  position: relative;
  z-index: 1;
}

.cta-button .iconify {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-button span {
  position: relative;
  z-index: 1;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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
