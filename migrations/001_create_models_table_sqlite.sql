-- Create models table for unique model definitions (SQLite version)
-- NOTE: This table contains unique model names only - provider relationships are in model_providers table
-- These models are specifically for the AI Gateway API only
CREATE TABLE IF NOT EXISTS models (
  id TEXT PRIMARY KEY, -- Using human-readable model names as IDs (e.g., "GPT-4", "Claude-3-Opus")
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  capabilities TEXT NOT NULL DEFAULT '[]', -- JSON array as string
  description TEXT,
  context_window TEXT,
  response_time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create model_providers table for provider-specific configurations
CREATE TABLE IF NOT EXISTS model_providers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr('89ab', (abs(random()) % 4) + 1, 1) || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  pricing TEXT DEFAULT '{"inputTokens": "", "outputTokens": ""}', -- JSON as string
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(model_id, provider)
);

-- ============================================================================
-- MODEL CATEGORIZATION TABLES (13 Dimensions)
-- ============================================================================

-- Cost tiers: Low Cost, Mid Range, Premium
CREATE TABLE IF NOT EXISTS model_cost_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Speed dimensions: Instant, Fast, Slow
CREATE TABLE IF NOT EXISTS model_speed_dimensions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Context sizes: Short, Medium, Long
CREATE TABLE IF NOT EXISTS model_context_sizes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Use case dimensions: Conversational, Research & Analysis, Coding & Development, Creative & Multimodal
CREATE TABLE IF NOT EXISTS model_use_cases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Provider ecosystems: Big Tech, Innovators, Open Source, Specialists
CREATE TABLE IF NOT EXISTS model_provider_ecosystems (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Availability modes: Online Only, Offline Capable, Hybrid
CREATE TABLE IF NOT EXISTS model_availability_modes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activity status: Active, Idle
CREATE TABLE IF NOT EXISTS model_activity_status (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- API usage patterns: Hourly Users, Daily Workers, Weekly Analysts
CREATE TABLE IF NOT EXISTS model_api_patterns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Emerging categories: Future-Proof, Global Scale, Industrial Grade
CREATE TABLE IF NOT EXISTS model_emerging_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- JUNCTION TABLES (Model-to-Category Relationships)
-- ============================================================================

-- Model cost tier assignments
CREATE TABLE IF NOT EXISTS model_cost_tier_assignments (
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  cost_tier_id TEXT NOT NULL REFERENCES model_cost_tiers(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, cost_tier_id)
);

-- Model speed dimension assignments
CREATE TABLE IF NOT EXISTS model_speed_assignments (
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  speed_dimension_id TEXT NOT NULL REFERENCES model_speed_dimensions(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, speed_dimension_id)
);

-- Model context size assignments
CREATE TABLE IF NOT EXISTS model_context_assignments (
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  context_size_id TEXT NOT NULL REFERENCES model_context_sizes(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, context_size_id)
);

-- Model use case assignments
CREATE TABLE IF NOT EXISTS model_use_case_assignments (
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  use_case_id TEXT NOT NULL REFERENCES model_use_cases(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, use_case_id)
);

-- Model provider ecosystem assignments
CREATE TABLE IF NOT EXISTS model_provider_ecosystem_assignments (
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  provider_ecosystem_id TEXT NOT NULL REFERENCES model_provider_ecosystems(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, provider_ecosystem_id)
);

-- Model availability mode assignments
CREATE TABLE IF NOT EXISTS model_availability_assignments (
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  availability_mode_id TEXT NOT NULL REFERENCES model_availability_modes(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, availability_mode_id)
);

-- Model activity status assignments
CREATE TABLE IF NOT EXISTS model_activity_assignments (
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  activity_status_id TEXT NOT NULL REFERENCES model_activity_status(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, activity_status_id)
);

-- Model API pattern assignments
CREATE TABLE IF NOT EXISTS model_api_pattern_assignments (
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  api_pattern_id TEXT NOT NULL REFERENCES model_api_patterns(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, api_pattern_id)
);

-- Model emerging category assignments
CREATE TABLE IF NOT EXISTS model_emerging_category_assignments (
  model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  emerging_category_id TEXT NOT NULL REFERENCES model_emerging_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, emerging_category_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_models_name ON models(name);
CREATE INDEX IF NOT EXISTS idx_model_providers_model_id ON model_providers(model_id);
CREATE INDEX IF NOT EXISTS idx_model_providers_provider ON model_providers(provider);
CREATE INDEX IF NOT EXISTS idx_model_providers_active ON model_providers(is_active) WHERE is_active = 1;

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_models_updated_at
  AFTER UPDATE ON models
  FOR EACH ROW
  BEGIN
    UPDATE models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_model_providers_updated_at
  AFTER UPDATE ON model_providers
  FOR EACH ROW
  BEGIN
    UPDATE model_providers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;