#!/usr/bin/env bun
/**
 * Fabric Alternative - TypeScript Implementation
 *
 * Provides fabric-like functionality for PAI system without requiring Python.
 * Focuses on the patterns used in CLAUDE.md:
 * - sanitize_markdown: Clean HTML from migrated blog posts
 * - image generation: Generate images using available APIs
 *
 * Usage: bun scripts/fabric-alt.ts <pattern> [options]
 */

import Anthropic from '@anthropic-ai/sdk';

// Pattern implementations
const PATTERNS = {
  sanitize_markdown: sanitizeMarkdown,
  enhance_content: enhanceContent,
  summarize_text: summarizeText,
  extract_tags: extractTags,
} as const;

type PatternName = keyof typeof PATTERNS;

/**
 * Sanitize markdown by removing problematic HTML and fixing formatting
 */
async function sanitizeMarkdown(content: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY required for sanitization');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  const prompt = `Clean and sanitize this markdown content. Your task:
1. Remove all embedded HTML except allowed tags (see below)
2. Fix broken image URLs (convert beehiiv/assets.kingsleyobi.com paths to /images/)
3. Convert internal links from /p/ to /blog/
4. Fix markdown formatting issues
5. Preserve frontmatter exactly as-is
6. Convert HTML elements to markdown where appropriate

Allowed HTML tags:
- <caption> for image captions
- <aside> for short asides (max 24 words)
- <callout> for emphasized content
- <blockquote> with <cite> for quotes
- <tutorial> for tutorial-style content
- <definition> with <term>, <description>, <usage>, <cite> for definitions
- <bottomNote> for end notes
- <XEmbed> for social media embeds
- <div class="video-container"> for videos

Return ONLY the sanitized markdown, no explanation.

Content to sanitize:
${content}`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      maxTokens: 16384,
      messages: [{ role: 'user', content: prompt }],
    });

    const sanitizedContent = response.content
      .filter(block => block.type === 'text')
      .map(block => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return sanitizedContent;
  } catch (error) {
    console.error('ERROR: Failed to sanitize markdown:', error);
    throw error;
  }
}

/**
 * Enhance blog post content with links, formatting, and structure
 */
async function enhanceContent(content: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY required for enhancement');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  const prompt = `Enhance this blog post content. Your task:
1. Add relevant hyperlinks to key terms, tools, products, or concepts (only in body text, not headers)
2. Ensure all images have width/height attributes in HTML comments
3. Make images clickable with captions
4. Add language syntax highlighting to code blocks
5. Add captions to tables
6. Identify and wrap asides, callouts, and tutorials in appropriate tags
7. Fix formatting issues per VitePress best practices

Do NOT modify:
- Frontmatter
- The actual content meaning or voice
- Image paths or URLs

Return ONLY the enhanced markdown, no explanation.

Content to enhance:
${content}`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      maxTokens: 16384,
      messages: [{ role: 'user', content: prompt }],
    });

    const enhancedContent = response.content
      .filter(block => block.type === 'text')
      .map(block => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return enhancedContent;
  } catch (error) {
    console.error('ERROR: Failed to enhance content:', error);
    throw error;
  }
}

/**
 * Summarize text content
 */
async function summarizeText(content: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY required for summarization');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  const prompt = `Summarize the following content concisely, capturing the key points and main ideas. Keep it under 200 words.

Content:
${content}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = response.content
      .filter(block => block.type === 'text')
      .map(block => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return summary;
  } catch (error) {
    console.error('ERROR: Failed to summarize text:', error);
    throw error;
  }
}

/**
 * Extract relevant tags from content
 */
async function extractTags(content: string): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY required for tag extraction');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  const officialTags = [
    'top', 'future', 'politics', 'cybersecurity', 'reading', 'society',
    'science', 'philosophy', 'nationalsecurity', 'ai', 'culture', 'personal',
    'innovation', 'business', 'meaning', 'technology', 'ethics', 'productivity',
    'writing', 'creativity', 'tutorial', 'apple', 'recommended'
  ];

  const prompt = `Analyze this content and extract 3-5 relevant tags from this official list:
${officialTags.join(', ')}

Return ONLY a comma-separated list of tags, no explanation.

Content:
${content}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 100,
      messages: [{ role: 'user', content: prompt }],
    });

    const tagsText = response.content
      .filter(block => block.type === 'text')
      .map(block => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return tagsText.split(',').map(t => t.trim()).filter(t => officialTags.includes(t));
  } catch (error) {
    console.error('ERROR: Failed to extract tags:', error);
    throw error;
  }
}

/**
 * Read content from stdin or file
 */
async function readContent(inputArg: string): Promise<string> {
  if (inputArg === '-') {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks).toString('utf-8');
  }

  try {
    return await Bun.file(inputArg).text();
  } catch {
    return inputArg;
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error(`
Usage: bun scripts/fabric-alt.ts <pattern> [input]

Patterns:
  sanitize_markdown    - Clean HTML and fix formatting in markdown
  enhance_content      - Add links, formatting, and structure
  summarize_text       - Generate concise summary
  extract_tags         - Extract relevant tags from content

Input:
  -                    - Read from stdin
  <filename>           - Read from file
  <text>               - Use text directly

Examples:
  cat post.md | bun scripts/fabric-alt.ts sanitize_markdown -
  bun scripts/fabric-alt.ts enhance_content post.md
  echo "Some text" | bun scripts/fabric-alt.ts summarize_text -
`);
    process.exit(1);
  }

  const patternName = args[0] as PatternName;
  const inputArg = args[1] || '-';

  if (!PATTERNS[patternName]) {
    console.error(`ERROR: Unknown pattern "${patternName}"`);
    console.error(`Available patterns: ${Object.keys(PATTERNS).join(', ')}`);
    process.exit(1);
  }

  const content = await readContent(inputArg);
  const result = await PATTERNS[patternName](content);

  console.log(result);
}

// Run if called directly
if (import.meta.main) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export { sanitizeMarkdown, enhanceContent, summarizeText, extractTags };
