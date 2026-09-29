<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vitepress'
import { loadAllPosts } from '../utils/posts'
import type { BlogPostData } from '../types'

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const router = useRouter()

const posts = ref<BlogPostData[]>([])
const postsLoaded = ref(false)

const staticPages = [
  { title: 'Home', link: '/' },
  { title: 'Blog', link: '/blog/' },
  { title: 'Telos', link: '/telos/' },
  { title: 'Ideas', link: '/ideas/' },
  { title: 'Projects', link: '/projects/' },
  { title: 'Predictions', link: '/predictions/' },
  { title: 'About', link: '/about/' },
  { title: 'Members', link: '/members/' },
  { title: 'Archives', link: '/archives/' },
  { title: 'Consulting', link: '/consulting/' }
]

async function ensurePostsLoaded() {
  if (postsLoaded.value) return
  try {
    posts.value = await loadAllPosts()
  } catch (error) {
    console.error('CommandPalette: failed to load posts', error)
  } finally {
    postsLoaded.value = true
  }
}

const results = computed(() => {
  const q = query.value.trim().toLowerCase()

  const pageMatches = staticPages
    .filter((p) => !q || p.title.toLowerCase().includes(q))
    .map((p) => ({ kind: 'page' as const, title: p.title, link: p.link, subtitle: 'Page' }))

  const postMatches = posts.value
    .filter((p) => {
      if (!q) return false
      return (
        p.title.toLowerCase().includes(q) ||
        (p.subtitle || '').toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
    .slice(0, 8)
    .map((p) => ({ kind: 'post' as const, title: p.title, link: `/blog/${p.slug}`, subtitle: p.subtitle || 'Blog post' }))

  if (!q) return pageMatches
  return [...pageMatches, ...postMatches]
})

watch(results, () => {
  activeIndex.value = 0
})

async function open() {
  isOpen.value = true
  query.value = ''
  activeIndex.value = 0
  await ensurePostsLoaded()
  await nextTick()
  inputRef.value?.focus()
}

function close() {
  isOpen.value = false
}

function navigate(link: string) {
  close()
  router.go(link)
}

function onKeydown(event: KeyboardEvent) {
  if ((event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey))) {
    event.preventDefault()
    if (isOpen.value) {
      close()
    } else {
      open()
    }
    return
  }
  if (!isOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const item = results.value[activeIndex.value]
    if (item) navigate(item.link)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

defineExpose({ open })
</script>

<template>
  <button
    type="button"
    class="command-palette-trigger"
    aria-label="Open search (Command K)"
    title="Search (\u2318K)"
    @click="open"
  >
    <span class="cp-search-icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </span>
  </button>

  <Teleport to="body">
    <div v-if="isOpen" class="command-palette-overlay" @click.self="close">
      <div class="command-palette-modal" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="command-palette-input-row">
          <span class="cp-search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="command-palette-input"
            placeholder="Search posts and pages..."
            @keydown.stop
          />
          <kbd class="cp-esc-hint">ESC</kbd>
        </div>

        <div class="command-palette-results">
          <div v-if="results.length === 0" class="command-palette-empty">
            {{ query ? 'No results found.' : 'Type to search, or jump to a page below.' }}
          </div>
          <ul v-else class="command-palette-list">
            <li
              v-for="(item, index) in results"
              :key="`${item.kind}-${item.link}`"
              class="command-palette-item"
              :class="{ active: index === activeIndex }"
              @mouseenter="activeIndex = index"
              @click="navigate(item.link)"
            >
              <span class="cp-item-title">{{ item.title }}</span>
              <span class="cp-item-subtitle">{{ item.subtitle }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.command-palette-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.2s ease, background 0.2s ease;
}

.command-palette-trigger:hover {
  color: var(--vp-c-brand-1);
  background: var(--custom-c-bg-soft);
}

.cp-search-icon {
  display: inline-flex;
}

.command-palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  z-index: 1000;
}

.command-palette-modal {
  width: 90%;
  max-width: 560px;
  background: var(--vp-c-bg);
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid var(--custom-c-border);
}

.command-palette-input-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--custom-c-border);
  color: var(--vp-c-text-2);
}

.command-palette-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.cp-esc-hint {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  border: 1px solid var(--custom-c-border);
  border-radius: 4px;
  padding: 0.1rem 0.4rem;
}

.command-palette-results {
  max-height: 50vh;
  overflow-y: auto;
}

.command-palette-empty {
  padding: 1.5rem 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
  text-align: center;
}

.command-palette-list {
  list-style: none;
  margin: 0;
  padding: 0.5rem;
}

.command-palette-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
}

.command-palette-item.active,
.command-palette-item:hover {
  background: var(--custom-c-bg-soft);
}

.cp-item-title {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cp-item-subtitle {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
}
</style>
