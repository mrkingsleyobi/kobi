<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const socialLinks = [
  { url: 'https://github.com/mrkingsleyobi', icon: 'mdi:github', label: 'GitHub' },
  { url: 'https://x.com/mrkingsleyobi', icon: 'simple-icons:x', label: 'X' },
  { url: 'https://linkedin.com/in/mrkingsleyobi', icon: 'mdi:linkedin', label: 'LinkedIn' },
  { url: 'https://youtube.com/@mrkingsleyobi', icon: 'mdi:youtube', label: 'YouTube' }
]

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function onClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div ref="rootRef" class="overflow-menu">
    <button
      type="button"
      class="overflow-menu-trigger"
      aria-label="More options"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span class="overflow-dot" />
      <span class="overflow-dot" />
      <span class="overflow-dot" />
    </button>

    <div v-if="isOpen" class="overflow-menu-panel">
      <a
        v-for="social in socialLinks"
        :key="social.url"
        :href="social.url"
        target="_blank"
        rel="noopener noreferrer"
        :title="social.label"
        class="overflow-menu-link"
      >
        <iconify-icon :icon="social.icon" width="18" height="18" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.overflow-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.overflow-menu-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
}

.overflow-menu-trigger:hover {
  background: var(--custom-c-bg-soft);
}

.overflow-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--vp-c-text-2);
}

.overflow-menu-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--custom-c-border);
  border-radius: 8px;
  padding: 0.6rem;
  display: flex;
  gap: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.overflow-menu-link {
  color: var(--vp-c-text-2);
  display: inline-flex;
}

.overflow-menu-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
