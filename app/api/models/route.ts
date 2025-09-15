import { NextRequest, NextResponse } from 'next/server'
import { turso } from '@/lib/turso'

interface AIModel {
  id: string
  name: string
  display_name: string | null
  description: string | null
  provider: string
  provider_model_id: string | null
  api_endpoint: string
  category: string
  context_window: number | null
  response_time: string | null
  cost_tier: string
  is_active: number
  sort_order: number
  created_at: string
  updated_at: string
  capabilities: string[]
  tooltip: string | null
  status: string
  publish: boolean
}

export async function GET() {
  try {
    // Query all provider-specific tables and combine results
    const providerTables = [
      'anthropic_models',
      'google_deepmind_models',
      'openai_models',
      'alibaba_models',
      'deepseek_models',
      'meta_models',
      'mistral_models',
      'voyage_models',
      'xai_models',
      'small_providers_models'
    ]

    const allModels: AIModel[] = []

    for (const tableName of providerTables) {
      try {
        const result = await turso.execute({
          sql: `SELECT
                  id,
                  name,
                  display_name,
                  description,
                  provider_name,
                  provider_model_id,
                  api_endpoint,
                  category,
                  context_window,
                  response_time,
                  cost_tier,
                  is_active,
                  sort_order,
                  created_at,
                  updated_at
                FROM ${tableName}
                WHERE is_active = 1
                ORDER BY sort_order ASC, created_at DESC`,
          args: []
        })

        const tableModels: AIModel[] = result.rows.map((row) => ({
          id: String(row.id || ''),
          name: String(row.name || ''),
          display_name: row.display_name ? String(row.display_name) : null,
          description: row.description ? String(row.description) : null,
          provider: String(row.provider_name || ''),
          provider_model_id: row.provider_model_id ? String(row.provider_model_id) : null,
          api_endpoint: String(row.api_endpoint || ''),
          category: String(row.category || 'general'),
          context_window: row.context_window ? Number(row.context_window) : null,
          response_time: row.response_time ? String(row.response_time) : null,
          cost_tier: String(row.cost_tier || 'premium'),
          is_active: Number(row.is_active || 1),
          sort_order: Number(row.sort_order || 0),
          created_at: String(row.created_at || ''),
          updated_at: String(row.updated_at || ''),
          // Legacy compatibility fields
          capabilities: [],
          tooltip: row.description ? String(row.description) : null,
          status: (row.is_active && Number(row.is_active) === 1) ? 'available' : 'inactive',
          publish: Boolean(row.is_active && Number(row.is_active) === 1)
        }))

        allModels.push(...tableModels)
      } catch (error) {
        console.warn(`Failed to query table ${tableName}:`, error)
        // Continue with other tables
      }
    }

    // Sort by provider, then by sort_order
    allModels.sort((a, b) => {
      if (a.provider !== b.provider) {
        return a.provider.localeCompare(b.provider)
      }
      return (a.sort_order || 0) - (b.sort_order || 0)
    })

    return NextResponse.json(allModels)
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, provider, capability1, capability2, capability3, capability4, tooltip, status, publish } = body

    if (!name || !provider) {
      return NextResponse.json({ error: 'Name and provider are required' }, { status: 400 })
    }

    if (id) {
      // Update existing
      await turso.execute({
        sql: `UPDATE models
              SET name = ?, provider = ?, capability1 = ?, capability2 = ?, capability3 = ?, capability4 = ?,
                  tooltip = ?, status = ?, publish = ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?`,
        args: [name, provider, capability1 || null, capability2 || null, capability3 || null, capability4 || null, tooltip || null, status || 'available', publish || false, id]
      })
    } else {
      // Insert new
      await turso.execute({
        sql: `INSERT INTO models (name, provider, capability1, capability2, capability3, capability4, tooltip, status, publish)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [name, provider, capability1 || null, capability2 || null, capability3 || null, capability4 || null, tooltip || null, status || 'available', publish || false]
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving model:', error)
    return NextResponse.json({ error: 'Failed to save model' }, { status: 500 })
  }
}