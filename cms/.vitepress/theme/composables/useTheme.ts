import { ref, watch } from 'vue'

export type SiteTheme = 'normal' | 'sepia' | 'dusk'

const STORAGE_KEY = 'kobi-theme'
const THEMES: SiteTheme[] = ['normal', 'sepia', 'dusk']

// Module-level singleton so every component shares the same reactive theme.
const currentTheme = ref<SiteTheme>('normal')
let initialized = false

function applyTheme(theme: SiteTheme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  // Matches the approved Lavish prototype exactly: html[data-theme="..."]
  // drives every design token (see cms/.vitepress/theme/custom.css).
  root.setAttribute('data-theme', theme)
  // Keep VitePress's own `.dark` class in sync so any default-theme
  // components that key off it (e.g. code block themes) still work.
  root.classList.toggle('dark', theme === 'dusk')
}

function readStoredTheme(): SiteTheme {
  if (typeof window === 'undefined') return 'normal'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && (THEMES as string[]).includes(stored)) {
      return stored as SiteTheme
    }
  } catch {
    // localStorage unavailable (SSR, privacy mode) - fall back to default.
  }
  return 'normal'
}

export function useTheme() {
  if (!initialized && typeof window !== 'undefined') {
    initialized = true
    currentTheme.value = readStoredTheme()
    applyTheme(currentTheme.value)

    watch(currentTheme, (theme) => {
      applyTheme(theme)
      try {
        window.localStorage.setItem(STORAGE_KEY, theme)
      } catch {
        // Ignore storage failures - theme still applies for this session.
      }
    })
  }

  function setTheme(theme: SiteTheme) {
    currentTheme.value = theme
  }

  return { currentTheme, setTheme, THEMES }
}
