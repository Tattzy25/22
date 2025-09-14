-- Seed data for comprehensive model categorization system (13 dimensions)
-- This migration populates all categorization tables with predefined categories and assigns models

-- ============================================================================
-- COST TIERS SEED DATA
-- ============================================================================
INSERT OR IGNORE INTO model_cost_tiers (id, name, description) VALUES
('low_cost', 'Low Cost', 'Budget-friendly models with competitive pricing'),
('mid_range', 'Mid Range', 'Balanced cost-performance models'),
('premium', 'Premium', 'High-performance models with premium pricing');

-- ============================================================================
-- SPEED DIMENSIONS SEED DATA
-- ============================================================================
INSERT OR IGNORE INTO model_speed_dimensions (id, name, description) VALUES
('instant', 'Instant', 'Ultra-fast response times (< 1 second)'),
('fast', 'Fast', 'Quick response times (1-3 seconds)'),
('slow', 'Slow', 'Slower response times (> 3 seconds)');

-- ============================================================================
-- CONTEXT SIZES SEED DATA
-- ============================================================================
INSERT OR IGNORE INTO model_context_sizes (id, name, description) VALUES
('short', 'Short', 'Limited context window (< 32K tokens)'),
('medium', 'Medium', 'Moderate context window (32K-128K tokens)'),
('long', 'Long', 'Extended context window (> 128K tokens)');

-- ============================================================================
-- USE CASES SEED DATA
-- ============================================================================
INSERT OR IGNORE INTO model_use_cases (id, name, description) VALUES
('conversational', 'Conversational', 'Chat, dialogue, and interactive applications'),
('research_analysis', 'Research & Analysis', 'Data analysis, research, and complex reasoning'),
('coding_development', 'Coding & Development', 'Programming, code generation, and technical tasks'),
('creative_multimodal', 'Creative & Multimodal', 'Art, content creation, and multimodal tasks');

-- ============================================================================
-- PROVIDER ECOSYSTEMS SEED DATA
-- ============================================================================
INSERT OR IGNORE INTO model_provider_ecosystems (id, name, description) VALUES
('big_tech', 'Big Tech', 'Established technology companies (Google, Microsoft, etc.)'),
('innovators', 'Innovators', 'Forward-thinking AI companies and startups'),
('open_source', 'Open Source', 'Community-driven and open source initiatives'),
('specialists', 'Specialists', 'Domain-specific and specialized AI providers');

-- ============================================================================
-- AVAILABILITY MODES SEED DATA
-- ============================================================================
INSERT OR IGNORE INTO model_availability_modes (id, name, description) VALUES
('online_only', 'Online Only', 'Cloud-hosted API access only'),
('offline_capable', 'Offline Capable', 'Can be downloaded and run locally'),
('hybrid', 'Hybrid', 'Available both online and offline');

-- ============================================================================
-- ACTIVITY STATUS SEED DATA
-- ============================================================================
INSERT OR IGNORE INTO model_activity_status (id, name, description) VALUES
('active', 'Active', 'Widely used and actively maintained models'),
('idle', 'Idle', 'Limited adoption, experimental, or deprecated models');

-- ============================================================================
-- API USAGE PATTERNS SEED DATA
-- ============================================================================
INSERT OR IGNORE INTO model_api_patterns (id, name, description) VALUES
('hourly_users', 'Hourly Users', 'Frequent API calls throughout the day'),
('daily_workers', 'Daily Workers', 'Regular daily usage patterns'),
('weekly_analysts', 'Weekly Analysts', 'Periodic or project-based usage');

-- ============================================================================
-- EMERGING CATEGORIES SEED DATA
-- ============================================================================
INSERT OR IGNORE INTO model_emerging_categories (id, name, description) VALUES
('future_proof', 'Future-Proof', 'Cutting-edge models with advanced capabilities'),
('global_scale', 'Global Scale', 'Models designed for worldwide deployment'),
('industrial_grade', 'Industrial Grade', 'Enterprise-ready with reliability guarantees');

-- ============================================================================
-- MODEL CATEGORY ASSIGNMENTS
-- ============================================================================
-- Note: These assignments are based on the comprehensive analysis of the 117 models
-- The actual assignments would be populated based on the CSV data analysis
-- For now, this serves as the framework for the categorization system

-- Example assignments (would be populated programmatically from CSV analysis):
-- INSERT OR IGNORE INTO model_cost_tier_assignments (model_id, cost_tier_id) VALUES
-- ('anthropic/claude-sonnet-4', 'premium'),
-- ('openai/gpt-5', 'premium'),
-- ('google/gemini-2.0-flash', 'mid_range');

-- Similar INSERT statements would be added for all other junction tables
-- based on the categorization analysis results