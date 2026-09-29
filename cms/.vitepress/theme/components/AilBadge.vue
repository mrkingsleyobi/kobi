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
  <div
    class="ail-badge"
    :title="`AIL ${clampedLevel}: ${label}`"
    :aria-label="`AI Influence Level ${clampedLevel} of 6: ${label}`"
  >
    <span class="ail-mark">AIL</span>
    <span class="ail-rail">
      <span
        v-for="(filled, i) in segments"
        :key="i"
        class="ail-segment"
        :class="{ filled }"
      />
    </span>
    <span class="ail-level">{{ clampedLevel }}</span>
  </div>
</template>

<style scoped>
.ail-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.5rem 0;
  cursor: default;
}

.ail-mark {
  font-family: var(--font-ui, sans-serif);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--vp-c-bg);
  background: var(--vp-c-text-1);
  padding: 0.15rem 0.35rem;
  border-radius: 3px;
  line-height: 1;
}

.ail-rail {
  display: inline-flex;
  gap: 2px;
}

.ail-segment {
  width: 8px;
  height: 10px;
  border-radius: 1px;
  background: var(--custom-c-border, rgba(0, 0, 0, 0.12));
}

.ail-segment.filled {
  background: var(--vp-c-brand-1);
}

.ail-level {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
}
</style>
