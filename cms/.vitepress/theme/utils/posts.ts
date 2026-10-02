import type { BlogPostData } from '../types'

/**
 * Parse a raw markdown file's YAML-ish frontmatter block into a plain object.
 * Mirrors the lightweight line-based parser already used by BlogHome/Archives/
 * ArchivesList so all consumers agree on the same (simple, non-nested) format.
 */
export function parseFrontmatter(content: string): Record<string, string> {
  const frontmatter: Record<string, string> = {}
  const match = content.match(/^---\n([\s\S]+?)\n---/)
  if (!match) return frontmatter

  for (const line of match[1].split('\n')) {
    const lineMatch = line.match(/^(\w+):\s*(.+)$/)
    if (lineMatch) {
      const [, key, value] = lineMatch
      frontmatter[key] = value.replace(/^["']|["']$/g, '')
    }
  }
  return frontmatter
}

/**
 * Load and parse every blog post under cms/blog/*.md (excluding index.md)
 * via Vite's import.meta.glob, returning normalized BlogPostData sorted
 * newest-first.
 */
export async function loadAllPosts(): Promise<BlogPostData[]> {
  const blogModules = import.meta.glob('/blog/*.md', { query: '?raw', import: 'default' }) as Record<
    string,
    () => Promise<string>
  >

  const postData: BlogPostData[] = []

  for (const path in blogModules) {
    const content = await blogModules[path]()
    const frontmatter = parseFrontmatter(content)

    const slug = path.split('/').pop()?.replace('.md', '') || ''
    if (slug === 'index') continue
    if (frontmatter.status && frontmatter.status !== 'published') continue

    const imageMatch = content.match(/!\[.*?\]\((\/images\/.+?\.(jpg|png|jpeg|gif|webp))\)/)
    const image = imageMatch ? imageMatch[1] : null

    const afterFrontmatter = content.replace(/^---[\s\S]*?---\n\n/, '')
    const firstParagraph = afterFrontmatter
      .split('\n')
      .find((line) => line.trim() && !line.trim().startsWith('!') && !line.trim().startsWith('#'))

    postData.push({
      slug,
      title: frontmatter.title || 'Untitled',
      subtitle: frontmatter.subtitle || '',
      excerpt: frontmatter.excerpt || frontmatter.subtitle || firstParagraph?.trim() || '',
      created_at: frontmatter.created_at || '',
      tags: frontmatter.tags ? frontmatter.tags.split('|').map((t) => t.trim()) : [],
      image,
      description: frontmatter.description || '',
      curation: frontmatter.curation || undefined,
      author: frontmatter.author || 'Kingsley Obi',
      ail: frontmatter.ail !== undefined ? Number(frontmatter.ail) : undefined
    })
  }

  postData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return postData
}
