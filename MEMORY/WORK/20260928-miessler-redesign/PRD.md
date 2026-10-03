# kingsleyobi.com — Redesign PRD

This document is the product requirements document (PRD) for the kingsleyobi.com
redesign. It captures the finalized design spec that came out of the interactive
HTML prototype review (all review feedback has been addressed) so the design can
be implemented against a single source of truth inside this repo.

This is a documentation-only PRD. It does not itself implement any of the
described components — see `CLAUDE.md` for pointers on where component work
should land once implementation begins.

## Product summary and audience

kingsleyobi.com is the personal site and blog of Kingsley Obi, an agentic AI
systems engineer working on multi-agent orchestration, autonomous research
systems, and fraud-detection systems. The site is a VitePress + Vue 3 + TypeScript
static site (see `CLAUDE.md` for the existing tech stack and build process).

The audience is a mix of:
- Technical readers following Kingsley's work in AI/agentic systems, security,
  and engineering.
- Longer-form readers interested in his writing on technology, philosophy,
  society, and culture (the blog's tag taxonomy).
- People evaluating him professionally (recruiters, collaborators, consulting
  prospects) via About, Projects, and Consulting.

The redesign's goal is a consistent, content-forward reading experience across
all page types, unified by a shared two-column layout pattern, a persisted
light/sepia/dark theme system, and a transparency mechanism (the AIL badge) for
disclosing AI involvement in a given piece of writing.

## Information architecture

Every page below (except Home) uses the `blog-split` layout: a narrow left
sidebar and a wider right content column. See "Two-column sidebar layout
pattern" for what varies by page.

| Page | Purpose |
| :--- | :--- |
| **Home** | Landing page: intro copy plus a "linktree" panel of ~19 links out to every other property (YouTube, Blog, Newsletter, Podcast, LinkedIn, Twitter, Book a Meeting, GitHub, UL Site, Books, Projects, Vecta 3.0, Organisation 3.0, Telos, Ideas, Predictions, Daemon, RSS, Archives). |
| **Blog index** | Browsable, filterable list of all posts with pagination and a footer of share/follow/search actions. |
| **Blog post** | Single post reading view: hero image, prose body, AIL disclosure, and related-reading suggestions. |
| **Archives** | Full historical post listing with search and Year/Tag facet filters. |
| **Telos** | Kingsley's problems/missions/goals framework. |
| **Ideas** | A table of topical ideas he's tracking or exploring. |
| **Predictions** | A dated list of forecasts. |
| **Consulting** | Engagement pitch, service pillars, and a track-record timeline for prospective clients. |
| **About** | Bio prose. |
| **Projects** | Project-card grid grouped by category. |

## Two-column sidebar layout pattern

Most pages use a `blog-split` layout: a narrow left sidebar next to a wider
right content column. The sidebar's contents scale with how "alive" the page
is:

- **Static pages** (Telos, Ideas, Predictions, Consulting, About): sidebar has
  only the page's title and italic subtitle — no live elements, and no
  page kicker/H1 duplicated in the body (the right column starts directly with
  that page's distinct content: Telos blocks, Ideas table, Predictions list,
  Consulting pitch/pillars/timeline, About bio).
- **Blog index / Archives**: sidebar has title, a live subtitle (post
  count/date range for the index), and — on the blog index only — a live
  "spinner verb" plus a reading-now counter. Archives' sidebar is title/subtitle
  only, no live elements.
- **Blog post**: sidebar shows that specific post's title, subtitle/excerpt,
  created date, tags, author, an AIL badge, a spinner verb, and a reading-now
  count.
- **Projects**: sidebar shows title/subtitle, created date, tags, and author
  (no reading-now count).
- **Home** is the one exception: it does not use the sidebar layout at all —
  it's a two-column grid of intro copy and the linktree panel instead.

## Theme system

Three persisted, user-switchable themes, controlled from a theme switcher in
the footer (rendered as color-dot swatches, not a dropdown):

1. **Normal** — light theme.
2. **Sepia** — warm, paper-like reading theme.
3. **Dusk** — dark theme.

The chosen theme persists across visits (a stored preference) and applies
site-wide, not per-page.

## AIL badge concept

Every blog post's sidebar can show an **AI Influence Level (AIL)** badge: a
dark mark plus a tinted six-segment fill rail, modeled on Daniel Miessler's AIL
framework. It's a transparency scale disclosing how much AI was involved in
producing that specific piece of content, from:

- **AIL 0** — human created, no AI involvement, through to
- **AIL 6** — AI initiated, no human involvement.

The badge is an optional field on a post (see Content model) and renders in the
post sidebar alongside the other frontmatter-derived metadata.

## Key interactive components

- **Command palette** — a search icon in the header opens a ⌘K modal command
  palette for site-wide search/navigation.
- **Mobile drawer** — the mobile hamburger icon (three uneven-length lines,
  tapering from the left — visually distinct from the header's three-dot
  overflow icon) opens a full-screen drawer containing the nav links plus a
  search/social row pinned to the bottom.
- **Filter chips** — on the blog index, chip-style filters (All / Must /
  Recommended / Top), each showing a live count, let readers narrow the
  "Latest Content" list.
- **Pagination** — used on both the blog index and Archives listings.
- **Related Reading** — a rounded card at the end of a blog post (light
  background, uppercase heading) listing five related post title+arrow rows
  separated by dividers.
- **Share/Follow/Search footer block** — repeated at the bottom of the blog
  index and each blog post: a Share row (labeled pill buttons — Post,
  LinkedIn, Hacker News, Reddit, Facebook, Forward), a Follow row (labeled
  pill buttons with icons — Get the Newsletter, Follow on X, Subscribe on
  YouTube, Follow on LinkedIn), and a search box.
- **Global footer** — separate from the above, site-wide, centered/stacked:
  copyright, a social icon row, then the Normal/Sepia/Dusk theme switcher.
- **Header** — wordmark on the left; primary nav (home / blog / telos / ideas
  / projects / predictions / about / members — no Consulting or Archives
  links in the header nav) right-aligned flush against the search icon; an
  overflow (three-dot) menu next to the search icon holding just the social
  icon row.

## Content model

A blog post's frontmatter drives both the article and its sidebar rendering.
Fields referenced by the redesign:

| Field | Notes |
| :--- | :--- |
| `title` | Post title, shown in the sidebar and as the page heading. |
| `excerpt` / subtitle | Short italic subtitle in the sidebar; also used as the excerpt text in list rows on the blog index/Archives. |
| `date` (created) | Shown in the sidebar; also drives the blog index's live date-range subtitle and Archives' Year facet. |
| `tags` | Shown in the sidebar and as hashtag-style tags on list rows; drives Archives' Tag facet. See `CLAUDE.md` for the canonical tag list. |
| `author` | Shown in the sidebar (blog post and Projects pages). |
| AIL level (optional) | Drives the AIL badge in the sidebar; omitted posts show no badge. |

This document intentionally does not expand scope beyond what was described
in the finished prototype and its review history — see `CLAUDE.md` for how
this maps onto the existing VitePress content/build pipeline once
implementation begins.
