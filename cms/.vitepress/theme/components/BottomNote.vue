<script setup lang="ts">
// BottomNote component - renders the "Notes" block at the bottom of a post,
// matching the prototype's .prose-aside / .prose-aside-list / .prose-aside-item markup.
</script>
<template>
  <div class="prose-aside">
    <div class="prose-aside-label">Notes</div>
    <div class="prose-aside-list">
      <slot />
    </div>
  </div>
</template>
