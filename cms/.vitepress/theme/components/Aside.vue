<script setup lang="ts">
interface Props {
  text?: string
}
defineProps<Props>()
</script>

<template>
  <div class="aside">
    <slot>{{ text }}</slot>
  </div>
</template>

<style scoped>
.aside {
  font-family: heliotrope-t3;
  font-size: .83rem;
  line-height: 1.4;
  color: var(--vp-c-text-3);
  letter-spacing: .015em;
  -webkit-hyphens: none;
  hyphens: none;
  font-feature-settings: "liga";
  display: block;
}
</style>
