-- Provider-Specific Tables Migration
-- Large providers (4+ models): Separate tables
-- Small providers (1-3 models): One shared table
-- Eliminates foreign key constraints and improves query performance
-- Note: Model capabilities are handled separately to avoid FK constraints

-- Anthropic Models (8 models) - Dedicated Table
CREATE TABLE IF NOT EXISTS anthropic_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO anthropic_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('anthropic/claude-3-haiku', 'anthropic/claude-3-haiku', 'Claude 3 Haiku', 'Anthropic Claude 3 Haiku - AI model available through Vercel AI Gateway', 'Anthropic', 'anthropic/claude-3-haiku', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO anthropic_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('anthropic/claude-3-opus', 'anthropic/claude-3-opus', 'Claude 3 Opus', 'Anthropic Claude 3 Opus - AI model available through Vercel AI Gateway', 'Anthropic', 'anthropic/claude-3-opus', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO anthropic_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('anthropic/claude-3.5-haiku', 'anthropic/claude-3.5-haiku', 'Claude 3.5 Haiku', 'Anthropic Claude 3.5 Haiku - AI model available through Vercel AI Gateway', 'Anthropic', 'anthropic/claude-3.5-haiku', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO anthropic_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('anthropic/claude-3.5-sonnet', 'anthropic/claude-3.5-sonnet', 'Claude 3.5 Sonnet', 'Anthropic Claude 3.5 Sonnet - AI model available through Vercel AI Gateway', 'Anthropic', 'anthropic/claude-3.5-sonnet', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO anthropic_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('anthropic/claude-3.7-sonnet', 'anthropic/claude-3.7-sonnet', 'Claude 3.7 Sonnet', 'Anthropic Claude 3.7 Sonnet - AI model available through Vercel AI Gateway', 'Anthropic', 'anthropic/claude-3.7-sonnet', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO anthropic_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('anthropic/claude-opus-4', 'anthropic/claude-opus-4', 'Claude Opus 4', 'Anthropic Claude Opus 4 - AI model available through Vercel AI Gateway', 'Anthropic', 'anthropic/claude-opus-4', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO anthropic_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('anthropic/claude-opus-4.1', 'anthropic/claude-opus-4.1', 'Claude Opus 4.1', 'Anthropic Claude Opus 4.1 - AI model available through Vercel AI Gateway', 'Anthropic', 'anthropic/claude-opus-4.1', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO anthropic_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('anthropic/claude-sonnet-4', 'anthropic/claude-sonnet-4', 'Claude Sonnet 4', 'Anthropic Claude Sonnet 4 - AI model available through Vercel AI Gateway', 'Anthropic', 'anthropic/claude-sonnet-4', 'https://gateway.ai.vercel.com/v1');

-- Google DeepMind Models (10 models) - Dedicated Table
CREATE TABLE IF NOT EXISTS google_deepmind_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/gemini-2.0-flash', 'google/gemini-2.0-flash', 'Gemini 2.0 Flash', 'Google DeepMind Gemini 2.0 Flash - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/gemini-2.0-flash', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/gemini-2.0-flash-lite', 'google/gemini-2.0-flash-lite', 'Gemini 2.0 Flash Lite', 'Google DeepMind Gemini 2.0 Flash Lite - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/gemini-2.0-flash-lite', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/gemini-2.5-flash', 'google/gemini-2.5-flash', 'Gemini 2.5 Flash', 'Google DeepMind Gemini 2.5 Flash - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/gemini-2.5-flash', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/gemini-2.5-flash-image-preview', 'google/gemini-2.5-flash-image-preview', 'Gemini 2.5 Flash Image Preview', 'Google DeepMind Gemini 2.5 Flash Image Preview - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/gemini-2.5-flash-image-preview', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/gemini-2.5-flash-lite', 'google/gemini-2.5-flash-lite', 'Gemini 2.5 Flash Lite', 'Google DeepMind Gemini 2.5 Flash Lite - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/gemini-2.5-flash-lite', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/gemini-2.5-pro', 'google/gemini-2.5-pro', 'Gemini 2.5 Pro', 'Google DeepMind Gemini 2.5 Pro - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/gemini-2.5-pro', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/gemini-embedding-001', 'google/gemini-embedding-001', 'Gemini Embedding 001', 'Google DeepMind Gemini Embedding 001 - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/gemini-embedding-001', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/gemma-2-9b', 'google/gemma-2-9b', 'Gemma 2 9b', 'Google DeepMind Gemma 2 9b - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/gemma-2-9b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/text-embedding-005', 'google/text-embedding-005', 'Text Embedding 005', 'Google DeepMind Text Embedding 005 - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/text-embedding-005', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO google_deepmind_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('google/text-multilingual-embedding-002', 'google/text-multilingual-embedding-002', 'Text Multilingual Embedding 002', 'Google DeepMind Text Multilingual Embedding 002 - AI model available through Vercel AI Gateway', 'Google DeepMind', 'google/text-multilingual-embedding-002', 'https://gateway.ai.vercel.com/v1');

-- OpenAI Models (20 models) - Dedicated Table
CREATE TABLE IF NOT EXISTS openai_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-3.5-turbo', 'openai/gpt-3.5-turbo', 'Gpt 3.5 Turbo', 'OpenAI Gpt 3.5 Turbo - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-3.5-turbo', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-3.5-turbo-instruct', 'openai/gpt-3.5-turbo-instruct', 'Gpt 3.5 Turbo Instruct', 'OpenAI Gpt 3.5 Turbo Instruct - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-3.5-turbo-instruct', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-4-turbo', 'openai/gpt-4-turbo', 'Gpt 4 Turbo', 'OpenAI Gpt 4 Turbo - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-4-turbo', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-4.1', 'openai/gpt-4.1', 'Gpt 4.1', 'OpenAI Gpt 4.1 - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-4.1', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-4.1-mini', 'openai/gpt-4.1-mini', 'Gpt 4.1 Mini', 'OpenAI Gpt 4.1 Mini - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-4.1-mini', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-4.1-nano', 'openai/gpt-4.1-nano', 'Gpt 4.1 Nano', 'OpenAI Gpt 4.1 Nano - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-4.1-nano', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-4o', 'openai/gpt-4o', 'Gpt 4o', 'OpenAI Gpt 4o - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-4o', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-4o-mini', 'openai/gpt-4o-mini', 'Gpt 4o Mini', 'OpenAI Gpt 4o Mini - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-4o-mini', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-5', 'openai/gpt-5', 'Gpt 5', 'OpenAI Gpt 5 - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-5', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-5-mini', 'openai/gpt-5-mini', 'Gpt 5 Mini', 'OpenAI Gpt 5 Mini - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-5-mini', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-5-nano', 'openai/gpt-5-nano', 'Gpt 5 Nano', 'OpenAI Gpt 5 Nano - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-5-nano', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-oss-120b', 'openai/gpt-oss-120b', 'Gpt Oss 120b', 'OpenAI Gpt Oss 120b - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-oss-120b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/gpt-oss-20b', 'openai/gpt-oss-20b', 'Gpt Oss 20b', 'OpenAI Gpt Oss 20b - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/gpt-oss-20b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/o1', 'openai/o1', 'O1', 'OpenAI O1 - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/o1', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/o3', 'openai/o3', 'O3', 'OpenAI O3 - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/o3', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/o3-mini', 'openai/o3-mini', 'O3 Mini', 'OpenAI O3 Mini - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/o3-mini', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/o4-mini', 'openai/o4-mini', 'O4 Mini', 'OpenAI O4 Mini - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/o4-mini', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/text-embedding-3-large', 'openai/text-embedding-3-large', 'Text Embedding 3 Large', 'OpenAI Text Embedding 3 Large - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/text-embedding-3-large', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/text-embedding-3-small', 'openai/text-embedding-3-small', 'Text Embedding 3 Small', 'OpenAI Text Embedding 3 Small - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/text-embedding-3-small', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO openai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('openai/text-embedding-ada-002', 'openai/text-embedding-ada-002', 'Text Embedding Ada 002', 'OpenAI Text Embedding Ada 002 - AI model available through Vercel AI Gateway', 'OpenAI', 'openai/text-embedding-ada-002', 'https://gateway.ai.vercel.com/v1');

-- alibaba Models (7 models) - Dedicated Table
CREATE TABLE IF NOT EXISTS alibaba_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO alibaba_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('alibaba/qwen-3-14b', 'alibaba/qwen-3-14b', 'Qwen 3 14b', 'alibaba Qwen 3 14b - AI model available through Vercel AI Gateway', 'alibaba', 'alibaba/qwen-3-14b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO alibaba_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('alibaba/qwen-3-235b', 'alibaba/qwen-3-235b', 'Qwen 3 235b', 'alibaba Qwen 3 235b - AI model available through Vercel AI Gateway', 'alibaba', 'alibaba/qwen-3-235b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO alibaba_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('alibaba/qwen-3-30b', 'alibaba/qwen-3-30b', 'Qwen 3 30b', 'alibaba Qwen 3 30b - AI model available through Vercel AI Gateway', 'alibaba', 'alibaba/qwen-3-30b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO alibaba_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('alibaba/qwen-3-32b', 'alibaba/qwen-3-32b', 'Qwen 3 32b', 'alibaba Qwen 3 32b - AI model available through Vercel AI Gateway', 'alibaba', 'alibaba/qwen-3-32b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO alibaba_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('alibaba/qwen3-coder', 'alibaba/qwen3-coder', 'Qwen3 Coder', 'alibaba Qwen3 Coder - AI model available through Vercel AI Gateway', 'alibaba', 'alibaba/qwen3-coder', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO alibaba_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('alibaba/qwen3-max', 'alibaba/qwen3-max', 'Qwen3 Max', 'alibaba Qwen3 Max - AI model available through Vercel AI Gateway', 'alibaba', 'alibaba/qwen3-max', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO alibaba_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('alibaba/qwen3-next-80b-a3b-instruct', 'alibaba/qwen3-next-80b-a3b-instruct', 'Qwen3 Next 80b A3b Instruct', 'alibaba Qwen3 Next 80b A3b Instruct - AI model available through Vercel AI Gateway', 'alibaba', 'alibaba/qwen3-next-80b-a3b-instruct', 'https://gateway.ai.vercel.com/v1');

-- deepseek Models (6 models) - Dedicated Table
CREATE TABLE IF NOT EXISTS deepseek_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO deepseek_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('deepseek/deepseek-r1', 'deepseek/deepseek-r1', 'Deepseek R1', 'deepseek Deepseek R1 - AI model available through Vercel AI Gateway', 'deepseek', 'deepseek/deepseek-r1', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO deepseek_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('deepseek/deepseek-r1-distill-llama-70b', 'deepseek/deepseek-r1-distill-llama-70b', 'Deepseek R1 Distill Llama 70b', 'deepseek Deepseek R1 Distill Llama 70b - AI model available through Vercel AI Gateway', 'deepseek', 'deepseek/deepseek-r1-distill-llama-70b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO deepseek_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('deepseek/deepseek-v3', 'deepseek/deepseek-v3', 'Deepseek V3', 'deepseek Deepseek V3 - AI model available through Vercel AI Gateway', 'deepseek', 'deepseek/deepseek-v3', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO deepseek_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('deepseek/deepseek-v3.1', 'deepseek/deepseek-v3.1', 'Deepseek V3.1', 'deepseek Deepseek V3.1 - AI model available through Vercel AI Gateway', 'deepseek', 'deepseek/deepseek-v3.1', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO deepseek_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('deepseek/deepseek-v3.1-base', 'deepseek/deepseek-v3.1-base', 'Deepseek V3.1 Base', 'deepseek Deepseek V3.1 Base - AI model available through Vercel AI Gateway', 'deepseek', 'deepseek/deepseek-v3.1-base', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO deepseek_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('deepseek/deepseek-v3.1-thinking', 'deepseek/deepseek-v3.1-thinking', 'Deepseek V3.1 Thinking', 'deepseek Deepseek V3.1 Thinking - AI model available through Vercel AI Gateway', 'deepseek', 'deepseek/deepseek-v3.1-thinking', 'https://gateway.ai.vercel.com/v1');

-- meta Models (11 models) - Dedicated Table
CREATE TABLE IF NOT EXISTS meta_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-3-70b', 'meta/llama-3-70b', 'Llama 3 70b', 'meta Llama 3 70b - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-3-70b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-3-8b', 'meta/llama-3-8b', 'Llama 3 8b', 'meta Llama 3 8b - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-3-8b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-3.1-70b', 'meta/llama-3.1-70b', 'Llama 3.1 70b', 'meta Llama 3.1 70b - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-3.1-70b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-3.1-8b', 'meta/llama-3.1-8b', 'Llama 3.1 8b', 'meta Llama 3.1 8b - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-3.1-8b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-3.2-11b', 'meta/llama-3.2-11b', 'Llama 3.2 11b', 'meta Llama 3.2 11b - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-3.2-11b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-3.2-1b', 'meta/llama-3.2-1b', 'Llama 3.2 1b', 'meta Llama 3.2 1b - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-3.2-1b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-3.2-3b', 'meta/llama-3.2-3b', 'Llama 3.2 3b', 'meta Llama 3.2 3b - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-3.2-3b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-3.2-90b', 'meta/llama-3.2-90b', 'Llama 3.2 90b', 'meta Llama 3.2 90b - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-3.2-90b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-3.3-70b', 'meta/llama-3.3-70b', 'Llama 3.3 70b', 'meta Llama 3.3 70b - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-3.3-70b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-4-maverick', 'meta/llama-4-maverick', 'Llama 4 Maverick', 'meta Llama 4 Maverick - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-4-maverick', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO meta_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meta/llama-4-scout', 'meta/llama-4-scout', 'Llama 4 Scout', 'meta Llama 4 Scout - AI model available through Vercel AI Gateway', 'meta', 'meta/llama-4-scout', 'https://gateway.ai.vercel.com/v1');

-- mistral Models (13 models) - Dedicated Table
CREATE TABLE IF NOT EXISTS mistral_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/codestral', 'mistral/codestral', 'Codestral', 'mistral Codestral - AI model available through Vercel AI Gateway', 'mistral', 'mistral/codestral', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/codestral-embed', 'mistral/codestral-embed', 'Codestral Embed', 'mistral Codestral Embed - AI model available through Vercel AI Gateway', 'mistral', 'mistral/codestral-embed', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/devstral-small', 'mistral/devstral-small', 'Devstral Small', 'mistral Devstral Small - AI model available through Vercel AI Gateway', 'mistral', 'mistral/devstral-small', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/magistral-medium', 'mistral/magistral-medium', 'Magistral Medium', 'mistral Magistral Medium - AI model available through Vercel AI Gateway', 'mistral', 'mistral/magistral-medium', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/magistral-small', 'mistral/magistral-small', 'Magistral Small', 'mistral Magistral Small - AI model available through Vercel AI Gateway', 'mistral', 'mistral/magistral-small', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/ministral-3b', 'mistral/ministral-3b', 'Ministral 3b', 'mistral Ministral 3b - AI model available through Vercel AI Gateway', 'mistral', 'mistral/ministral-3b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/mistral-embed', 'mistral/mistral-embed', 'Mistral Embed', 'mistral Mistral Embed - AI model available through Vercel AI Gateway', 'mistral', 'mistral/mistral-embed', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/mistral-large', 'mistral/mistral-large', 'Mistral Large', 'mistral Mistral Large - AI model available through Vercel AI Gateway', 'mistral', 'mistral/mistral-large', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/mistral-medium', 'mistral/mistral-medium', 'Mistral Medium', 'mistral Mistral Medium - AI model available through Vercel AI Gateway', 'mistral', 'mistral/mistral-medium', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/mistral-small', 'mistral/mistral-small', 'Mistral Small', 'mistral Mistral Small - AI model available through Vercel AI Gateway', 'mistral', 'mistral/mistral-small', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/mixtral-8x22b-instruct', 'mistral/mixtral-8x22b-instruct', 'Mixtral 8x22b Instruct', 'mistral Mixtral 8x22b Instruct - AI model available through Vercel AI Gateway', 'mistral', 'mistral/mixtral-8x22b-instruct', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/pixtral-12b', 'mistral/pixtral-12b', 'Pixtral 12b', 'mistral Pixtral 12b - AI model available through Vercel AI Gateway', 'mistral', 'mistral/pixtral-12b', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO mistral_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('mistral/pixtral-large', 'mistral/pixtral-large', 'Pixtral Large', 'mistral Pixtral Large - AI model available through Vercel AI Gateway', 'mistral', 'mistral/pixtral-large', 'https://gateway.ai.vercel.com/v1');

-- voyage Models (7 models) - Dedicated Table
CREATE TABLE IF NOT EXISTS voyage_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO voyage_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('voyage/voyage-3-large', 'voyage/voyage-3-large', 'Voyage 3 Large', 'voyage Voyage 3 Large - AI model available through Vercel AI Gateway', 'voyage', 'voyage/voyage-3-large', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO voyage_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('voyage/voyage-3.5', 'voyage/voyage-3.5', 'Voyage 3.5', 'voyage Voyage 3.5 - AI model available through Vercel AI Gateway', 'voyage', 'voyage/voyage-3.5', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO voyage_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('voyage/voyage-3.5-lite', 'voyage/voyage-3.5-lite', 'Voyage 3.5 Lite', 'voyage Voyage 3.5 Lite - AI model available through Vercel AI Gateway', 'voyage', 'voyage/voyage-3.5-lite', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO voyage_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('voyage/voyage-code-2', 'voyage/voyage-code-2', 'Voyage Code 2', 'voyage Voyage Code 2 - AI model available through Vercel AI Gateway', 'voyage', 'voyage/voyage-code-2', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO voyage_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('voyage/voyage-code-3', 'voyage/voyage-code-3', 'Voyage Code 3', 'voyage Voyage Code 3 - AI model available through Vercel AI Gateway', 'voyage', 'voyage/voyage-code-3', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO voyage_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('voyage/voyage-finance-2', 'voyage/voyage-finance-2', 'Voyage Finance 2', 'voyage Voyage Finance 2 - AI model available through Vercel AI Gateway', 'voyage', 'voyage/voyage-finance-2', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO voyage_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('voyage/voyage-law-2', 'voyage/voyage-law-2', 'Voyage Law 2', 'voyage Voyage Law 2 - AI model available through Vercel AI Gateway', 'voyage', 'voyage/voyage-law-2', 'https://gateway.ai.vercel.com/v1');

-- xai Models (8 models) - Dedicated Table
CREATE TABLE IF NOT EXISTS xai_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO xai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('xai/grok-2', 'xai/grok-2', 'Grok 2', 'xai Grok 2 - AI model available through Vercel AI Gateway', 'xai', 'xai/grok-2', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO xai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('xai/grok-2-vision', 'xai/grok-2-vision', 'Grok 2 Vision', 'xai Grok 2 Vision - AI model available through Vercel AI Gateway', 'xai', 'xai/grok-2-vision', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO xai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('xai/grok-3', 'xai/grok-3', 'Grok 3', 'xai Grok 3 - AI model available through Vercel AI Gateway', 'xai', 'xai/grok-3', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO xai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('xai/grok-3-fast', 'xai/grok-3-fast', 'Grok 3 Fast', 'xai Grok 3 Fast - AI model available through Vercel AI Gateway', 'xai', 'xai/grok-3-fast', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO xai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('xai/grok-3-mini', 'xai/grok-3-mini', 'Grok 3 Mini', 'xai Grok 3 Mini - AI model available through Vercel AI Gateway', 'xai', 'xai/grok-3-mini', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO xai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('xai/grok-3-mini-fast', 'xai/grok-3-mini-fast', 'Grok 3 Mini Fast', 'xai Grok 3 Mini Fast - AI model available through Vercel AI Gateway', 'xai', 'xai/grok-3-mini-fast', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO xai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('xai/grok-4', 'xai/grok-4', 'Grok 4', 'xai Grok 4 - AI model available through Vercel AI Gateway', 'xai', 'xai/grok-4', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO xai_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('xai/grok-code-fast-1', 'xai/grok-code-fast-1', 'Grok Code Fast 1', 'xai Grok Code Fast 1 - AI model available through Vercel AI Gateway', 'xai', 'xai/grok-code-fast-1', 'https://gateway.ai.vercel.com/v1');

-- Small Providers Models (23 models from 12 providers) - Shared Table
CREATE TABLE IF NOT EXISTS small_providers_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  context_window INTEGER DEFAULT 128000,
  response_time TEXT DEFAULT 'Standard',
  cost_tier TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider_name TEXT NOT NULL,
  provider_model_id TEXT,
  api_endpoint TEXT DEFAULT 'https://gateway.ai.vercel.com/v1'
);

INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('amazon/nova-lite', 'amazon/nova-lite', 'Nova Lite', 'amazon Nova Lite - AI model available through Vercel AI Gateway', 'amazon', 'amazon/nova-lite', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('amazon/titan-embed-text-v2', 'amazon/titan-embed-text-v2', 'Titan Embed Text V2', 'amazon Titan Embed Text V2 - AI model available through Vercel AI Gateway', 'amazon', 'amazon/titan-embed-text-v2', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('cohere/command-a', 'cohere/command-a', 'Command A', 'cohere Command A - AI model available through Vercel AI Gateway', 'cohere', 'cohere/command-a', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('cohere/command-r-plus', 'cohere/command-r-plus', 'Command R Plus', 'cohere Command R Plus - AI model available through Vercel AI Gateway', 'cohere', 'cohere/command-r-plus', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('cohere/embed-v4.0', 'cohere/embed-v4.0', 'Embed V4.0', 'cohere Embed V4.0 - AI model available through Vercel AI Gateway', 'cohere', 'cohere/embed-v4.0', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('inception/mercury-coder-small', 'inception/mercury-coder-small', 'Mercury Coder Small', 'inception Mercury Coder Small - AI model available through Vercel AI Gateway', 'inception', 'inception/mercury-coder-small', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('meituan/longcat-flash-chat', 'meituan/longcat-flash-chat', 'Longcat Flash Chat', 'meituan Longcat Flash Chat - AI model available through Vercel AI Gateway', 'meituan', 'meituan/longcat-flash-chat', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('moonshotai/kimi-k2', 'moonshotai/kimi-k2', 'Kimi K2', 'moonshotai Kimi K2 - AI model available through Vercel AI Gateway', 'moonshotai', 'moonshotai/kimi-k2', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('moonshotai/kimi-k2-0905', 'moonshotai/kimi-k2-0905', 'Kimi K2 0905', 'moonshotai Kimi K2 0905 - AI model available through Vercel AI Gateway', 'moonshotai', 'moonshotai/kimi-k2-0905', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('moonshotai/kimi-k2-turbo', 'moonshotai/kimi-k2-turbo', 'Kimi K2 Turbo', 'moonshotai Kimi K2 Turbo - AI model available through Vercel AI Gateway', 'moonshotai', 'moonshotai/kimi-k2-turbo', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('morph/morph-v3-fast', 'morph/morph-v3-fast', 'Morph V3 Fast', 'morph Morph V3 Fast - AI model available through Vercel AI Gateway', 'morph', 'morph/morph-v3-fast', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('morph/morph-v3-large', 'morph/morph-v3-large', 'Morph V3 Large', 'morph Morph V3 Large - AI model available through Vercel AI Gateway', 'morph', 'morph/morph-v3-large', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('perplexity/sonar', 'perplexity/sonar', 'Sonar', 'perplexity Sonar - AI model available through Vercel AI Gateway', 'perplexity', 'perplexity/sonar', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('perplexity/sonar-pro', 'perplexity/sonar-pro', 'Sonar Pro', 'perplexity Sonar Pro - AI model available through Vercel AI Gateway', 'perplexity', 'perplexity/sonar-pro', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('reasoning/chat', 'reasoning/chat', 'Chat', 'reasoning Chat - AI model available through Vercel AI Gateway', 'reasoning', 'reasoning/chat', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('stealth/sonoma-dusk-alpha', 'stealth/sonoma-dusk-alpha', 'Sonoma Dusk Alpha', 'stealth Sonoma Dusk Alpha - AI model available through Vercel AI Gateway', 'stealth', 'stealth/sonoma-dusk-alpha', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('stealth/sonoma-sky-alpha', 'stealth/sonoma-sky-alpha', 'Sonoma Sky Alpha', 'stealth Sonoma Sky Alpha - AI model available through Vercel AI Gateway', 'stealth', 'stealth/sonoma-sky-alpha', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('tokens/second.', 'tokens/second.', 'Second.', 'tokens Second. - AI model available through Vercel AI Gateway', 'tokens', 'tokens/second.', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('vercel/v0-1.0-md', 'vercel/v0-1.0-md', 'V0 1.0 Md', 'vercel V0 1.0 Md - AI model available through Vercel AI Gateway', 'vercel', 'vercel/v0-1.0-md', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('vercel/v0-1.5-md', 'vercel/v0-1.5-md', 'V0 1.5 Md', 'vercel V0 1.5 Md - AI model available through Vercel AI Gateway', 'vercel', 'vercel/v0-1.5-md', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('zai/glm-4.5', 'zai/glm-4.5', 'Glm 4.5', 'zai Glm 4.5 - AI model available through Vercel AI Gateway', 'zai', 'zai/glm-4.5', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('zai/glm-4.5-air', 'zai/glm-4.5-air', 'Glm 4.5 Air', 'zai Glm 4.5 Air - AI model available through Vercel AI Gateway', 'zai', 'zai/glm-4.5-air', 'https://gateway.ai.vercel.com/v1');
INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES ('zai/glm-4.5v', 'zai/glm-4.5v', 'Glm 4.5v', 'zai Glm 4.5v - AI model available through Vercel AI Gateway', 'zai', 'zai/glm-4.5v', 'https://gateway.ai.vercel.com/v1');

-- Add triggers for auto-updating updated_at timestamps
CREATE TRIGGER IF NOT EXISTS update_anthropic_models_updated_at
  AFTER UPDATE ON anthropic_models
  FOR EACH ROW
  BEGIN
    UPDATE anthropic_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_google_deepmind_models_updated_at
  AFTER UPDATE ON google_deepmind_models
  FOR EACH ROW
  BEGIN
    UPDATE google_deepmind_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_openai_models_updated_at
  AFTER UPDATE ON openai_models
  FOR EACH ROW
  BEGIN
    UPDATE openai_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_alibaba_models_updated_at
  AFTER UPDATE ON alibaba_models
  FOR EACH ROW
  BEGIN
    UPDATE alibaba_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_deepseek_models_updated_at
  AFTER UPDATE ON deepseek_models
  FOR EACH ROW
  BEGIN
    UPDATE deepseek_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_meta_models_updated_at
  AFTER UPDATE ON meta_models
  FOR EACH ROW
  BEGIN
    UPDATE meta_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_mistral_models_updated_at
  AFTER UPDATE ON mistral_models
  FOR EACH ROW
  BEGIN
    UPDATE mistral_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_voyage_models_updated_at
  AFTER UPDATE ON voyage_models
  FOR EACH ROW
  BEGIN
    UPDATE voyage_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_xai_models_updated_at
  AFTER UPDATE ON xai_models
  FOR EACH ROW
  BEGIN
    UPDATE xai_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_small_providers_models_updated_at
  AFTER UPDATE ON small_providers_models
  FOR EACH ROW
  BEGIN
    UPDATE small_providers_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

