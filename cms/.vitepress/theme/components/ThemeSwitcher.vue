<script setup lang="ts">
import { useTheme, type SiteTheme } from '../composables/useTheme'

const { currentTheme, setTheme } = useTheme()

const swatches: { theme: SiteTheme; label: string }[] = [
  { theme: 'normal', label: 'Normal theme' },
  { theme: 'sepia', label: 'Sepia theme' },
  { theme: 'dusk', label: 'Dusk theme' }
]
</script>

<template>
  <div class="theme-switcher" role="group" aria-label="Site theme">
    <button
      v-for="swatch in swatches"
      :key="swatch.theme"
      type="button"
      class="theme-dot"
      :class="[`theme-dot-${swatch.theme}`, { active: currentTheme === swatch.theme }]"
      :aria-pressed="currentTheme === swatch.theme"
      :aria-label="swatch.label"
      :title="swatch.label"
      @click="setTheme(swatch.theme)"
    />
  </div>
</template>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1rem;
}

.theme-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--custom-c-border, rgba(0, 0, 0, 0.15));
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.theme-dot:hover {
  transform: scale(1.15);
}

.theme-dot.active {
  box-shadow: 0 0 0 2px var(--vp-c-bg), 0 0 0 4px var(--vp-c-brand-1);
}

.theme-dot-normal {
  background: #ffffff;
}

.theme-dot-sepia {
  background: #f4ecd8;
}

.theme-dot-dusk {
  background: #1a1a2e;
}
</style>
