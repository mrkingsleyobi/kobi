import { describe, it, expect } from 'bun:test'

describe('VitePress Configuration', () => {
  it('should have valid config file', async () => {
    const config = await import('../cms/.vitepress/config.ts')
    expect(config.default).toBeDefined()
  })

  it('should have correct site metadata', async () => {
    const config = await import('../cms/.vitepress/config.ts')
    const siteConfig = config.default

    expect(siteConfig.title).toBe('Kingsley Obi')
    expect(siteConfig.description).toContain('Cybersecurity')
    expect(siteConfig.lang).toBe('en-US')
  })
})
