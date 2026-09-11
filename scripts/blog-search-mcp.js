#!/usr/bin/env node

const { OpenAI } = require('openai');
const fs = require('fs').promises;
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BLOG_INDEX_PATH = process.env.BLOG_INDEX_PATH || path.join(process.cwd(), '.blog-index');

// Tools available
const tools = {
  search_blogs: {
    name: "search_blogs",
    description: "Semantic search across all blog posts to find relevant content",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query for finding relevant blog content"
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 5)",
          default: 5
        }
      },
      required: ["query"]
    }
  },
  get_opinions: {
    name: "get_opinions",
    description: "Find Kingsley's opinions on specific topics",
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "Topic to find opinions on"
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default: 5)",
          default: 5
        }
      },
      required: ["topic"]
    }
  },
  find_similar_posts: {
    name: "find_similar_posts",
    description: "Find blog posts similar to a given post or topic",
    inputSchema: {
      type: "object",
      properties: {
        post_slug: {
          type: "string",
          description: "Slug of the post to find similar content for"
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default: 3)",
          default: 3
        }
      },
      required: ["post_slug"]
    }
  },
  update_index: {
    name: "update_index",
    description: "Update the blog search index with current content",
    inputSchema: {
      type: "object",
      properties: {
        force: {
          type: "boolean",
          description: "Force re-index even if index exists",
          default: false
        }
      }
    }
  }
};

// MCP Server implementation
async function main() {
  const stdin = process.stdin;
  const stdout = process.stdout;

  stdin.setEncoding('utf8');

  let buffer = '';
  stdin.on('data', (chunk) => {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const message = JSON.parse(line);
        handleRequest(message).then((response) => {
          stdout.write(JSON.stringify(response) + '\n');
        });
      } catch (error) {
        console.error('Error handling request:', error);
      }
    }
  });
}

async function handleRequest(message) {
  const { method, params, id } = message;

  switch (method) {
    case 'tools/list':
      return { id, result: { tools: Object.values(tools) } };

    case 'tools/call':
      const { name, arguments: args } = params;
      return { id, result: await callTool(name, args) };

    case 'initialize':
      return { id, result: { protocolVersion: '2024-11-05', capabilities: {} } };

    default:
      return { id, error: { code: -32601, message: 'Method not found' } };
  }
}

async function callTool(name, args) {
  switch (name) {
    case 'search_blogs':
      return await searchBlogs(args.query, args.limit);
    case 'get_opinions':
      return await getOpinions(args.topic, args.limit);
    case 'find_similar_posts':
      return await findSimilarPosts(args.post_slug, args.limit);
    case 'update_index':
      return await updateIndex(args.force);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchBlogs(query, limit = 5) {
  // For now, return placeholder
  // TODO: Implement actual semantic search
  return {
    content: [{
      type: "text",
      text: `Search results for: ${query}\n\nBlog search MCP is configured but index not yet built.\nRun: bun run scripts/setup-vector-db.ts`
    }]
  };
}

async function getOpinions(topic, limit = 5) {
  return {
    content: [{
      type: "text",
      text: `Opinions on: ${topic}\n\nBlog search MCP is configured but index not yet built.\nRun: bun run scripts/setup-vector-db.ts`
    }]
  };
}

async function findSimilarPosts(postSlug, limit = 3) {
  return {
    content: [{
      type: "text",
      text: `Similar to: ${postSlug}\n\nBlog search MCP is configured but index not yet built.\nRun: bun run scripts/setup-vector-db.ts`
    }]
  };
}

async function updateIndex(force = false) {
  return {
    content: [{
      type: "text",
      text: "Index update started. Run: bun run scripts/setup-vector-db.ts"
    }]
  };
}

main().catch(console.error);
