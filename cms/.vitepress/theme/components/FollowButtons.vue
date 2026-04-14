<script setup lang="ts">
import { computed } from 'vue'

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
    icon: 'M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17.238 3.28l-7.928 7.1L4.216 6.28a.5.5 0 1 0-.672.744l8.5 7.75a.5.5 0 0 0 .672 0l8.5-7.75a.5.5 0 0 0-.672-.744z',
    url: '/feed.rss',
    className: 'newsletter',
    label: 'Get The Newsletter'
  },
  {
    name: 'X',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    url: 'https://x.com/mrkingsleyobi',
    className: 'x-follow',
    label: 'Follow On X'
  },
  {
    name: 'YouTube',
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    url: 'https://youtube.com/@mrkingsleyobi',
    className: 'youtube',
    label: 'Subscribe On YouTube'
  },
  {
    name: 'LinkedIn',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path :d="link.icon" />
          </svg>
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

.cta-button:hover svg,
.cta-button:hover span {
  color: white;
  position: relative;
  z-index: 1;
}

.cta-button svg {
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
