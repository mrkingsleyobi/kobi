<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const viewerCount = ref(0)
const displayCount = ref(0)

// Generate a realistic starting count between 100-1000
const generateInitialCount = () => Math.floor(Math.random() * 900) + 100

// Fluctuate the count by -5 to +10
const fluctuateCount = () => {
  const change = Math.floor(Math.random() * 16) - 5
  viewerCount.value = Math.max(50, viewerCount.value + change)
}

// Animate count changes smoothly
const animateCount = () => {
  const diff = viewerCount.value - displayCount.value
  if (Math.abs(diff) > 0) {
    displayCount.value += diff * 0.1
    if (Math.abs(viewerCount.value - displayCount.value) < 0.5) {
      displayCount.value = viewerCount.value
    }
  }
}

let countInterval: number | null = null
let animationFrame: number | null = null

onMounted(() => {
  viewerCount.value = generateInitialCount()
  displayCount.value = viewerCount.value

  // Update count every 3-8 seconds
  const updateCount = () => {
    fluctuateCount()
    const nextUpdate = Math.random() * 5000 + 3000
    countInterval = window.setTimeout(updateCount, nextUpdate)
  }
  updateCount()

  // Smooth animation
  const animate = () => {
    animateCount()
    animationFrame = requestAnimationFrame(animate)
  }
  animate()
})

onUnmounted(() => {
  if (countInterval !== null) {
    clearTimeout(countInterval)
  }
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div class="viewer-count">
    <span class="viewer-count-number">{{ Math.round(displayCount) }}</span>
    reading now
  </div>
</template>

<style scoped>
.viewer-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0;
  font-style: italic;
}

.viewer-count-number {
  font-weight: 600;
  color: var(--vp-c-brand);
  font-size: 1em;
}
</style>
