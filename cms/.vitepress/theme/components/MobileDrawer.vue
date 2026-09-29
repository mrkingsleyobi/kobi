<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { primaryNav, footerSocial, hamburgerIcon, closeIcon, searchIcon, extLinkIcon } from '../utils/icons'

const props = defineProps<{ openSearch: () => void }>()

const isOpen = ref(false)
const route = useRoute()

function open() {
  isOpen.value = true
  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
}
function close() {
  isOpen.value = false
  if (typeof document !== 'undefined') document.body.style.overflow = ''
}
function onSearchClick() {
  close()
  props.openSearch()
}
watch(() => route.path, close)
</script>
<template>
  <button
    type="button"
    class="icon-btn hamburger"
    aria-label="Open navigation menu"
    :aria-expanded="isOpen"
    v-html="hamburgerIcon"
    @click="open"
  />
  <Teleport to="body">
    <div class="mobile-drawer nav-face" :class="{ open: isOpen }" role="dialog" aria-modal="true" aria-label="Site navigation">
      <button type="button" class="mobile-drawer-close ui-face" aria-label="Close menu" v-html="closeIcon" @click="close" />
      <a
        v-for="item in primaryNav"
        :key="item.nav"
        :href="item.nav"
        :class="{ on: route.path === item.nav }"
      >{{ item.label }}</a>
      <a href="https://university.example.com" target="_blank" rel="noopener" data-ext="1">ul site <span v-html="extLinkIcon" /></a>
      <a href="https://daemon.example.com" target="_blank" rel="noopener" data-ext="1">daemon <span v-html="extLinkIcon" /></a>
      <div class="mobile-drawer-foot">
        <button type="button" class="icon-btn" title="Search" aria-label="Search" v-html="searchIcon" @click="onSearchClick" />
        <div class="mobile-drawer-social">
          <a v-for="s in footerSocial" :key="s.label" href="#" :title="s.label" :aria-label="s.label" v-html="s.i" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
