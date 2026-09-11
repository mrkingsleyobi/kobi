<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface StatsData {
  totalPosts: number
  dateRange: string
  yearsActive: string
}

const stats = ref<StatsData>({
  totalPosts: 0,
  dateRange: '',
  yearsActive: ''
})
const loading = ref(true)

onMounted(async () => {
  try {
    // Dynamically import all blog post metadata
    const blogModules = import.meta.glob('/blog/*.md', { as: 'raw' })

    const dates: Date[] = []

    for (const path in blogModules) {
      const content = await blogModules[path]()
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/)

      if (frontmatterMatch) {
        const frontmatter: any = {}
        const lines = frontmatterMatch[1].split('\n')

        for (const line of lines) {
          const match = line.match(/^(\w+):\s*(.+)$/)
          if (match) {
            const [, key, value] = match
            frontmatter[key] = value.replace(/^["']|["']$/g, '')
          }
        }

        // Only count published posts
        if (frontmatter.status === 'published') {
          const createdDate = new Date(frontmatter.created_at)
          if (!isNaN(createdDate.getTime())) {
            dates.push(createdDate)
          }
        }
      }
    }

    if (dates.length > 0) {
      const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())))
      const newestDate = new Date(Math.max(...dates.map(d => d.getTime())))

      const yearsDiff = newestDate.getFullYear() - oldestDate.getFullYear()
      const monthsDiff = newestDate.getMonth() - oldestDate.getMonth()
      const totalMonths = yearsDiff * 12 + monthsDiff
      const yearsDecimal = (totalMonths / 12).toFixed(2)

      stats.value = {
        totalPosts: dates.length,
        dateRange: `${oldestDate.getFullYear()} — ${newestDate.getFullYear()}`,
        yearsActive: yearsDecimal
      }
    }
  } catch (error) {
    console.error('Error loading content stats:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="!loading && stats.totalPosts > 0" class="content-stats">
    <div class="stats-container">
      <div class="stats-intro">This is some of my favorite, most popular, and latest content. You can also browse and search the archives.</div>
      <div class="stats-text">
        <span class="stats-number">{{ stats.totalPosts }}</span>
        <span class="stats-label">essays, articles, and tutorials on multiple topics spanning</span>
        <span class="stats-number">{{ stats.yearsActive }}</span>
        <span class="stats-label">years</span>
      </div>
      <div class="stats-date-range">{{ stats.dateRange }}</div>
    </div>
  </div>
</template>

<style scoped>
.content-stats {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 32px;
  padding: 0 20px;
}

.stats-container {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 20px 32px;
  text-align: center;
}

.stats-intro {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin-bottom: 16px;
  font-style: italic;
}

.stats-text {
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  margin-bottom: 12px;
}

.stats-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin: 0 4px;
}

.stats-label {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
}

.stats-date-range {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .content-stats {
    padding: 0 16px;
    margin-bottom: 24px;
  }

  .stats-container {
    padding: 20px 24px;
  }

  .stats-text {
    font-size: 1rem;
  }

  .stats-number {
    font-size: 1.25rem;
  }

  .stats-label {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .content-stats {
    padding: 0 12px;
  }

  .stats-container {
    padding: 16px 20px;
  }

  .stats-text {
    font-size: 0.9375rem;
  }

  .stats-number {
    font-size: 1.125rem;
  }

  .stats-label {
    font-size: 0.9375rem;
  }
}
</style>
