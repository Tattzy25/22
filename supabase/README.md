# Supabase Database Setup

This directory contains SQL migrations for setting up the unified AI models database schema.

## ⚠️ Important Note

**These models and providers are specifically for the AI Gateway API only.**
Availability through other APIs or services is not guaranteed. This database contains curated models that are available via the AI Gateway service.

## Unified Database Schema

The database uses a unified model approach with two main tables:

### `models` table

Stores unique model definitions:

- `id` (UUID, Primary Key) - Unique identifier
- `name` (TEXT, Unique) - Model name (e.g., "GPT-4", "Claude 3 Opus")
- `category` (TEXT) - Category like "General/Reasoning", "Coding/Code-Assist"
- `capabilities` (TEXT[]) - Array of model capabilities
- `description` (TEXT) - Model description
- `context_window` (TEXT) - Context window size
- `response_time` (TEXT) - Typical response time
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record update timestamp

### `model_providers` table

Links models to their available providers:

- `id` (UUID, Primary Key) - Unique identifier
- `model_id` (UUID, Foreign Key) - References models.id
- `provider` (TEXT) - Provider name (e.g., "OpenAI", "Anthropic", "AI Gateway")
- `pricing` (JSONB) - Pricing with inputTokens/outputTokens
- `priority` (INTEGER) - Priority for selection (lower = higher priority)
- `is_active` (BOOLEAN) - Whether provider is currently active
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record update timestamp

## Unified Model Experience

The unified approach ensures users see one card per model but the system routes to the best available provider:

1. **User View**: Clean interface showing unique model names (e.g., "GPT-4")
2. **Admin Control**: Admins configure multiple providers per model with priorities
3. **Smart Routing**: System selects highest priority active provider automatically
4. **Provider Switching**: Admins can switch providers without changing user experience

## Setup Instructions

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the migrations** in order:

   ```sql
   -- Run 001_create_models_table.sql first
   -- Then run 002_seed_models_data.sql
   ```

3. **Via Supabase Dashboard:**
   - Go to your project's SQL Editor
   - Copy and paste each migration file content
   - Run them in order

4. **Via Supabase CLI** (if installed):

   ```bash
   supabase db push
   ```

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Admin Panel

✅ **INTEGRATED**: The AI model management functionality is now integrated into the existing sidebar admin panel.

### Access

- Navigate to the "Admin Panel" in the sidebar
- The AI Model Management section allows you to add, update, and manage models and providers
- **No authentication required** - publicly accessible

### Features

- Add new models with basic information (name, category, capabilities, description)
- Configure provider relationships with pricing and priorities
- Unified model experience - users see one card per model, system routes to best provider
- Automatic provider switching based on priority and availability

### Security Note

Database operations are publicly accessible with no authentication restrictions.

## Security

- Row Level Security (RLS) is enabled on both tables
- Public read access for model browsing
- Authenticated users can manage models and providers
- Adjust policies based on your authentication requirements

## Indexes

- `idx_models_name` - For model name searches
- `idx_model_providers_model_id` - For joining models to providers
- `idx_model_providers_provider` - For provider filtering
- `idx_model_providers_active` - For active provider queries

## Future Enhancements

- Add model performance metrics
- Include usage statistics and analytics
- Support for model versioning
- Advanced provider failover logic
