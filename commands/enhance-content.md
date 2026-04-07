# Enhance Content

Comprehensive content enhancement for blog posts, ensuring all formatting and styling rules are applied.

## Usage

```bash
cat blog-post.md | enhance-content
cat my-draft.md | enhance-content --fix
cat article.md | enhance-content --check
```

## Features

- **Add Hyperlinks**: Adds links to key terms, tools, and concepts
- **Image Validation**: Ensures all images have dimensions and captions
- **Code Formatting**: Properly formats code blocks with syntax highlighting
- **Table Captions**: Adds captions to tables
- **Component Wrapping**: Identifies and wraps asides, callouts, and tutorials
- **Formatting Fixes**: Fixes formatting issues per CLAUDE.md guidelines

## What It Checks

### Images
- All images have width/height attributes
- Images are clickable links to full size
- Images have descriptive captions
- Image dimensions are in HTML comments

### Content Structure
- No H1 headers (auto-generated from frontmatter)
- Asides under 24 words
- Proper frontmatter format
- All required frontmatter fields present

### Links
- Internal links use `/blog/` (not `/p/`)
- Key terms have hyperlinks
- Links point to authoritative sources

### Code Blocks
- Language specified for syntax highlighting
- Line numbers where appropriate
- Proper indentation

## Options

- `--fix`: Automatically fix issues found
- `--check`: Only check without modifying
- `--strict`: Enforce stricter validation rules
- `--verbose`: Show detailed report of all changes

## Examples

Check blog post:
```bash
cat my-post.md | enhance-content --check
```

Auto-fix issues:
```bash
cat draft.md | enhance-content --fix > final-post.md
```

## AIL Analysis

This command also:
- Analyzes AI Influence Level (AIL)
- Adds AIL disclosure notes
- Ensures proper attribution
- Links to AIL documentation

## Integration

Use before committing blog posts:
```bash
cat cms/blog/new-post.md | enhance-content --fix
git add cms/blog/new-post.md
```
