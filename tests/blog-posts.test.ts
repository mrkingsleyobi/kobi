import { describe, it, expect } from 'bun:test'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const BLOG_DIR = join(process.cwd(), 'cms/blog')

describe('Blog Posts', () => {
  const blogFiles = readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') && f !== 'index.md')

  blogFiles.forEach(file => {
    const content = readFileSync(join(BLOG_DIR, file), 'utf-8')
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/)

    describe(`${file}`, () => {
      it('should have valid frontmatter', () => {
        expect(frontmatterMatch).toBeTruthy()
      })

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

        it('should have required frontmatter fields', () => {
          expect(frontmatter.slug).toBeTruthy()
          expect(frontmatter.title).toBeTruthy()
          expect(frontmatter.created_at).toBeTruthy()
          expect(frontmatter.tags).toBeTruthy()
          expect(frontmatter.status).toBe('published')
        })

        it('should have hero image as first element', () => {
          const bodyContent = content.replace(/^---\n[\s\S]+?\n---\n*/, '')
          const firstImageMatch = bodyContent.match(/^!\[.*?\]\(.*?\)/)

          expect(firstImageMatch).toBeTruthy()
        })

        it('should have AIL disclosure', () => {
          expect(content).toContain('AIL Level')
          expect(content).toContain('AI Disclosure')
        })
      }
    })
  })
})
