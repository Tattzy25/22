-- Seed data for AI Gateway models
-- NOTE: This seed data is specifically for the AI Gateway API only
-- Models and providers listed here may not be available through other APIs

-- Insert unique models
INSERT INTO models (name, category, capabilities, description, context_window, response_time) VALUES
  ('GPT-4', 'General/Reasoning', ARRAY['Advanced reasoning', 'Code generation', 'Creative writing', 'Problem solving'], 'Most advanced GPT model with enhanced reasoning and creativity', '128K tokens', '< 30 seconds'),
  ('GPT-3.5 Turbo', 'General/Reasoning', ARRAY['Fast responses', 'Code completion', 'Conversational AI', 'Text generation'], 'Fast and efficient model for most use cases', '16K tokens', '< 10 seconds'),
  ('GPT-4o', 'General/Reasoning', ARRAY['Multimodal', 'Real-time processing', 'Broad knowledge', 'Complex instructions'], 'Advanced multimodal model with broad knowledge and fast processing', '128K tokens', '< 20 seconds'),
  ('GPT-4o Mini', 'General/Reasoning', ARRAY['Cost-effective', 'Fast inference', 'Good balance', 'Multimodal support'], 'Cost-effective version of GPT-4o with good performance', '128K tokens', '< 15 seconds'),
  ('Claude 3 Opus', 'General/Reasoning', ARRAY['Advanced analysis', 'Long-form content', 'Research assistance', 'Complex reasoning'], 'Most capable Claude model for complex tasks', '200K tokens', '< 20 seconds'),
  ('Claude 3.5 Sonnet', 'General/Reasoning', ARRAY['Balanced performance', 'Creative writing', 'Analysis', 'Coding'], 'Balanced model for most tasks with good performance', '200K tokens', '< 15 seconds'),
  ('Claude 3.5 Haiku', 'General/Reasoning', ARRAY['Fast responses', 'Cost-effective', 'Good analysis', 'Efficient processing'], 'Fast and cost-effective model for various tasks', '200K tokens', '< 10 seconds'),
  ('Gemini 1.5 Pro', 'General/Reasoning', ARRAY['Multimodal', 'Long context', 'Code generation', 'Analysis'], 'Advanced multimodal model with long context window', '2M tokens', '< 25 seconds'),
  ('Gemini 1.5 Flash', 'General/Reasoning', ARRAY['Fast responses', 'Multimodal', 'Code completion', 'Conversational'], 'Fast multimodal model for quick tasks', '1M tokens', '< 10 seconds'),
  ('Llama 3.1 405B', 'General/Reasoning', ARRAY['Open source', 'Large context', 'Multilingual', 'Research'], 'Largest Llama model for advanced research and applications', '128K tokens', '< 45 seconds'),
  ('Llama 3.1 70B', 'General/Reasoning', ARRAY['Balanced performance', 'Open source', 'Multilingual', 'Coding'], 'Balanced Llama model for general use cases', '128K tokens', '< 30 seconds'),
  ('Mistral Large', 'General/Reasoning', ARRAY['Advanced reasoning', 'Code generation', 'Multilingual', 'Analysis'], 'Most capable Mistral model for complex tasks', '128K tokens', '< 20 seconds'),
  ('Codestral', 'Coding/Code-Assist', ARRAY['Code generation', 'Fill-in-middle', 'Code correction', 'Test generation'], 'Specialized coding model with advanced programming capabilities', '256K tokens', '< 15 seconds'),
  ('DeepSeek V3', 'General/Reasoning', ARRAY['Cost-effective', 'Fast processing', 'Good reasoning', 'Code generation'], 'Efficient and capable model with good performance', '128K tokens', '< 15 seconds'),
  ('Grok 2', 'General/Reasoning', ARRAY['Helpful responses', 'Real-time knowledge', 'Humor', 'Broad knowledge'], 'Helpful and maximally truthful AI with real-time knowledge', '128K tokens', '< 20 seconds'),
  ('Text Embedding 3 Small', 'Embedding', ARRAY['Cost-effective', 'Good performance', 'Text similarity', 'Semantic search'], 'Efficient embedding model for various text tasks', '8K tokens', 'Instant'),
  ('Text Embedding 3 Large', 'Embedding', ARRAY['High quality', 'Multilingual', 'Code embeddings', 'Complex tasks'], 'Most capable embedding model for diverse tasks', '8K tokens', 'Instant')
ON CONFLICT (name) DO NOTHING;

-- Insert model-provider relationships
-- Each model can have multiple providers with different priorities
INSERT INTO model_providers (model_id, provider, pricing, priority, is_active) VALUES
  -- GPT-4 providers
  ((SELECT id FROM models WHERE name = 'GPT-4'), 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'GPT-4'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- GPT-3.5 Turbo providers
  ((SELECT id FROM models WHERE name = 'GPT-3.5 Turbo'), 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'GPT-3.5 Turbo'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- GPT-4o providers
  ((SELECT id FROM models WHERE name = 'GPT-4o'), 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'GPT-4o'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- GPT-4o Mini providers
  ((SELECT id FROM models WHERE name = 'GPT-4o Mini'), 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'GPT-4o Mini'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Claude 3 Opus providers
  ((SELECT id FROM models WHERE name = 'Claude 3 Opus'), 'Anthropic', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Claude 3 Opus'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Claude 3.5 Sonnet providers
  ((SELECT id FROM models WHERE name = 'Claude 3.5 Sonnet'), 'Anthropic', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Claude 3.5 Sonnet'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Claude 3.5 Haiku providers
  ((SELECT id FROM models WHERE name = 'Claude 3.5 Haiku'), 'Anthropic', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Claude 3.5 Haiku'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Gemini 1.5 Pro providers
  ((SELECT id FROM models WHERE name = 'Gemini 1.5 Pro'), 'Google', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Gemini 1.5 Pro'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Gemini 1.5 Flash providers
  ((SELECT id FROM models WHERE name = 'Gemini 1.5 Flash'), 'Google', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Gemini 1.5 Flash'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Llama 3.1 405B providers
  ((SELECT id FROM models WHERE name = 'Llama 3.1 405B'), 'Meta', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Llama 3.1 405B'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Llama 3.1 70B providers
  ((SELECT id FROM models WHERE name = 'Llama 3.1 70B'), 'Meta', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Llama 3.1 70B'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Mistral Large providers
  ((SELECT id FROM models WHERE name = 'Mistral Large'), 'Mistral', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Mistral Large'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Codestral providers
  ((SELECT id FROM models WHERE name = 'Codestral'), 'Mistral', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Codestral'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- DeepSeek V3 providers
  ((SELECT id FROM models WHERE name = 'DeepSeek V3'), 'DeepSeek', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'DeepSeek V3'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Grok 2 providers
  ((SELECT id FROM models WHERE name = 'Grok 2'), 'xAI', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Grok 2'), 'AI Gateway', '{"inputTokens": "", "outputTokens": ""}', 2, true),

  -- Embedding models (typically single provider each)
  ((SELECT id FROM models WHERE name = 'Text Embedding 3 Small'), 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, true),
  ((SELECT id FROM models WHERE name = 'Text Embedding 3 Large'), 'OpenAI', '{"inputTokens": "", "outputTokens": ""}', 1, true)
ON CONFLICT (model_id, provider) DO NOTHING;