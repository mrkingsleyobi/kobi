import { describe, it, expect } from 'bun:test'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * Information-architecture placeholder pages added by the redesign
 * (README "Information architecture" - Ideas, Predictions, Members,
 * Consulting) must exist with real frontmatter, and the primary nav /
 * sitemap must reference them.
 */

const ROOT = process.cwd()
const NEW_IA_PAGES = ['ideas', 'predictions', 'members', 'consulting']

describe('Redesign: new IA placeholder pages', () => {
  NEW_IA_PAGES.forEach((slug) => {
    const filePath = join(ROOT, 'cms', slug, 'index.md')

    it(`${slug}/index.md exists`, () => {
      expect(existsSync(filePath)).toBe(true)
    })

    it(`${slug}/index.md has title + subtitle frontmatter`, () => {
      const content = readFileSync(filePath, 'utf-8')
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/)
      expect(frontmatterMatch).toBeTruthy()
      expect(frontmatterMatch![1]).toMatch(/title:/)
      expect(frontmatterMatch![1]).toMatch(/subtitle:/)
    })

    it(`${slug}/index.md body clearly marks itself as a placeholder`, () => {
      const content = readFileSync(filePath, 'utf-8').toLowerCase()
      expect(content).toContain('placeholder')
    })
  })
})

describe('Redesign: primary nav includes full IA', () => {
  it('config.ts nav array lists every top-level page in the redesign IA', async () => {
    const config = await import('../cms/.vitepress/config.ts')
    const nav = (config.default as any).themeConfig.nav as Array<{ text: string; link: string }>
    const links = nav.map((n) => n.link)

    expect(links).toContain('/')
    expect(links).toContain('/blog/')
    expect(links).toContain('/telos/')
    expect(links).toContain('/ideas/')
    expect(links).toContain('/projects/')
    expect(links).toContain('/predictions/')
    expect(links).toContain('/about/')
    expect(links).toContain('/members/')
  })

  it('nav intentionally omits Consulting and Archives per README', async () => {
    const config = await import('../cms/.vitepress/config.ts')
    const nav = (config.default as any).themeConfig.nav as Array<{ text: string; link: string }>
    const links = nav.map((n) => n.link)

    expect(links).not.toContain('/consulting/')
    expect(links).not.toContain('/archives/')
  })
})

describe('Redesign: VitePress appearance/search are disabled in favor of custom components', () => {
  it('appearance toggle is disabled (custom ThemeSwitcher replaces it)', async () => {
    const config = await import('../cms/.vitepress/config.ts')
    expect((config.default as any).appearance).toBe(false)
  })

  it('no themeConfig.search block (custom CommandPalette replaces it)', async () => {
    const config = await import('../cms/.vitepress/config.ts')
    expect((config.default as any).search).toBeUndefined()
  })
})
