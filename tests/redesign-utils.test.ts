import { describe, it, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { parseFrontmatter } from '../cms/.vitepress/theme/utils/posts'
import { OFFICIAL_TAGS } from '../cms/.vitepress/theme/types'
import { primaryNav, linktree, footerSocial } from '../cms/.vitepress/theme/utils/icons'

describe('Post utils: parseFrontmatter', () => {
  it('parses valid YAML frontmatter', () => {
    const raw = `---
title: "My Post Title"
created_at: 2026-04-01
tags: ai | technology
ail: 3
---

Post content body here.`

    const parsed = parseFrontmatter(raw)
    expect(parsed.title).toBe('My Post Title')
    expect(parsed.created_at).toBe('2026-04-01')
    expect(parsed.tags).toBe('ai | technology')
    expect(parsed.ail).toBe('3')
  })

  it('returns empty object when frontmatter is missing', () => {
    const parsed = parseFrontmatter('# Just a title\nNo frontmatter here.')
    expect(parsed).toEqual({})
  })
})

describe('Official tags taxonomy', () => {
  it('contains expected tags per AGENTS.md', () => {
    expect(OFFICIAL_TAGS).toContain('top')
    expect(OFFICIAL_TAGS).toContain('ai')
    expect(OFFICIAL_TAGS).toContain('cybersecurity')
    expect(OFFICIAL_TAGS).toContain('recommended')
  })
})

describe('Redesign: icons.ts data matches the Lavish prototype', () => {
  it('primary nav has exactly the 8 items from README (no Consulting/Archives)', () => {
    expect(primaryNav).toHaveLength(8)
    expect(primaryNav.map((n) => n.label)).toEqual([
      'home', 'blog', 'telos', 'ideas', 'projects', 'predictions', 'about', 'members'
    ])
  })
  it('home linktree has exactly 19 items per README', () => {
    expect(linktree).toHaveLength(19)
  })
  it('footer/overflow/mobile-drawer share the same 7-item social row', () => {
    expect(footerSocial).toHaveLength(7)
    expect(footerSocial.map((s) => s.label)).toEqual([
      'Email', 'YouTube', 'LinkedIn', 'Twitter / X', 'GitHub', 'Podcast', 'RSS'
    ])
  })
})

describe('Regression: RSS feed blog directory resolution', () => {
  it('config.ts resolves blogDir relative to siteConfig.root (cms/), not cms/cms/blog', () => {
    const configSource = readFileSync('cms/.vitepress/config.ts', 'utf-8')
    expect(configSource).toContain("path.join(siteConfig.root, 'blog')")
    expect(configSource).not.toContain("path.join(siteConfig.root, 'cms/blog')")
  })
})
