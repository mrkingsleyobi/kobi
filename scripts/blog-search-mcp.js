#!/usr/bin/env node

/**
 * Blog Search MCP Server
 * Provides semantic search capabilities for blog posts using OpenAI embeddings
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import openai from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../cms/blog');
const INDEX_PATH = process.env.BLOG_INDEX_PATH || path.join(__dirname, '../.blog-index');

// Initialize OpenAI client
const openaiClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create server
const server = new Server(
  {
    name: 'blog-search',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Extract frontmatter and content from markdown file
 */
async function parseBlogPost(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);

  if (!frontmatterMatch) {
    return { content, frontmatter: {} };
  }

  const frontmatterStr = frontmatterMatch[1];
  const frontmatter = {};

  // Parse YAML frontmatter
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  });

  const bodyContent = content.slice(frontmatterMatch[0].length).trim();

  return {
    frontmatter,
    content: bodyContent,
    fullContent: content
  };
}

/**
 * Get all blog posts
 */
async function getAllBlogPosts() {
  const files = await fs.readdir(BLOG_DIR);
  const markdownFiles = files.filter(f => f.endsWith('.md'));

  const posts = [];
  for (const file of markdownFiles) {
    const filePath = path.join(BLOG_DIR, file);
    const { frontmatter, content } = await parseBlogPost(filePath);

    posts.push({
      slug: frontmatter.slug || file.replace('.md', ''),
      title: frontmatter.title || 'Untitled',
      subtitle: frontmatter.subtitle || '',
      tags: frontmatter.tags ? frontmatter.tags.split('|').map(t => t.trim()) : [],
      content,
      filePath
    });
  }

  return posts;
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(text) {
  const response = await openaiClient.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000), // Limit token count
  });

  return response.data[0].embedding;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a, b) {
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

/**
 * Load or build search index
 */
async function getSearchIndex() {
  try {
    const indexData = await fs.readFile(INDEX_PATH, 'utf-8');
    return JSON.parse(indexData);
  } catch (error) {
    console.error('Index not found, building new index...');
    return await buildSearchIndex();
  }
}

/**
 * Build search index from all blog posts
 */
async function buildSearchIndex() {
  const posts = await getAllBlogPosts();
  const index = {
    posts: [],
    embeddings: [],
    lastUpdated: new Date().toISOString()
  };

  console.error(`Indexing ${posts.length} blog posts...`);

  for (const post of posts) {
    const searchText = `${post.title}\n\n${post.subtitle}\n\n${post.content}`;
    const embedding = await generateEmbedding(searchText);

    index.posts.push(post);
    index.embeddings.push(embedding);

    console.error(`Indexed: ${post.title}`);
  }

  await fs.mkdir(path.dirname(INDEX_PATH), { recursive: true });
  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2));

  console.error(`Index built with ${posts.length} posts`);
  return index;
}

/**
 * Search blog posts by query
 */
async function searchBlogs(query, tags = [], limit = 5) {
  const index = await getSearchIndex();
  const queryEmbedding = await generateEmbedding(query);

  let results = index.posts.map((post, i) => ({
    post,
    similarity: cosineSimilarity(queryEmbedding, index.embeddings[i])
  }));

  // Filter by tags if specified
  if (tags.length > 0) {
    results = results.filter(({ post }) =>
      tags.some(tag => post.tags.includes(tag))
    );
  }

  // Sort by similarity and limit
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, limit);
}

/**
 * Find posts similar to a given post
 */
async function findSimilarPosts(slug, limit = 5) {
  const index = await getSearchIndex();
  const targetPost = index.posts.find(p => p.slug === slug);

  if (!targetPost) {
    return [];
  }

  const targetIndex = index.posts.indexOf(targetPost);
  const targetEmbedding = index.embeddings[targetIndex];

  let results = index.posts
    .filter((post, i) => post.slug !== slug)
    .map((post, i) => {
      const actualIndex = index.posts.indexOf(post);
      return {
        post,
        similarity: cosineSimilarity(targetEmbedding, index.embeddings[actualIndex])
      };
    });

  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, limit);
}

/**
 * Get opinions on specific topics
 */
async function getOpinions(topics, limit = 5) {
  const query = `opinions views thoughts about: ${Array(topics).join(', ')}`;
  return await searchBlogs(query, [], limit);
}

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_blogs',
        description: 'Semantic search across all blog posts. Finds posts related to a query using AI embeddings.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query to find relevant blog posts'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Optional: Filter by specific tags'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 5)',
              default: 5
            }
          },
          required: ['query']
        }
      },
      {
        name: 'get_opinions',
        description: 'Find blog posts that express opinions or views on specific topics',
        inputSchema: {
          type: 'object',
          properties: {
            topics: {
              type: 'array',
              items: { type: 'string' },
              description: 'Topics to find opinions about'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 5)',
              default: 5
            }
          },
          required: ['topics']
        }
      },
      {
        name: 'find_similar_posts',
        description: 'Find blog posts similar to a specific post using semantic similarity',
        inputSchema: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'Slug of the post to find similar posts for'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 5)',
              default: 5
            }
          },
          required: ['slug']
        }
      },
      {
        name: 'update_index',
        description: 'Rebuild the blog search index (useful after adding new posts)',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'list_posts',
        description: 'List all blog posts with metadata',
        inputSchema: {
          type: 'object',
          properties: {
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Optional: Filter by specific tags'
            }
          },
          required: []
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_blogs': {
        const results = await searchBlogs(
          args.query,
          args.tags || [],
          args.limit || 5
        );

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              query: args.query,
              results: results.map(r => ({
                title: r.post.title,
                slug: r.post.slug,
                tags: r.post.tags,
                similarity: r.similarity,
                excerpt: r.post.content.slice(0, 200) + '...'
              }))
            }, null, 2)
          }]
        };
      }

      case 'get_opinions': {
        const results = await getOpinions(
          args.topics,
          args.limit || 5
        );

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              topics: args.topics,
              results: results.map(r => ({
                title: r.post.title,
                slug: r.post.slug,
                tags: r.post.tags,
                similarity: r.similarity,
                excerpt: r.post.content.slice(0, 200) + '...'
              }))
            }, null, 2)
          }]
        };
      }

      case 'find_similar_posts': {
        const results = await findSimilarPosts(
          args.slug,
          args.limit || 5
        );

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              targetSlug: args.slug,
              results: results.map(r => ({
                title: r.post.title,
                slug: r.post.slug,
                tags: r.post.tags,
                similarity: r.similarity
              }))
            }, null, 2)
          }]
        };
      }

      case 'update_index': {
        await buildSearchIndex();

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: 'Blog search index has been rebuilt'
            }, null, 2)
          }]
        };
      }

      case 'list_posts': {
        const posts = await getAllBlogPosts();

        let filteredPosts = posts;
        if (args.tags && args.tags.length > 0) {
          filteredPosts = posts.filter(post =>
            args.tags.some(tag => post.tags.includes(tag))
          );
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              total: filteredPosts.length,
              posts: filteredPosts.map(post => ({
                title: post.title,
                slug: post.slug,
                tags: post.tags,
                excerpt: post.content.slice(0, 150) + '...'
              }))
            }, null, 2)
          }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: error.message,
          stack: error.stack
        }, null, 2)
      }],
      isError: true
    };
  }
});

// Start server
async function main() {
  console.error('Blog Search MCP Server starting...');

  // Check for required environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Blog Search MCP Server running');
}

main().catch(console.error);
