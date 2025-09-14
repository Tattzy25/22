-- Create models table for unique model definitions
-- NOTE: This table contains unique model names only - provider relationships are in model_providers table
-- These models are specifically for the AI Gateway API only
CREATE TABLE IF NOT EXISTS models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  context_window TEXT,
  response_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create model_providers table for provider-specific configurations
CREATE TABLE IF NOT EXISTS model_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  pricing JSONB DEFAULT '{"inputTokens": "", "outputTokens": ""}',
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(model_id, provider)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_models_name ON models(name);
CREATE INDEX IF NOT EXISTS idx_model_providers_model_id ON model_providers(model_id);
CREATE INDEX IF NOT EXISTS idx_model_providers_provider ON model_providers(provider);
CREATE INDEX IF NOT EXISTS idx_model_providers_active ON model_providers(is_active) WHERE is_active = true;

-- Enable Row Level Security (RLS)
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_providers ENABLE ROW LEVEL SECURITY;

-- Allow public access to everything (no restrictions)
CREATE POLICY "Allow public access to models" ON models FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to model_providers" ON model_providers FOR ALL USING (true) WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_model_providers_updated_at
  BEFORE UPDATE ON model_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();