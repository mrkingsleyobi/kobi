#!/usr/bin/env bun
/**
 * PAI Inference Tool
 *
 * Centralized AI inference for PAI system.
 * Usage: bun Tools/Inference.ts <mode> <prompt>
 *
 * Modes:
 *   - fast: Quick, cost-effective inference (haiku)
 *   - standard: Balanced performance (sonnet)
 *   - smart: Maximum quality (opus)
 *
 * @module Tools/Inference
 */

import Anthropic from '@anthropic-ai/sdk';

// Mode configurations
const MODELS = {
  fast: {
    model: 'claude-haiku-4-5-20251001' as const,
    maxTokens: 4096,
    temperature: 0.7,
  },
  standard: {
    model: 'claude-sonnet-4-6' as const,
    maxTokens: 8192,
    temperature: 0.7,
  },
  smart: {
    model: 'claude-opus-4-6' as const,
    maxTokens: 16384,
    temperature: 0.7,
  },
} as const;

type InferenceMode = keyof typeof MODELS;

interface InferenceOptions {
  system?: string;
  maxTokens?: number;
  temperature?: number;
  jsonMode?: boolean;
  stream?: boolean;
}

interface InferenceResult {
  content: string;
  model: string;
  tokensUsed: {
    input: number;
    output: number;
  };
  mode: InferenceMode;
}

/**
 * Validate API key is available
 */
function validateApiKey(): string {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY or CLAUDE_API_KEY environment variable is required');
    process.exit(1);
  }

  return apiKey;
}

/**
 * Parse command line arguments
 */
function parseArgs(): { mode: InferenceMode; prompt: string } {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error(`
Usage: bun Tools/Inference.ts <mode> <prompt>

Modes:
  fast      - Quick, cost-effective inference (Haiku 4.5)
  standard  - Balanced performance (Sonnet 4.6)
  smart     - Maximum quality (Opus 4.6)

Examples:
  bun Tools/Inference.ts fast "Summarize this text"
  bun Tools/Inference.ts standard "Write a blog post about AI"
  cat prompt.txt | bun Tools/Inference.ts smart -
`);
    process.exit(1);
  }

  const mode = args[0] as InferenceMode;
  const prompt = args[1];

  if (!MODELS[mode]) {
    console.error(`ERROR: Invalid mode "${mode}". Valid modes: ${Object.keys(MODELS).join(', ')}`);
    process.exit(1);
  }

  return { mode, prompt };
}

/**
 * Read prompt from file or stdin
 */
async function readPrompt(promptArg: string): Promise<string> {
  if (promptArg === '-') {
    // Read from stdin
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks).toString('utf-8');
  }

  // Check if it's a file path
  try {
    await import('fs/promises').then(fs => fs.readFile(promptArg, 'utf-8'));
  } catch {
    // Not a file, return as-is
    return promptArg;
  }

  // It's a file
  return await import('fs/promises').then(fs => fs.readFile(promptArg, 'utf-8'));
}

/**
 * Run inference with specified mode
 */
async function runInference(
  mode: InferenceMode,
  prompt: string,
  options: InferenceOptions = {}
): Promise<InferenceResult> {
  const apiKey = validateApiKey();
  const config = MODELS[mode];

  const client = new Anthropic({
    apiKey,
  });

  const requestOptions = {
    model: config.model,
    maxTokens: options.maxTokens || config.maxTokens,
    temperature: options.temperature ?? config.temperature,
    system: options.system,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  try {
    const response = await client.messages.create(requestOptions);

    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return {
      content,
      model: response.model,
      tokensUsed: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
      mode,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`ERROR: ${error.message}`);
      if (error.message.includes('API key')) {
        console.error('\nPlease set ANTHROPIC_API_KEY environment variable');
      }
    }
    throw error;
  }
}

/**
 * Format inference result for output
 */
function formatResult(result: InferenceResult): void {
  console.log(result.content);

  if (process.env.DEBUG || process.env.VERBOSE) {
    console.error('\n---', {
      model: result.model,
      mode: result.mode,
      tokens: result.tokensUsed,
    });
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const { mode, prompt: promptArg } = parseArgs();
  const prompt = await readPrompt(promptArg);

  const result = await runInference(mode, prompt);
  formatResult(result);
}

// Export for use as a module
export { MODELS, type InferenceMode, type InferenceOptions, type InferenceResult, runInference };

// Run if called directly
if (import.meta.main) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
