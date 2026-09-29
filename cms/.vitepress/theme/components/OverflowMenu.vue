<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { overflowIcon, footerSocial } from '../utils/icons'

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function toggle() {
  isOpen.value = !isOpen.value
}
function close() {
  isOpen.value = false
}
function onClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) close()
}
function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}
onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onEscape)
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onEscape)
})
</script>
<template>
  <div ref="rootRef" class="extra-nav-wrap">
    <button
      type="button"
      class="icon-btn"
      title="More"
      aria-label="More"
      :aria-expanded="isOpen"
      v-html="overflowIcon"
      @click="toggle"
    />
    <div class="extra-nav-panel ui-face" :class="{ open: isOpen }">
      <div class="extra-nav-social">
        <a v-for="s in footerSocial" :key="s.label" href="#" :title="s.label" :aria-label="s.label" v-html="s.i" />
      </div>
    </div>
  </div>
</template>
