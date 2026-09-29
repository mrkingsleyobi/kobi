import { describe, it, expect } from 'bun:test'
import { parseFrontmatter } from '../cms/.vitepress/theme/utils/posts'
import { OFFICIAL_TAGS } from '../cms/.vitepress/theme/types'

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
