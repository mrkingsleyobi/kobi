<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const spinnerPhrases = [
  { text: 'Zero-shot-inferring...', icon: '🤔', color: '#3987b1' },
  { text: 'Glanding-weave...', icon: '🧠', color: '#8162c3' },
  { text: 'Pattern-matching...', icon: '🔮', color: '#c94560' },
  { text: 'Neural-firing...', icon: '⚡', color: '#f39c12' },
  { text: 'Context-windowing...', icon: '🪟', color: '#27ae60' },
  { text: 'Token-predicting...', icon: '✨', color: '#8e44ad' },
  { text: 'Embedding-vectoring...', icon: '🎯', color: '#e74c3c' },
  { text: 'Attention-mechanizing...', icon: '🔍', color: '#3498db' },
]

const currentPhrase = ref(0)
const isVisible = ref(true)

const cyclePhrase = () => {
  isVisible.value = false
  setTimeout(() => {
    currentPhrase.value = (currentPhrase.value + 1) % spinnerPhrases.length
    isVisible.value = true
  }, 500)
}

let interval: number | null = null

onMounted(() => {
  interval = window.setInterval(cyclePhrase, 4000)
})

onUnmounted(() => {
  if (interval !== null) {
    clearInterval(interval)
  }
})
</script>

<template>
  <div class="spinner-verbs" aria-hidden="true">
    <span
      class="spinner-verbs-line"
      :style="{
        opacity: isVisible ? 1 : 0,
        color: spinnerPhrases[currentPhrase].color,
        transition: 'opacity 0.5s ease-in-out'
      }"
    >
      <span
        class="spinner-verbs-icon"
        :style="{ animation: 'iconBounce 4.0s ease-in-out infinite' }"
      >
        {{ spinnerPhrases[currentPhrase].icon }}
      </span>
      &nbsp;{{ spinnerPhrases[currentPhrase].text }}
    </span>
  </div>
</template>

<style scoped>
.spinner-verbs {
  margin: 0.8rem 0;
  font-size: 0.85rem;
  font-style: italic;
}

.spinner-verbs-line {
  display: inline-block;
  transition: opacity 0.5s ease-in-out;
}

.spinner-verbs-icon {
  display: inline-block;
  font-size: 1.1em;
}

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
</style>
