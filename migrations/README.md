# Database Migrations

This folder contains database migration files organized by database type.

## Structure

```text
migrations/
├── sqlite/                    # SQLite migrations for Turso database
│   ├── 001_create_models_table_sqlite.sql
│   ├── 002_seed_models_data_sqlite.sql
│   ├── 002_seed_models_data_sqlite_new.sql
│   ├── 003_seed_categorization_data.sql
│   └── 004_create_admin_models_table.sql
└── README.md                 # This file
```

## Usage

Run migrations using the `run-migrations.ts` script:

```bash
pnpm run migrate
```

## Database

Currently using **Turso** (SQLite-compatible) database with the following migrations:

- Table creation and seeding for AI models
- Categorization data
- Admin models table

## Migration Files

- **001**: Creates the main models and model_providers tables
- **002**: Seeds initial model data (multiple versions exist)
- **003**: Adds categorization data
- **004**: Creates admin-specific models table
