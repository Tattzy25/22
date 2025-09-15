-- Enhanced Models Schema for Dynamic Model Cards
-- Supports multiple providers per model with full metadata

CREATE TABLE IF NOT EXISTS models (
  id TEXT PRIMARY KEY, -- Human-readable ID (e.g., "gpt-4", "claude-3-opus")
  name TEXT NOT NULL UNIQUE,
  display_name TEXT, -- Pretty name for UI
  category TEXT NOT NULL,
  description TEXT,
  context_window INTEGER,
  response_time TEXT, -- e.g., "Fast", "Instant"
  cost_tier TEXT, -- e.g., "Low", "Premium"
  icon_url TEXT, -- For model-specific icons
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Model capabilities (many-to-many relationship)
CREATE TABLE IF NOT EXISTS model_capabilities (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr('89ab', (abs(random()) % 4) + 1, 1) || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  capability TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(model_id, capability)
);

-- Model providers (supports multiple providers per model)
CREATE TABLE IF NOT EXISTS model_providers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr('89ab', (abs(random()) % 4) + 1, 1) || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL, -- e.g., "OpenAI", "Anthropic", "AI Gateway"
  provider_model_id TEXT, -- The actual model ID used by the provider
  api_endpoint TEXT,
  auth_type TEXT DEFAULT 'api_key', -- 'api_key', 'oidc', 'oauth'
  priority INTEGER DEFAULT 1, -- For failover/load balancing
  is_active BOOLEAN DEFAULT 1,
  pricing_input_per_token REAL,
  pricing_output_per_token REAL,
  rate_limit_requests INTEGER,
  rate_limit_window_seconds INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(model_id, provider_name)
);

-- Model categories for filtering
CREATE TABLE IF NOT EXISTS model_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT, -- Hex color for UI
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User favorites/bookmarks
CREATE TABLE IF NOT EXISTS user_model_favorites (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr('89ab', (abs(random()) % 4) + 1, 1) || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
  user_id TEXT NOT NULL,
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, model_id)
);

-- Model usage statistics
CREATE TABLE IF NOT EXISTS model_usage_stats (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr('89ab', (abs(random()) % 4) + 1, 1) || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  provider_id TEXT REFERENCES model_providers(id) ON DELETE SET NULL,
  user_id TEXT,
  request_count INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  total_cost REAL DEFAULT 0,
  last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_models_category ON models(category);
CREATE INDEX IF NOT EXISTS idx_models_active ON models(is_active);
CREATE INDEX IF NOT EXISTS idx_model_providers_model_id ON model_providers(model_id);
CREATE INDEX IF NOT EXISTS idx_model_providers_active ON model_providers(is_active);
CREATE INDEX IF NOT EXISTS idx_model_capabilities_model_id ON model_capabilities(model_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_model_favorites(user_id);