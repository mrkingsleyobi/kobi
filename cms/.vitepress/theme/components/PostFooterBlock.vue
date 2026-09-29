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
    <div class="footer-row-label">Share</div>
    <ShareButtons />
    <div class="footer-row-label">Follow</div>
    <FollowButtons />
    <div class="footer-row-label">Search</div>
    <SearchSection :post-count="postCount" :years-active="yearsActive" :tag-count="tagCount" />
  </div>
</template>
