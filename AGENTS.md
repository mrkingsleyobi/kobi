# AGENTS.md - Project-Specific Agent Guidelines

Guidelines for AI agents working on the kingsleyobi.com project. This document complements CLAUDE.md with project-specific behaviors, preferences, and context.

## Project Identity

### Website Information
- **URL:** https://kingsleyobi.com
- **Type:** Personal blog and knowledge base
- **Topics:** Cybersecurity, AI, technology, philosophy, productivity
- **Platform:** VitePress (Vue 3 + TypeScript)
- **Hosting:** Cloudflare Pages (static HTML)

### Project Philosophy
- **Production-first:** This is a LIVE website - extreme caution required
- **Quality over quantity:** Better to have fewer high-quality posts than many mediocre ones
- **Think before coding:** Planning and testing are mandatory, not optional
- **Test-driven:** Tests are written before features, not after
- **Documentation-driven:** CLAUDE.md and DESIGN.md are authoritative sources

---

## Agent Behavior Rules

### 1. ALWAYS Read CLAUDE.md First

Before doing ANY work on this project:
1. Read the full CLAUDE.md file
2. Check if custom commands exist for your task
3. Verify your approach matches documented workflows
4. Reference DESIGN.md for any visual/layout work

### 2. Never Assume Without Verification

**CRITICAL:** Never tell the owner something "is" a certain way unless you've verified it with appropriate tools:
- Use `Read` tool to check file contents
- Use `Bash` tool to run commands
- Use browser tools to verify deployed state
- Use `Grep` to search code before claiming things exist

### 3. Server Management

**Dev Server (http://localhost:5173):**
- Assume it's already running
- Check with `curl -I http://localhost:5173` or `ps aux | grep vitepress`
- If not running, start it yourself: `bun run dev &`
- NEVER ask the owner to start the server

**Production:**
- This is a LIVE website
- Extreme caution with AWS, Cloudflare, GitHub
- Always confirm before destructive actions
- Always have save/restore points for Git operations

### 4. Image Requirements

**Every single image must have:**
1. `width` and `height` attributes in HTML comment
2. Be a clickable link to full-size version
3. Have a descriptive caption
4. Use actual dimensions (use `identify` command)

### 5. Package Manager

**ALWAYS use `bun`** - NEVER use `npm`, `yarn`, or `pnpm`

### 6. Git Safety

**Before any Git operation:**
1. Check `git status` to see current state
2. Check `git log -5` to see recent commits
3. For pushes, verify remote with `git remote -v`

**For destructive operations (force push, reset, branch deletion):**
- ALWAYS ask first
- Explain what will happen
- Confirm owner approval

---

## Content Creation Guidelines

### Blog Post Structure

Every blog post must follow the structure documented in CLAUDE.md.

### Official Blog Tags

Only use these tags (pipe-separated in frontmatter):
- `top` - Curated best content
- `future` - Predictions, emerging trends
- `ai` - Artificial intelligence, ML
- `cybersecurity` - Security, hacking, vulnerabilities
- `technology` - Tech topics, tools, gadgets
- `philosophy` - Philosophical discussions
- `tutorial` - How-to guides
- And more (see CLAUDE.md for full list)

---

## Code Style Preferences

### TypeScript / JavaScript
- Use modern ES6+ syntax
- Prefer `const`/`let` over `var`
- Use arrow functions for callbacks
- TypeScript for all new code
- JSDoc comments for functions

### Shell Scripts
- Use `set -euo pipefail` for error handling
- Check dependencies at script start
- Provide helpful error messages
- Use colors for output (RED, GREEN, YELLOW)
- Exit with proper codes

---

## Testing Requirements

### Test Coverage

**Every main feature MUST have tests:**
1. Blog post rendering
2. Image processing
3. Cloudflare uploads
4. VitePress build
5. Custom component rendering

### Before Pushing

1. Run `bun run build` - must complete without errors
2. Run `bun test` - all tests must pass
3. Check `http://localhost:5173` - new content must load
4. Verify image URLs actually exist

---

## Deployment Safety

### Pre-Deployment Checklist

Before pushing to main:
- [ ] `bun run build` succeeds
- [ ] `bun test` passes
- [ ] Dev server shows new content
- [ ] Images exist in `cms/public/images/`
- [ ] No sensitive data in files (no API keys, tokens)
- [ ] Commit message is descriptive

---

## Quick Reference

### Essential Commands

```bash
# Development
bun run dev                    # Start dev server (background)
bun run build                  # Production build
bun install                    # Install dependencies

# Testing
bun test                       # Run all tests

# Images
./scripts/process-image.sh input.png output-name
./scripts/cloudflare-images.sh upload image.jpg
./scripts/cloudflare-batch-upload.sh
```

### File Locations

- Config: `cms/.vitepress/config.ts`
- Theme: `cms/.vitepress/theme/`
- Blog posts: `cms/blog/*.md`
- Images: `cms/public/images/`
- Tests: `tests/*.test.ts`
- Scripts: `scripts/*.sh`
- Commands: `.commands/*.md`
