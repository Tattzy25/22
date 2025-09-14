-- Seed data for AI Gateway models (SQLite version)
-- NOTE: This seed data is specifically for the AI Gateway API only
-- Models and providers listed here may not be available through other APIs

-- Insert unique models
INSERT OR IGNORE INTO models (id, name, category, capabilities, description, context_window, response_time) VALUES
  ('gpt-4', 'GPT-4', 'General/Reasoning', '["Advanced reasoning", "Code generation", "Creative writing", "Problem solving"]', 'Most advanced GPT model with enhanced reasoning and creativity', '128K tokens', '< 30 seconds'),
  ('gpt-3-5-turbo', 'GPT-3.5 Turbo', 'General/Reasoning', '["Fast responses", "Code completion", "Conversational AI", "Text generation"]', 'Fast and efficient model for most use cases', '16K tokens', '< 10 seconds'),
  ('gpt-4o', 'GPT-4o', 'General/Reasoning', '["Multimodal", "Real-time processing", "Broad knowledge", "Complex instructions"]', 'Advanced multimodal model with broad knowledge and fast processing', '128K tokens', '< 20 seconds'),
  ('gpt-4o-mini', 'GPT-4o Mini', 'General/Reasoning', '["Cost-effective", "Fast inference", "Good balance", "Multimodal support"]', 'Cost-effective version of GPT-4o with good performance', '128K tokens', '< 15 seconds'),
  ('claude-3-opus', 'Claude 3 Opus', 'General/Reasoning', '["Advanced analysis", "Long-form content", "Research assistance", "Complex reasoning"]', 'Most capable Claude model for complex tasks', '200K tokens', '< 20 seconds'),
  ('claude-3-5-sonnet', 'Claude 3.5 Sonnet', 'General/Reasoning', '["Balanced performance", "Creative writing", "Analysis", "Coding"]', 'Balanced model for most tasks with good performance', '200K tokens', '< 15 seconds'),
  ('claude-3-5-haiku', 'Claude 3.5 Haiku', 'General/Reasoning', '["Fast responses", "Cost-effective", "Good analysis", "Efficient processing"]', 'Fast and cost-effective model for various tasks', '200K tokens', '< 10 seconds'),
  ('gemini-1-5-pro', 'Gemini 1.5 Pro', 'General/Reasoning', '["Multimodal", "Long context", "Code generation", "Analysis"]', 'Advanced multimodal model with long context window', '2M tokens', '< 25 seconds'),
  ('gemini-1-5-flash', 'Gemini 1.5 Flash', 'General/Reasoning', '["Fast responses", "Multimodal", "Code completion", "Conversational"]', 'Fast multimodal model for quick tasks', '1M tokens', '< 10 seconds'),
  ('llama-3-1-405b', 'Llama 3.1 405B', 'General/Reasoning', '["Open source", "Large context", "Multilingual", "Research"]', 'Largest Llama model for advanced research and applications', '128K tokens', '< 45 seconds'),
  ('llama-3-1-70b', 'Llama 3.1 70B', 'General/Reasoning', '["Balanced performance", "Open source", "Multilingual", "Coding"]', 'Balanced Llama model for general use cases', '128K tokens', '< 30 seconds'),
  ('mistral-large', 'Mistral Large', 'General/Reasoning', '["Advanced reasoning", "Code generation", "Multilingual", "Analysis"]', 'Most capable Mistral model for complex tasks', '128K tokens', '< 20 seconds'),
  ('codestral', 'Codestral', 'Coding/Code-Assist', '["Code generation", "Fill-in-middle", "Code correction", "Test generation"]', 'Specialized coding model with advanced programming capabilities', '256K tokens', '< 15 seconds'),
  ('deepseek-v3', 'DeepSeek V3', 'General/Reasoning', '["Cost-effective", "Fast processing", "Good reasoning", "Code generation"]', 'Efficient and capable model with good performance', '128K tokens', '< 15 seconds'),
  ('grok-2', 'Grok 2', 'General/Reasoning', '["Helpful responses", "Real-time knowledge", "Humor", "Broad knowledge"]', 'Helpful and maximally truthful AI with real-time knowledge', '128K tokens', '< 20 seconds'),
  ('text-embedding-3-small', 'Text Embedding 3 Small', 'Embedding', '["Cost-effective", "Good performance", "Text similarity", "Semantic search"]', 'Efficient embedding model for various text tasks', '8K tokens', 'Instant'),
  ('text-embedding-3-large', 'Text Embedding 3 Large', 'Embedding', '["High quality", "Multilingual", "Code embeddings", "Complex tasks"]', 'Most capable embedding model for diverse tasks', '8K tokens', 'Instant');

-- Insert model-provider relationships
-- Each model can have multiple providers with different priorities
INSERT OR IGNORE INTO model_providers (model_id, provider, pricing, priority, is_active) VALUES
  -- GPT-4 providers
  ('gpt-4', 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('gpt-4', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- GPT-3.5 Turbo providers
  ('gpt-3-5-turbo', 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('gpt-3-5-turbo', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- GPT-4o providers
  ('gpt-4o', 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('gpt-4o', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- GPT-4o Mini providers
  ('gpt-4o-mini', 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('gpt-4o-mini', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Claude 3 Opus providers
  ('claude-3-opus', 'Anthropic', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('claude-3-opus', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Claude 3.5 Sonnet providers
  ('claude-3-5-sonnet', 'Anthropic', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('claude-3-5-sonnet', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Claude 3.5 Haiku providers
  ('claude-3-5-haiku', 'Anthropic', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('claude-3-5-haiku', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Gemini 1.5 Pro providers
  ('gemini-1-5-pro', 'Google', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('gemini-1-5-pro', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Gemini 1.5 Flash providers
  ('gemini-1-5-flash', 'Google', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('gemini-1-5-flash', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Llama 3.1 405B providers
  ('llama-3-1-405b', 'Meta', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('llama-3-1-405b', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Llama 3.1 70B providers
  ('llama-3-1-70b', 'Meta', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('llama-3-1-70b', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Mistral Large providers
  ('mistral-large', 'Mistral', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('mistral-large', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Codestral providers
  ('codestral', 'Mistral', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('codestral', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- DeepSeek V3 providers
  ('deepseek-v3', 'DeepSeek', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('deepseek-v3', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Grok 2 providers
  ('grok-2', 'xAI', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('grok-2', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Text Embedding 3 Small providers
  ('text-embedding-3-small', 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('text-embedding-3-small', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1),

  -- Text Embedding 3 Large providers
  ('text-embedding-3-large', 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, 1),
  ('text-embedding-3-large', 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, 1);