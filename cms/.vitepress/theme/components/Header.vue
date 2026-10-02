<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vitepress'
import { primaryNav } from '../utils/icons'
import CommandPalette from './CommandPalette.vue'
import OverflowMenu from './OverflowMenu.vue'
import MobileDrawer from './MobileDrawer.vue'

const route = useRoute()
const commandPaletteRef = ref<InstanceType<typeof CommandPalette> | null>(null)

function isActive(nav: string) {
  if (nav === '/') return route.path === '/'
  return route.path.startsWith(nav)
}

function openSearch() {
  commandPaletteRef.value?.open()
}
</script>
<template>
  <header class="site-header">
    <div class="site-header-inner">
      <a href="/" class="wordmark">KINGSLEY OBI</a>
      <nav class="primary-nav nav-face" aria-label="Primary">
        <a v-for="item in primaryNav" :key="item.nav" :href="item.nav" :class="{ on: isActive(item.nav) }">{{ item.label }}</a>
      </nav>
      <div class="nav-right">
        <CommandPalette ref="commandPaletteRef" />
        <OverflowMenu />
        <MobileDrawer :open-search="openSearch" />
      </div>
    </div>
  </header>
</template>
