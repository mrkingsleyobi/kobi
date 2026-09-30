<script setup lang="ts">
import { computed } from 'vue'
import { useData, Content } from 'vitepress'
import type { Frontmatter } from './types'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import PageTitle from './components/PageTitle.vue'
import RelatedReading from './components/RelatedReading.vue'
import PostFooterBlock from './components/PostFooterBlock.vue'
import NotFound from './NotFound.vue'

const { frontmatter, page } = useData<Frontmatter>()

const isBlogPost = computed(() => page.value.relativePath.startsWith('blog/') && !!frontmatter.value.created_at)
const isHome = computed(() => frontmatter.value.layout === 'home')

// Two-column `.blog-split` layout applies to every page that has a title
// except Home (see README "Two-column sidebar layout pattern").
const useSplitLayout = computed(() => !isHome.value && !!frontmatter.value.title)

// Static single-column pages (Members) opt out of blog-split entirely by
// omitting a subtitle-bearing left rail - handled per-page in markdown.
const isMembers = computed(() => page.value.relativePath === 'members/index.md')

// Share/Follow/Search footer block: blog post pages only here - the blog
// index renders its own copy (with live post-count/years/tags) directly
// inside BlogHome.vue (see README "Share/Follow/Search footer block").
const showPostFooterBlock = computed(() => isBlogPost.value)
</script>

<template>
  <div v-if="frontmatter.layout !== false" class="Layout">
    <Header />
    <NotFound v-if="page.isNotFound" />
    <template v-else-if="isHome">
      <Content />
    </template>
    <main v-else-if="useSplitLayout && !isMembers" class="page">
      <div class="page-narrow blog-split">
        <PageTitle />
        <div class="blog-split-right">
          <article class="prose" :class="{ 'prose--post': isBlogPost }">
            <Content />
          </article>
          <template v-if="isBlogPost">
            <div class="blog-list-divider" style="margin-top:44px;" />
            <RelatedReading />
          </template>
          <PostFooterBlock v-if="showPostFooterBlock" style="margin-top:28px;" />
        </div>
      </div>
    </main>
    <main v-else class="page">
      <div class="page-narrow" :class="{ 'page-narrow--centered': isMembers }">
        <h1 v-if="frontmatter.title" class="page-title">{{ frontmatter.title }}</h1>
        <p v-if="frontmatter.subtitle" class="lede">{{ frontmatter.subtitle }}</p>
        <Content />
      </div>
    </main>
    <Footer />
  </div>
</template>

<style>
.page-narrow--centered {
  text-align: center;
}
</style>
