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

export interface Frontmatter {
  title?: string
  description?: string
  subtitle?: string
  hero?: Hero
  posts?: BlogPost[]
  created_at?: string
  updated_at?: string
  tags?: string[] | string
  layout?: string
}
