-- Create models table for admin-managed models
CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  capability1 TEXT,
  capability2 TEXT,
  capability3 TEXT,
  capability4 TEXT,
  tooltip TEXT,
  status TEXT CHECK (status IN ('available','unavailable','idle')) DEFAULT 'available',
  publish BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on publish for faster queries
CREATE INDEX IF NOT EXISTS idx_models_publish ON models(publish);

-- Create index on name for searching
CREATE INDEX IF NOT EXISTS idx_models_name ON models(name);