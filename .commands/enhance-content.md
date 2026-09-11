---
name: enhance-content
description: Comprehensive content enhancement for blog posts
usage: "cat blog-post.md | enhance-content"
example: 'cat draft.md | enhance-content --aggressive'
---

# Enhance Content

Comprehensive content enhancement for blog posts. Combines multiple enhancement operations in one pass.

## Usage

```bash
cat blog-post.md | enhance-content
cat draft.md | enhance-content --aggressive
```

## Options

- `--aggressive` - Apply more aggressive enhancements
- `--skip-links` - Skip adding hyperlinks
- `--skip-images` - Skip image enhancements
- `--formatting-only` - Only fix formatting issues

## What It Does

1. **Add hyperlinks** - Links key terms to authoritative sources
2. **Fix images** - Ensures all images have dimensions and are clickable with captions
3. **Format code blocks** - Adds proper language syntax highlighting
4. **Add table captions** - Adds descriptive captions to tables
5. **Identify asides** - Wraps appropriate content in `<aside>` tags
6. **Identify callouts** - Wraps key insights in `<callout>` tags
7. **Identify tutorials** - Wraps technical tips in `<tutorial>` tags
8. **Fix formatting** - Applies all formatting rules from CLAUDE.md

## Output

Enhanced markdown with:
- Properly formatted custom components
- Clickable images with captions and dimensions
- Hyperlinked key terms
- Formatted code blocks
- Table captions
- Consistent formatting per CLAUDE.md guidelines
- Summary of changes made
