<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** AI Influence Level, 0 (human created, no AI) through 6 (AI initiated, no human). */
  level: number
}

const props = defineProps<Props>()

const clampedLevel = computed(() => Math.min(6, Math.max(0, Math.round(props.level))))
const segments = computed(() => Array.from({ length: 6 }, (_, i) => i < clampedLevel.value))

const labels: Record<number, string> = {
  0: 'Human created, no AI involvement',
  1: 'Human created, AI-assisted editing',
  2: 'Human created, AI-assisted research',
  3: 'Human/AI collaboration',
  4: 'AI drafted, human edited',
  5: 'AI drafted, human reviewed',
  6: 'AI initiated, no human involvement'
}

const label = computed(() => labels[clampedLevel.value] ?? '')
</script>

<template>
  <div class="ail-badge" :title="`AI Influence Level ${clampedLevel}`" :aria-label="`AI Influence Level ${clampedLevel} of 6: ${label}`">
    <div class="ail-badge-mark">AIL</div>
    <div class="ail-badge-field">
      <span class="ail-badge-level">{{ clampedLevel }}</span>
      <span class="ail-badge-rail">
        <span v-for="(filled, i) in segments" :key="i" class="ail-badge-seg" :class="{ filled }" />
      </span>
    </div>
  </div>
</template>
