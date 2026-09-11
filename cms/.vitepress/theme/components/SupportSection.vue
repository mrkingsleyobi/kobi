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
  <div v-if="!loading">
    <div class="donation-box">
      <h2 class="donation-heading">supporting = loving</h2>
      <div class="donation-divider"></div>
      <p class="donation-intro">
        For <strong>{{ formatYears(supportConfig.yearsActive) }} years</strong> I've been creating ad-free technical tutorials and essays here.
        This is a one-person effort that's also my livelihood. If it makes your day easier or more pleasant in any way,
        please consider supporting the work with a monthly or one-time donation.
      </p>
      <p class="donation-intro">
        It helps me make more content, and is deeply appreciated as well. 🫶🏼
      </p>

      <div class="donation-columns">
        <div class="donation-column donation-column--monthly">
            <h4 class="column-heading">Monthly Support</h4>
            <div class="column-divider"></div>
            <div class="tier-list">
              <a href="#" target="_blank" rel="noopener"
                v-for="amount in supportConfig.monthlyTiers"
                :key="`monthly-${amount}`"
                class="tier-link"
              >
                <span class="tier-heart">♥</span> ${{ amount }}
              </a>
            </div>
        </div>

        <div class="donation-column">
            <h4 class="column-heading">One-Time Support</h4>
            <div class="column-divider"></div>
            <div class="tier-list">
              <a href="#" target="_blank" rel="noopener"
                v-for="amount in supportConfig.oneTimeTiers"
                :key="`onetime-${amount}`"
                class="tier-link"
              >
                <span class="tier-heart">♥</span> ${{ amount }}
              </a>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donation-box {
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    margin: 2rem 0
}

.thanks-banner {
    background: var(--vp-c-green-soft);
    color: var(--vp-c-green-1);
    padding: .75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    font-family: concourse-t3,-apple-system,BlinkMacSystemFont,sans-serif;
    font-size: .875rem;
    text-align: center
}

.donation-heading {
    font-family: equity-text-a,Georgia,serif;
    font-size: .9375rem;
    font-weight: 300;
    color: var(--vp-c-text-2);
    margin: 0 0 .2rem;
    letter-spacing: -.01em
}

.donation-divider {
    width: 100%;
    height: 1px;
    background: var(--vp-c-divider);
    margin-bottom: .625rem
}

.donation-intro {
    font-family: equity-text-a,Georgia,serif;
    font-size: .6875rem;
    line-height: 1.6;
    color: var(--vp-c-text-2);
    margin: 0 0 1rem
}

.donation-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 0
}

.donation-column {
    min-width: 0
}

.donation-column--monthly {
    text-align: right
}

.donation-column--monthly .tier-link {
    justify-content: flex-end
}

.column-heading {
    font-family: concourse-t3,-apple-system,BlinkMacSystemFont,sans-serif;
    font-size: .5625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--vp-c-text-2);
    margin: 0 0 .2rem
}

.column-divider {
    width: 100%;
    height: 1px;
    background: var(--vp-c-divider);
    margin-bottom: .75rem
}

.tier-list {
    display: flex;
    flex-direction: column;
    gap: .125rem
}

.tier-link {
    display: inline-flex;
    align-items: center;
    gap: .3rem;
    font-family: equity-text-a,Georgia,serif;
    font-size: .6875rem;
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color .15s ease;
    padding: 0
}

.tier-link:hover {
    color: var(--vp-c-text-1)
}

.tier-heart {
    color: var(--vp-c-text-3);
    font-size: .625rem;
    transition: color .15s ease
}

.tier-link:hover .tier-heart {
    color: var(--vp-c-red-1)
}

@media (max-width: 640px) {
    .donation-box {
        padding:1.25rem
    }

    .donation-columns {
        grid-template-columns: 1fr;
        gap: 1.25rem
    }

    .donation-column--monthly {
        text-align: left
    }

    .donation-column--monthly .tier-link {
        justify-content: flex-start
    }

    .donation-heading {
        font-size: .8125rem
    }

    .donation-intro {
        font-size: .625rem
    }
}



</style>
