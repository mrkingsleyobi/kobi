<template>
  <div class="callout">
    <slot />
  </div>
</template>

<style scoped>
.callout {
  position: relative;
  display: block;
  font-size: 125%;
  font-family: 'heliotrope-t3', -apple-system, sans-serif;
  text-align: center;
  margin: 2rem 2.3rem 2.3rem;
  color: var(--text-2);
}
.callout::before {
  content: '\201C';
  display: block;
  width: 100%;
  text-align: center;
  font-size: 150%;
  margin-bottom: .6rem;
  color: var(--text-2);
}
.callout :deep(cite) {
  display: block;
  font-family: 'advocate-c14', Georgia, serif;
  text-transform: lowercase;
  font-size: 100%;
  margin-top: 1.2rem;
  font-style: normal;
  color: var(--text-1);
}
</style>
