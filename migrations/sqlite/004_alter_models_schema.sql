-- Alter existing tables to add enhanced schema columns
-- This migration adds the missing columns to existing tables
-- Note: ALTER TABLE statements removed as columns already exist from previous runs

-- Add new columns to models table (already added in previous run)
-- ALTER TABLE models ADD COLUMN display_name TEXT;
-- ALTER TABLE models ADD COLUMN cost_tier TEXT;
-- ALTER TABLE models ADD COLUMN icon_url TEXT;
-- ALTER TABLE models ADD COLUMN is_active BOOLEAN DEFAULT 1;
-- ALTER TABLE models ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Change context_window to INTEGER type (from TEXT)
-- Note: SQLite doesn't support changing column types directly, so we'll need to recreate if needed

-- Add new columns to model_providers table (already added in previous run)
-- ALTER TABLE model_providers ADD COLUMN provider_name TEXT;
-- ALTER TABLE model_providers ADD COLUMN provider_model_id TEXT;
-- ALTER TABLE model_providers ADD COLUMN api_endpoint TEXT;
-- ALTER TABLE model_providers ADD COLUMN auth_type TEXT DEFAULT 'api_key';
-- ALTER TABLE model_providers ADD COLUMN pricing_input_per_token REAL;
-- ALTER TABLE model_providers ADD COLUMN pricing_output_per_token REAL;
-- ALTER TABLE model_providers ADD COLUMN rate_limit_requests INTEGER;
-- ALTER TABLE model_providers ADD COLUMN rate_limit_window_seconds INTEGER;

-- Rename 'provider' column to 'provider_name' if it exists
-- Note: This is a workaround since SQLite doesn't support renaming columns directly

-- Create new tables that don't exist yet
CREATE TABLE IF NOT EXISTS model_capabilities (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr('89ab', (abs(random()) % 4) + 1, 1) || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  capability TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(model_id, capability)
);

CREATE TABLE IF NOT EXISTS model_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_model_favorites (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr('89ab', (abs(random()) % 4) + 1, 1) || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
  user_id TEXT NOT NULL,
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, model_id)
);

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_models_category ON models(category);
CREATE INDEX IF NOT EXISTS idx_models_active ON models(is_active);
CREATE INDEX IF NOT EXISTS idx_model_providers_model_id ON model_providers(model_id);
CREATE INDEX IF NOT EXISTS idx_model_providers_active ON model_providers(is_active);
CREATE INDEX IF NOT EXISTS idx_model_capabilities_model_id ON model_capabilities(model_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_model_favorites(user_id);