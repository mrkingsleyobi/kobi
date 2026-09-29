<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Matches the prototype's `spinnerPhrases` array exactly (see
// renderPageSidebar / .bsl-spinner in kingsleyobi-prototype.html).
const spinnerPhrases = [
  { text: 'Zero-shot-inferring\u2026', icon: '\u{1F914}' },
  { text: 'Pattern-matching\u2026', icon: '\u{1F52E}' },
  { text: 'Context-windowing\u2026', icon: '\u{1FA9F}' },
  { text: 'Token-predicting\u2026', icon: '\u2728' }
]

const currentPhrase = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(() => {
    currentPhrase.value = (currentPhrase.value + 1) % spinnerPhrases.length
  }, 4000)
})

onUnmounted(() => {
  if (interval !== null) clearInterval(interval)
})
</script>

<template>
  <div class="bsl-spinner" aria-hidden="true">
    {{ spinnerPhrases[currentPhrase].icon }} {{ spinnerPhrases[currentPhrase].text }}
  </div>
</template>
