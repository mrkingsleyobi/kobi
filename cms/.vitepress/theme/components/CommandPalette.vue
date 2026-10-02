<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vitepress'
import { loadAllPosts } from '../utils/posts'
import { searchIcon } from '../utils/icons'
import { formatDate } from '../utils/format'
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

// Matches the prototype's "Continue reading" / "On this day in the archive"
// sections when the query is empty; a flat filtered row list once the user
// starts typing (search-modal-body -> sm-section-label / sm-row).
const emptyStateSections = computed(() => {
  const continueReading = posts.value.slice(0, 3)
  const onThisDay = posts.value.slice(3, 7).length ? posts.value.slice(3, 7) : posts.value.slice(0, 4)
  return [
    { label: 'Continue reading', items: continueReading },
    { label: 'On this day in the archive', items: onThisDay }
  ]
})

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  const pageMatches = staticPages
    .filter((p) => !q || p.title.toLowerCase().includes(q))
    .map((p) => ({ title: p.title, link: p.link, age: 'Page' }))
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
    .map((p) => ({ title: p.title, link: `/blog/${p.slug}`, age: formatDate(p.created_at) }))
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
  if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    if (isOpen.value) close()
    else open()
    return
  }
  if (!isOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  } else if (event.key === 'ArrowDown' && query.value) {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  } else if (event.key === 'ArrowUp' && query.value) {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter' && query.value) {
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
    class="icon-btn"
    id="searchTrigger"
    title="Search (\u2318K)"
    aria-label="Open search"
    v-html="searchIcon"
    @click="open"
  />

  <Teleport to="body">
    <div class="search-modal-overlay" :class="{ open: isOpen }" @click.self="close">
      <div class="search-modal ui-face" role="dialog" aria-modal="true" aria-label="Search">
        <div class="search-box">
          <span v-html="searchIcon" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Search posts, or jump anywhere…"
            @keydown.stop
          />
        </div>
        <div class="search-modal-body">
          <template v-if="query">
            <div class="sm-section-label">Results</div>
            <div v-if="results.length === 0" class="sm-row"><span class="sm-row-title">No results found.</span></div>
            <div
              v-for="(item, index) in results"
              :key="item.link"
              class="sm-row"
              :class="{ active: index === activeIndex }"
              @mouseenter="activeIndex = index"
              @click="navigate(item.link)"
            >
              <span class="sm-row-title">{{ item.title }}</span>
              <span class="sm-row-age">{{ item.age }}</span>
            </div>
          </template>
          <template v-else>
            <template v-for="section in emptyStateSections" :key="section.label">
              <div class="sm-section-label">{{ section.label }}</div>
              <div
                v-for="p in section.items"
                :key="p.slug"
                class="sm-row"
                @click="navigate(`/blog/${p.slug}`)"
              >
                <span class="sm-row-title">{{ p.title }}</span>
                <span class="sm-row-age">{{ formatDate(p.created_at) }}</span>
              </div>
            </template>
          </template>
        </div>
        <div class="search-modal-footer">
          <span class="sm-kbd"><kbd>&uarr;</kbd><kbd>&darr;</kbd> navigate</span>
          <span class="sm-kbd"><kbd>&crarr;</kbd> open</span>
          <span class="sm-kbd"><kbd>esc</kbd> close</span>
          <span class="sm-total">{{ posts.length }} posts</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
