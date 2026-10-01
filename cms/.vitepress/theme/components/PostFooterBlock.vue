<script setup lang="ts">
import ShareButtons from './ShareButtons.vue'
import FollowButtons from './FollowButtons.vue'
import SearchSection from './SearchSection.vue'

defineProps<{
  postCount?: number
  yearsActive?: string
  tagCount?: number
}>()
</script>
<template>
  <div class="post-footer-block">
    <div class="footer-row">
      <span class="footer-row-label">Share</span>
      <ShareButtons />
    </div>
    <div class="footer-row">
      <span class="footer-row-label">Follow</span>
      <FollowButtons />
    </div>
    <div class="footer-row">
      <span class="footer-row-label">Search</span>
      <SearchSection :post-count="postCount" :years-active="yearsActive" :tag-count="tagCount" />
    </div>
  </div>
</template>
