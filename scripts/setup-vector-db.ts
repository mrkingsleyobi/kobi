#!/usr/bin/env bun

/**
 * Blog Search Vector Database Setup
 * Creates and maintains a vector index for semantic search across blog posts
 */

import { OpenAI } from "openai";
import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BLOG_DIR = join(process.cwd(), "cms/blog");
const INDEX_DIR = join(process.cwd(), ".blog-index");
const INDEX_FILE = join(INDEX_DIR, "blog-index.json");
const EMBEDDINGS_FILE = join(INDEX_DIR, "embeddings.json");

interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  tags: string[];
  created_at: string;
  excerpt: string;
}

interface Embedding {
  slug: string;
  embedding: number[];
  metadata: {
    title: string;
    tags: string[];
    created_at: string;
  };
}

async function ensureIndexDir() {
  if (!existsSync(INDEX_DIR)) {
    await mkdir(INDEX_DIR, { recursive: true });
    console.log("✓ Created index directory");
  }
}

async function extractFrontmatter(content: string): Promise<any> {
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter: any = {};
  const lines = frontmatterMatch[1].split("\n");

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      // Handle various value types
      if (value.includes("|")) {
        frontmatter[key] = value.split("|").map((v: string) => v.trim());
      } else if (value === "true" || value === "false") {
        frontmatter[key] = value === "true";
      } else if (!isNaN(Date.parse(value))) {
        frontmatter[key] = value;
      } else {
        frontmatter[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  }

  return frontmatter;
}

async function loadBlogPost(filePath: string): Promise<BlogPost | null> {
  const content = await readFile(filePath, "utf-8");
  const frontmatter = await extractFrontmatter(content);

  if (!frontmatter || frontmatter.status !== "published") {
    return null;
  }

  // Remove frontmatter from content
  const bodyContent = content.replace(/^---\n[\s\S]+?\n---\n*/, "");

  // Create excerpt (first 200 characters)
  const excerpt = bodyContent
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/`{3}[\s\S]*?`{3}/g, "") // Remove code blocks
    .replace(/`[^`]+`/g, "") // Remove inline code
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .trim()
    .substring(0, 200) + "...";

  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    subtitle: frontmatter.subtitle,
    content: bodyContent,
    tags: frontmatter.tags || [],
    created_at: frontmatter.created_at,
    excerpt,
  };
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

async function cosineSimilarity(a: number[], b: number[]): Promise<number> {
  if (a.length !== b.length) {
    throw new Error("Vectors must be same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function indexBlogs() {
  console.log("🔍 Starting blog index creation...\n");

  await ensureIndexDir();

  // Read all blog posts
  const files = await readdir(BLOG_DIR);
  const markdownFiles = files.filter((f) => f.endsWith(".md"));

  console.log(`Found ${markdownFiles.length} markdown files\n`);

  const posts: BlogPost[] = [];
  const embeddings: Embedding[] = [];

  for (const file of markdownFiles) {
    try {
      const post = await loadBlogPost(join(BLOG_DIR, file));
      if (post) {
        posts.push(post);
        console.log(`✓ Indexed: ${post.title}`);
      }
    } catch (error) {
      console.error(`✗ Error loading ${file}:`, error);
    }
  }

  console.log(`\n📊 Generating embeddings for ${posts.length} posts...\n`);

  // Generate embeddings for each post
  for (const post of posts) {
    try {
      // Combine title, subtitle, and excerpt for embedding
      const textToEmbed = `${post.title}\n${post.subtitle || ""}\n${post.excerpt}`;
      const embedding = await generateEmbedding(textToEmbed);

      embeddings.push({
        slug: post.slug,
        embedding,
        metadata: {
          title: post.title,
          tags: post.tags,
          created_at: post.created_at,
        },
      });

      console.log(`✓ Embedded: ${post.title}`);
    } catch (error) {
      console.error(`✗ Error embedding ${post.title}:`, error);
    }
  }

  // Save index
  await writeFile(INDEX_FILE, JSON.stringify(posts, null, 2));
  await writeFile(EMBEDDINGS_FILE, JSON.stringify(embeddings, null, 2));

  console.log(`\n✅ Index complete!`);
  console.log(`   - Posts: ${posts.length}`);
  console.log(`   - Embeddings: ${embeddings.length}`);
  console.log(`   - Index: ${INDEX_FILE}`);
  console.log(`   - Embeddings: ${EMBEDDINGS_FILE}\n`);

  console.log("🚀 Blog search is now ready!");
  console.log("   Ask Zoey to search your blogs using semantic queries.\n");
}

async function searchBlogs(query: string, limit: number = 5): Promise<any[]> {
  // Load embeddings
  const embeddingsData = await readFile(EMBEDDINGS_FILE, "utf-8");
  const embeddings: Embedding[] = JSON.parse(embeddingsData);

  // Load posts
  const postsData = await readFile(INDEX_FILE, "utf-8");
  const posts: BlogPost[] = JSON.parse(postsData);

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Calculate similarities
  const results = await Promise.all(
    embeddings.map(async (emb) => ({
      post: posts.find((p) => p.slug === emb.slug),
      similarity: await cosineSimilarity(queryEmbedding, emb.embedding),
    }))
  );

  // Sort by similarity and return top results
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .filter((r) => r.post)
    .map((r) => ({
      ...r.post,
      score: r.similarity,
    }));
}

// CLI interface
const command = process.argv[2];

if (command === "search") {
  const query = process.argv.slice(3).join(" ");
  if (!query) {
    console.error("Usage: bun run scripts/setup-vector-db.ts search 'your query'");
    process.exit(1);
  }

  const results = await searchBlogs(query);
  console.log("\n🔍 Search Results:\n");
  results.forEach((result, i) => {
    console.log(`${i + 1}. ${result.title}`);
    console.log(`   Score: ${result.score.toFixed(3)}`);
    console.log(`   URL: https://kingsleyobi.com/blog/${result.slug}`);
    console.log(`   Tags: ${result.tags.join(", ")}`);
    console.log(`   ${result.excerpt}\n`);
  });
} else if (command === "index" || !command) {
  indexBlogs().catch(console.error);
} else {
  console.error("Usage:");
  console.error("  bun run scripts/setup-vector-db.ts [index|search] [query]");
  process.exit(1);
}
