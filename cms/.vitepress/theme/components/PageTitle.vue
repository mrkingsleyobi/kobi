<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { Frontmatter } from '../types'
import { formatDate, parseTags } from '../utils/format'
import SpinnerVerbs from './SpinnerVerbs.vue'
import ViewerCount from './ViewerCount.vue'

const { frontmatter } = useData<Frontmatter>()

const tags = computed(() => parseTags(frontmatter.value.tags))
const createdDate = computed(() =>
  frontmatter.value.created_at ? formatDate(frontmatter.value.created_at) : null
)

// Check if this is a blog post
const isBlogPost = computed(() => !!frontmatter.value.created_at)
</script>

<template>
  <div class="page-title">
    <h1 v-if="frontmatter.title" class="frontmatter-title text-pretcty">
      {{ frontmatter.title }}
    </h1>

    <div v-if="frontmatter.subtitle" class="frontmatter-subtitle">
      {{ frontmatter.subtitle }}
    </div>

    <div v-if="frontmatter.description && !isBlogPost" class="description">
      {{ frontmatter.description }}
    </div>

    <template v-if="isBlogPost">
      <div v-if="createdDate" class="frontmatter-created-at">
        {{ createdDate }}
      </div>

      <div v-if="tags.length" class="frontmatter-tags">
        <a
          v-for="tag in tags"
          :key="tag"
          :href="`/archives/?tag=${tag.toLowerCase()}`"
          class="tag-link"
        >
          #{{ tag }}
        </a>
      </div>

      <SpinnerVerbs />
      <ViewerCount />
    </template>
  </div>
</template>

<style scoped>
.page-title {
  position: absolute !important;
  left: 1.5rem !important;
  top: 60px !important;
  width: 10rem !important;
  text-align: right !important;
  font-weight: 400;
  border-top: solid 3px var(--vp-c-brand-1) !important;
  padding-top: 5px !important;
  z-index: 1;
  background: transparent !important;
  box-sizing: border-box !important;
  margin: 0 !important;
}

.frontmatter-title {
  font-family: inherit !important;
  text-transform: inherit !important;
  letter-spacing: inherit !important;
  font-size: 125% !important;
  line-height: 1.1 !important;
  border-bottom: inherit !important;
  margin-top: 0rem !important;
  margin-bottom: .8rem !important;
  font-weight: bolder !important;
  border-top: 0 !important;
  padding-top: 0 !important;
  color: var(--vp-c-text-1) !important;
}

.frontmatter-subtitle {
  font-family: valkyrie-text, Georgia, serif !important;
  display: block !important;
  font-size: 95% !important;
  font-weight: 300 !important;
  color: var(--vp-c-text-2) !important;
  line-height: 1.25 !important;
  font-style: italic !important;
  margin-bottom: .8rem !important;
  -webkit-hyphens: none !important;
  hyphens: none !important;
}

.frontmatter-created-at {
  font-family: equity-text, Georgia, serif !important;
  display: block !important;
  font-size: .8rem !important;
  font-weight: 400 !important;
  line-height: 1.3 !important;
  margin-bottom: .6rem !important;
  color: var(--vp-c-text-2) !important;
}

.frontmatter-tags {
  display: block !important;
  margin-top: .5rem !important;
  line-height: 1.4 !important;
}

.tag-link {
  display: block !important;
  font-size: .75rem !important;
  color: var(--vp-c-brand-1) !important;
  text-decoration: none !important;
  margin-bottom: .2rem !important;
  transition: color 0.2s ease !important;
}

.tag-link:hover {
  color: var(--vp-c-brand-2) !important;
  text-decoration: underline !important;
}

.description {
  font-size: .6875rem !important;
  color: var(--vp-c-text-3) !important;
  line-height: 1.4 !important;
  margin: 0 !important;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-title {
    position: static !important;
    width: auto !important;
    text-align: left !important;
    left: 0 !important;
    margin-top: 40px !important;
    margin-bottom: 1.5rem !important;
    border: none !important;
    padding: 0 !important;
  }

  .frontmatter-title {
    font-size: 1.125rem !important;
  }

  .frontmatter-subtitle {
    font-size: 0.9375rem !important;
  }

  .frontmatter-tags {
    flex-wrap: wrap;
    flex-direction: row;
  }
}
</style>
