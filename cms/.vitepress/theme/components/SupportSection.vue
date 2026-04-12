<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface SupportConfig {
  monthlyTiers: number[]
  oneTimeTiers: number[]
  yearsActive: string
}

const supportConfig = ref<SupportConfig>({
  monthlyTiers: [5, 10, 25, 50, 100],
  oneTimeTiers: [5, 10, 25, 50, 100],
  yearsActive: '0'
})
const loading = ref(true)

onMounted(async () => {
  try {
    // Calculate years active from blog posts
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

      supportConfig.value.yearsActive = (totalMonths / 12).toFixed(4)
    }
  } catch (error) {
    console.error('Error loading support data:', error)
  } finally {
    loading.value = false
  }
})

const formatYears = (years: string) => {
  const yearsNum = parseFloat(years)
  return yearsNum === Math.floor(yearsNum) ? Math.floor(yearsNum).toString() : yearsNum
}
</script>

<template>
  <div v-if="!loading" class="support-section">
    <div class="support-container">
      <h3 class="support-title">supporting = loving</h3>
      <p class="support-intro">
        For <strong>{{ formatYears(supportConfig.yearsActive) }} years</strong> I've been creating ad-free technical tutorials and essays here.
        This is a one-person effort that's also my livelihood. If it makes your day easier or more pleasant in any way,
        please consider supporting the work with a monthly or one-time donation.
      </p>
      <p class="support-appreciation">
        It helps me make more content, and is deeply appreciated as well. 🫶🏼
      </p>

      <div class="support-tiers">
        <div class="tier-group">
          <h4 class="tier-title">Monthly Support</h4>
          <div class="tier-buttons">
            <button
              v-for="amount in supportConfig.monthlyTiers"
              :key="`monthly-${amount}`"
              class="tier-btn"
            >
              ♥ ${{ amount }}
            </button>
          </div>
        </div>

        <div class="tier-group">
          <h4 class="tier-title">One-Time Support</h4>
          <div class="tier-buttons">
            <button
              v-for="amount in supportConfig.oneTimeTiers"
              :key="`onetime-${amount}`"
              class="tier-btn"
            >
              ♥ ${{ amount }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.support-section {
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.support-container {
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
}

.support-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
}

.support-intro {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 12px;
}

.support-appreciation {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin-bottom: 24px;
}

.support-tiers {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tier-group {
  text-align: left;
}

.tier-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
}

.tier-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tier-btn {
  padding: 10px 20px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tier-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

@media (max-width: 768px) {
  .support-section {
    padding: 0 16px;
  }

  .support-container {
    padding: 24px;
  }

  .support-title {
    font-size: 1.25rem;
  }

  .tier-buttons {
    justify-content: center;
  }

  .tier-group {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .support-section {
    padding: 0 12px;
    margin: 32px auto;
  }

  .support-container {
    padding: 20px;
  }

  .tier-btn {
    padding: 8px 16px;
    font-size: 0.8125rem;
  }
}
</style>
