// Central registry of supported provider/model pairs for the AI Hub
// The modelId should match the AI Gateway identifier: `${provider}/${model}` when applicable.

export type HubModel = {
  provider: string;
  model: string; // provider-specific model name (without provider prefix)
  id: string; // fully qualified id used with AI Gateway (provider/model)
};

export const HUB_MODELS: HubModel[] = [
  // xAI Grok
  { provider: 'xai', model: 'grok-4', id: 'xai/grok-4' },
  { provider: 'xai', model: 'grok-3', id: 'xai/grok-3' },
  { provider: 'xai', model: 'grok-3-fast', id: 'xai/grok-3-fast' },
  { provider: 'xai', model: 'grok-3-mini', id: 'xai/grok-3-mini' },
  { provider: 'xai', model: 'grok-3-mini-fast', id: 'xai/grok-3-mini-fast' },
  { provider: 'xai', model: 'grok-2-1212', id: 'xai/grok-2-1212' },
  { provider: 'xai', model: 'grok-2-vision-1212', id: 'xai/grok-2-vision-1212' },
  { provider: 'xai', model: 'grok-beta', id: 'xai/grok-beta' },
  { provider: 'xai', model: 'grok-vision-beta', id: 'xai/grok-vision-beta' },

  // Vercel
  { provider: 'vercel', model: 'v0-1.0-md', id: 'vercel/v0-1.0-md' },

  // OpenAI
  { provider: 'openai', model: 'gpt-5', id: 'openai/gpt-5' },
  { provider: 'openai', model: 'gpt-5-mini', id: 'openai/gpt-5-mini' },
  { provider: 'openai', model: 'gpt-5-nano', id: 'openai/gpt-5-nano' },
  { provider: 'openai', model: 'gpt-5-chat-latest', id: 'openai/gpt-5-chat-latest' },

  // Anthropic
  { provider: 'anthropic', model: 'claude-opus-4-latest', id: 'anthropic/claude-opus-4-latest' },
  { provider: 'anthropic', model: 'claude-sonnet-4-latest', id: 'anthropic/claude-sonnet-4-latest' },
  { provider: 'anthropic', model: 'claude-3-7-sonnet-latest', id: 'anthropic/claude-3-7-sonnet-latest' },
  { provider: 'anthropic', model: 'claude-3-5-sonnet-latest', id: 'anthropic/claude-3-5-sonnet-latest' },
  { provider: 'anthropic', model: 'claude-3-5-haiku-latest', id: 'anthropic/claude-3-5-haiku-latest' },

  // Mistral
  { provider: 'mistral', model: 'pixtral-large-latest', id: 'mistral/pixtral-large-latest' },
  { provider: 'mistral', model: 'mistral-large-latest', id: 'mistral/mistral-large-latest' },
  { provider: 'mistral', model: 'mistral-medium-latest', id: 'mistral/mistral-medium-latest' },
  { provider: 'mistral', model: 'mistral-medium-2505', id: 'mistral/mistral-medium-2505' },
  { provider: 'mistral', model: 'mistral-small-latest', id: 'mistral/mistral-small-latest' },
  { provider: 'mistral', model: 'pixtral-12b-2409', id: 'mistral/pixtral-12b-2409' },

  // Google Gen AI
  { provider: 'google', model: 'gemini-2.0-flash-exp', id: 'google/gemini-2.0-flash-exp' },
  { provider: 'google', model: 'gemini-1.5-flash', id: 'google/gemini-1.5-flash' },
  { provider: 'google', model: 'gemini-1.5-pro', id: 'google/gemini-1.5-pro' },

  // Google Vertex
  { provider: 'vertex', model: 'gemini-2.0-flash-exp', id: 'vertex/gemini-2.0-flash-exp' },
  { provider: 'vertex', model: 'gemini-1.5-flash', id: 'vertex/gemini-1.5-flash' },
  { provider: 'vertex', model: 'gemini-1.5-pro', id: 'vertex/gemini-1.5-pro' },

  // DeepSeek
  { provider: 'deepseek', model: 'deepseek-chat', id: 'deepseek/deepseek-chat' },
  { provider: 'deepseek', model: 'deepseek-reasoner', id: 'deepseek/deepseek-reasoner' },

  // Cerebras
  { provider: 'cerebras', model: 'llama3.1-8b', id: 'cerebras/llama3.1-8b' },
  { provider: 'cerebras', model: 'llama3.1-70b', id: 'cerebras/llama3.1-70b' },
  { provider: 'cerebras', model: 'llama3.3-70b', id: 'cerebras/llama3.3-70b' },

  // Groq
  { provider: 'groq', model: 'meta-llama/llama-4-scout-17b-16e-instruct', id: 'groq/meta-llama/llama-4-scout-17b-16e-instruct' },
  { provider: 'groq', model: 'llama-3.3-70b-versatile', id: 'groq/llama-3.3-70b-versatile' },
  { provider: 'groq', model: 'llama-3.1-8b-instant', id: 'groq/llama-3.1-8b-instant' },
  { provider: 'groq', model: 'mixtral-8x7b-32768', id: 'groq/mixtral-8x7b-32768' },
  { provider: 'groq', model: 'gemma2-9b-it', id: 'groq/gemma2-9b-it' },
];

export function resolveModelId(input: {
  model?: string; // may be fully qualified like "openai/gpt-5" or just the model name
  provider?: string; // optional provider
}): string | null {
  const { model, provider } = input;
  if (!model) return null;

  // Pass-through fully qualified ids
  if (model.includes('/')) return model;

  if (provider) {
    const found = HUB_MODELS.find(
      (m) => m.provider.toLowerCase() === provider.toLowerCase() && m.model === model
    );
    return found?.id || null;
  }

  // Try to find a unique match by model name across providers
  const matches = HUB_MODELS.filter((m) => m.model === model);
  if (matches.length === 1) return matches[0].id;
  return null;
}
