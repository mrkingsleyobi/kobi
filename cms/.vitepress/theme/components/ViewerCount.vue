<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Matches the prototype's `readingNow` behavior exactly: starts at 18,
// fluctuates every 4s by Math.floor(Math.random()*7)-3, floored at 6.
const readingNow = ref(18)
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(() => {
    readingNow.value = Math.max(6, readingNow.value + Math.floor(Math.random() * 7) - 3)
  }, 4000)
})

onUnmounted(() => {
  if (interval !== null) clearInterval(interval)
})
</script>

<template>
  <div class="bsl-viewer-line">
    <span class="liv-dot" />
    <span>{{ readingNow }} reading now</span>
  </div>
</template>
