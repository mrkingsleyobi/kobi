---
name: add-links
description: Add hyperlinks to key terms in blog posts
usage: "cat blog-post.md | add-links"
example: 'cat technical-post.md | add-links --max-links 15'
---

# Add Links

Automatically identify and add hyperlinks to key terms, tools, products, and concepts in blog posts. Researches official/authoritative links.

## Usage

```bash
cat blog-post.md | add-links
cat technical-post.md | add-links --max-links 15
```

## Options

- `--max-links <n>` - Maximum number of links to add (default: 10)
- `--skip-existing` - Don't add links to terms that already have them
- `--authoritative-only` - Only link to official/authoritative sources

## What It Links

- Technical tools and frameworks
- Companies and products
- Standards and specifications
- Documentation and official resources
- Well-known concepts (with authoritative explanations)

## What It Skips

- Header text (titles, subtitles)
- Common words and phrases
- Terms already hyperlinked
- Proper nouns of people (unless widely known)

## Output

Enhanced markdown with:
- Hyperlinks added to key terms in body text
- Links point to official/authoritative sources
- Existing links preserved unchanged
- List of added links at end for review
