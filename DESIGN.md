# DESIGN.md - Kingsley Obi Website Design System

Complete visual and structural design language for kingsleyobi.com. This document defines the design system that all theme components and page layouts must follow.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Typography System](#typography-system)
3. [Layout & Spacing](#layout--spacing)
4. [Color Palette](#color-palette)
5. [Component Specifications](#component-specifications)
6. [Responsive Breakpoints](#responsive-breakpoints)
7. [Anti-Patterns](#anti-patterns)

---

## Core Principles

### 1. Standard Document Flow
- **Header:** Shared across all pages, **NOT fixed** - uses standard document flow
- **Navigation:** Top-level nav in header, context-aware secondary nav where appropriate
- **Content:** Flows naturally without fixed positioning overlays
- **Footer:** Standard flow at bottom of document

### 2. Typography-First Design
- Switchable body fonts with proper line-height per font
- Display fonts for headings and titles
- Proper scale (1.25-1.5) between heading levels
- Maximum line length (~70 characters) for readability

### 3. Custom Elements via Vue Components
- Use defined Vue components for special formatting
- No raw HTML in markdown content
- Components handle their own styling and behavior

### 4. Performance-First Images
- **ALL images must have width and height attributes** to prevent layout shift
- Images are clickable links to full-size versions
- All images have captions for context
- Lazy loading enabled

### 5. Mobile-First Responsive
- Design for mobile first, enhance for desktop
- Two main breakpoints: 520px and 1000px
- Touch-friendly targets (min 44x44px)

---

## Typography System

### Font Families

#### Display Font (Headings & Titles)
- **Font:** Custom display font (configure in VitePress theme)
- **Usage:** H1-H6, page titles, section headers
- **Weights:** 600 (semibold) for H1-H2, 500 (medium) for H3-H6

#### Body Font (Prose)
- **Font:** Switchable - user can select preferred font
- **Options:** System UI, Sans-serif, Serif
- **Line-height:** 1.6 for sans-serif, 1.7 for serif
- **Optimized:** For extended reading sessions

#### Monospace Font (Code)
- **Font:** `Fira Code`, `Monaco`, `Consolas`, monospace fallback
- **Features:** Ligatures for common programming symbols
- **Size:** 0.9em relative to body text

### Typography Scale

| Element | Size | Line-height | Weight | Usage |
|---------|------|-------------|--------|-------|
| H1 | 2.5rem (40px) | 1.2 | 600 | Page titles |
| H2 | 2rem (32px) | 1.3 | 600 | Section headers |
| H3 | 1.5rem (24px) | 1.4 | 500 | Subsections |
| H4 | 1.25rem (20px) | 1.4 | 500 | Component titles |
| Body | 1rem (16px) | 1.6/1.7* | 400 | Prose |
| Small | 0.875rem (14px) | 1.5 | 400 | Metadata, captions |

*1.6 for sans-serif, 1.7 for serif

---

## Layout & Spacing

### Container Widths

| Context | Max-width | Padding | Notes |
|---------|-----------|---------|-------|
| Desktop prose | 720px | 2rem | ~70 characters optimal |
| Desktop wide | 1200px | 2rem | For complex layouts |
| Tablet | 100% | 1.5rem | Fluid between 520-1000px |
| Mobile | 100% | 1rem | Below 520px |

### Spacing Scale

Base unit: 0.25rem (4px)

- **xxs:** 0.25rem (4px) - Tight spacing
- **xs:** 0.5rem (8px) - Compact spacing
- **sm:** 0.75rem (12px) - Default element spacing
- **md:** 1rem (16px) - Section spacing
- **lg:** 1.5rem (24px) - Large sections
- **xl:** 2rem (32px) - Page margins
- **xxl:** 3rem (48px) - Hero spacing

---

## Color Palette

### Primary Colors

| Name | CSS Variable | Hex | Usage |
|------|--------------|-----|-------|
| Primary | `--c-primary` | #3c8772 | Primary actions, links |
| Secondary | `--c-secondary` | #8f3468 | Accents, highlights |
| Background | `--c-bg` | #1a1a2e | Page background |
| Surface | `--c-surface` | #152130 | Cards, code blocks |
| Text | `--c-text` | #e4e4e7 | Body text |
| Text-muted | `--c-text-muted` | #a1a1aa | Secondary text |

---

## Component Specifications

### Custom Vue Components

All components are located in `cms/.vitepress/theme/components/`.

#### Callout.vue
**Purpose:** Key idea callouts with left border

**Spec:**
- Left border: 4px solid `--c-primary`
- Background: `--c-surface` with slight opacity
- Padding: 1rem
- Border-radius: 4px

#### Definition.vue
**Purpose:** Term/description/citation blocks

**Spec:**
- Term: Bold, display font
- Description: Regular body text
- Usage: Italic, code font for examples
- Citation: Small, right-aligned

#### TopicTitle.vue
**Purpose:** Page titles with display font styling

**Spec:**
- Display font, 2.5rem (H1 size)
- No bottom margin
- Responsive: scales to 2rem on mobile

---

## Responsive Breakpoints

### Breakpoint System

| Name | Min-width | Max-width | Target devices |
|------|-----------|-----------|----------------|
| Mobile | 0 | 519px | Phones, small tablets |
| Tablet | 520px | 999px | Tablets, small laptops |
| Desktop | 1000px | ∞ | Desktops, large screens |

### Mobile-Specific Rules

#### Below 520px (Mobile)
- Stack all layouts vertically
- Remove floats and sidebars
- Reduce font sizes by ~20%
- Full-width containers (no padding on sides)
- Touch targets min 44x44px

---

## Anti-Patterns

### ❌ Don't Do These

1. **Fixed positioning header** - Header is in standard document flow, not `position: fixed`
2. **Images without dimensions** - Every image must have `width` and `height` attributes
3. **Inline styles in markdown** - Use Vue components instead
4. **Raw HTML for common patterns** - Use components or markdown syntax
5. **Ignoring mobile** - Always test at 320px width minimum
6. **Hard-coded colors** - Use CSS variables from theme
7. **Skipping alt text** - All images need descriptive alt text
8. **Clickable images without visual indication** - Hover effects on clickable images
9. **Captions without context** - Captions should describe, not just name
10. **H1 in content** - H1 auto-generated from frontmatter title

### ✅ Do These Instead

1. Use `<TopicTitle>` for page titles
2. Always specify image dimensions in HTML comments
3. Use `<callout>`, `<aside>`, `<tutorial>` for notes
4. Use proper markdown syntax (`> [!TIP]`, `==highlight==`)
5. Design mobile-first, enhance for desktop
6. Use CSS variables (`--c-primary`, `--c-text`, etc.)
7. Write descriptive alt text for screen readers
8. Make images clickable with captions
9. Provide context in captions (why this image matters)
10. Start content at H2, let frontmatter handle H1
