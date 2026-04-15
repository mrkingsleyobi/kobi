<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props {
  currentTags: string[]
  currentPath: string
}

const props = defineProps<Props>()

interface RelatedPost {
  title: string
  path: string
  tags: string[]
  created_at: string
}

const relatedPosts = ref<RelatedPost[]>([])

// Find related posts based on shared tags
const findRelatedPosts = async () => {
  if (!props.currentTags.length) return

  try {
    // In a real implementation, this would query your blog search MCP
    // For now, we'll create a simple implementation
    const allPosts: RelatedPost[] = []

    // This is a placeholder - in real implementation you'd query your blog index
    const samplePosts = [
      {
        title: 'Building AI Systems',
        path: '/blog/building-ai-systems',
        tags: ['ai', 'technology', 'recommended'],
        created_at: '2025-04-10'
      },
      {
        title: 'Deep Work in Age of Distraction',
        path: '/blog/deep-work-in-age-of-distraction',
        tags: ['productivity', 'personal', 'philosophy'],
        created_at: '2025-04-05'
      }
    ]

    // Filter posts that share at least one tag
    const related = samplePosts.filter(post =>
      post.path !== props.currentPath.replace('.md', '') &&
      post.tags.some(tag => props.currentTags.includes(tag))
    )

    // Sort by number of shared tags and limit to 5
    relatedPosts.value = related
      .sort((a, b) => {
        const aSharedTags = a.tags.filter(tag => props.currentTags.includes(tag)).length
        const bSharedTags = b.tags.filter(tag => props.currentTags.includes(tag)).length
        return bSharedTags - aSharedTags
      })
      .slice(0, 5)
  } catch (error) {
    console.error('Error finding related posts:', error)
  }
}

onMounted(() => {
  findRelatedPosts()
})
</script>

<template>
  <div class="related-posts">
    <h4 class="related-title">Related Posts</h4>

    <div v-if="relatedPosts.length" class="related-list">
      <a
        v-for="post in relatedPosts"
        :key="post.path"
        :href="post.path"
        class="related-post"
      >
        <div class="post-title">{{ post.title }}</div>
        <div class="post-meta">
          {{ new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) }}
        </div>
      </a>
    </div>

    <div v-else class="no-related">
      <p>No related posts found</p>
    </div>
  </div>
</template>

<style scoped>
.related-posts {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 16px;
}

.related-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-post {
  display: block;
  text-decoration: none;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.related-post:hover {
  background: var(--vp-c-bg-soft-hover);
}

.post-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  line-height: 1.4;
}

.post-meta {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.no-related {
  padding: 8px 0;
  text-align: center;
}

.no-related p {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin: 0;
}

@media (max-width: 768px) {
  .related-posts {
    padding: 12px;
  }

  .related-title {
    font-size: 13px;
  }

  .post-title {
    font-size: 12px;
  }

  .post-meta {
    font-size: 10px;
  }
}
</style>