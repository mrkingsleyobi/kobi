<script setup lang="ts">
import { useTheme, type SiteTheme } from '../composables/useTheme'
const { currentTheme, setTheme } = useTheme()
const swatches: { theme: SiteTheme; label: string }[] = [
  { theme: 'normal', label: 'Normal' },
  { theme: 'sepia', label: 'Sepia' },
  { theme: 'dusk', label: 'Dusk' }
]
</script>
<template>
  <div class="footer-themes ui-face" role="group" aria-label="Site theme">
    <button
      v-for="swatch in swatches"
      :key="swatch.theme"
      type="button"
      class="footer-theme-btn"
      :data-site-theme="swatch.theme"
      :class="{ active: currentTheme === swatch.theme }"
      :aria-pressed="currentTheme === swatch.theme"
      @click="setTheme(swatch.theme)"
    >
      <span class="dot" />{{ swatch.label }}
    </button>
  </div>
</template>
