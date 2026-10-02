export interface HeroAction {
  text: string
  link: string
}

export interface Hero {
  name?: string
  text?: string
  tagline?: string
  actions?: HeroAction[]
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags?: string[] | string
}

export interface BlogPostData {
  slug: string
  title: string
  subtitle?: string
  created_at: string
  tags: string[]
  image?: string | null
  excerpt?: string
  description?: string
  curation?: string
  author?: string
  ail?: number
}

export interface Frontmatter {
  title?: string
  description?: string
  subtitle?: string
  excerpt?: string
  hero?: Hero
  posts?: BlogPost[]
  created_at?: string
  updated_at?: string
  tags?: string[] | string
  layout?: string
  author?: string
  /** AI Influence Level (0-6). Optional — omit the badge entirely if absent. */
  ail?: number
  sidebar?: boolean
}

/** Canonical set of official blog tags, shared by Archives/BlogHome/CommandPalette. */
export const OFFICIAL_TAGS = [
  'top', 'future', 'politics', 'cybersecurity', 'reading', 'society',
  'science', 'philosophy', 'nationalsecurity', 'ai', 'culture', 'personal',
  'innovation', 'business', 'meaning', 'technology', 'ethics', 'productivity',
  'writing', 'creativity', 'tutorial', 'apple', 'recommended'
] as const
