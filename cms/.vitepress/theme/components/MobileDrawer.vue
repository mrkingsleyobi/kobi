<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const isOpen = ref(false)
const route = useRoute()

const navLinks = [
  { text: 'Home', link: '/' },
  { text: 'Blog', link: '/blog/' },
  { text: 'Telos', link: '/telos/' },
  { text: 'Ideas', link: '/ideas/' },
  { text: 'Projects', link: '/projects/' },
  { text: 'Predictions', link: '/predictions/' },
  { text: 'About', link: '/about/' },
  { text: 'Members', link: '/members/' }
]

const socialLinks = [
  { url: 'https://github.com/mrkingsleyobi', icon: 'mdi:github', label: 'GitHub' },
  { url: 'https://x.com/mrkingsleyobi', icon: 'simple-icons:x', label: 'X' },
  { url: 'https://linkedin.com/in/mrkingsleyobi', icon: 'mdi:linkedin', label: 'LinkedIn' },
  { url: 'https://youtube.com/@mrkingsleyobi', icon: 'mdi:youtube', label: 'YouTube' }
]

function open() {
  isOpen.value = true
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

function close() {
  isOpen.value = false
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

watch(() => route.path, close)
</script>

<template>
  <button
    type="button"
    class="mobile-drawer-trigger"
    aria-label="Open navigation menu"
    :aria-expanded="isOpen"
    @click="open"
  >
    <span class="hamburger-line hamburger-line-1" />
    <span class="hamburger-line hamburger-line-2" />
    <span class="hamburger-line hamburger-line-3" />
  </button>

  <Teleport to="body">
    <div v-if="isOpen" class="mobile-drawer-overlay">
      <div class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Site navigation">
        <div class="mobile-drawer-header">
          <span class="mobile-drawer-title">Menu</span>
          <button type="button" class="mobile-drawer-close" aria-label="Close menu" @click="close">
            &times;
          </button>
        </div>

        <nav class="mobile-drawer-nav">
          <a
            v-for="item in navLinks"
            :key="item.link"
            :href="item.link"
            class="mobile-drawer-link"
            :class="{ active: route.path === item.link }"
          >
            {{ item.text }}
          </a>
        </nav>

        <div class="mobile-drawer-bottom">
          <a href="/archives/" class="mobile-drawer-search-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <span>Search</span>
          </a>
          <div class="mobile-drawer-social-row">
            <a
              v-for="social in socialLinks"
              :key="social.url"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :title="social.label"
              class="mobile-drawer-social-link"
            >
              <iconify-icon :icon="social.icon" width="20" height="20" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mobile-drawer-trigger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0 2px;
}

/* Three uneven-length lines, tapering from the left - visually distinct
   from the header's three-dot overflow icon. */
.hamburger-line {
  display: block;
  height: 2px;
  background: var(--vp-c-text-1);
  border-radius: 1px;
}

.hamburger-line-1 {
  width: 22px;
}

.hamburger-line-2 {
  width: 16px;
}

.hamburger-line-3 {
  width: 10px;
}

@media (max-width: 768px) {
  .mobile-drawer-trigger {
    display: flex;
  }
}

.mobile-drawer-overlay {
  position: fixed;
  inset: 0;
  background: var(--vp-c-bg);
  z-index: 1000;
}

.mobile-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.25rem 1.5rem;
  box-sizing: border-box;
}

.mobile-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.mobile-drawer-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}

.mobile-drawer-close {
  border: none;
  background: transparent;
  font-size: 1.75rem;
  line-height: 1;
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.mobile-drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.mobile-drawer-link {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.mobile-drawer-link.active {
  color: var(--vp-c-brand-1);
}

.mobile-drawer-bottom {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--custom-c-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-drawer-search-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.9rem;
}

.mobile-drawer-social-row {
  display: flex;
  gap: 1rem;
}

.mobile-drawer-social-link {
  color: var(--vp-c-text-2);
  display: inline-flex;
}
</style>
