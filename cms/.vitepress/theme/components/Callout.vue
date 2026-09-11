<template>
  <div class="callout">
    <slot />
  </div>
</template>

<style scoped>
.callout {
  border-left: 4px solid var(--vp-c-brand-1);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
  font-weight: 500;
}
</style>
