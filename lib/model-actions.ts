"use server"

import { turso } from "@/lib/turso"

export interface ModelWithProvider {
  id: string
  name: string
  category: string
  capabilities: string[]
  description: string
  contextWindow: string
  responseTime: string
  provider: string
  pricing: {
    inputTokens: string
    outputTokens: string
    cacheRead?: string
    cacheWrite?: string
  }
  priority: number
  isActive: boolean
}

export async function getModels(): Promise<ModelWithProvider[]> {
  try {
    const modelsResult = await turso.execute(`
      SELECT
        m.id,
        m.name,
        m.category,
        m.capabilities,
        m.description,
        m.context_window,
        m.response_time,
        mp.provider,
        mp.pricing,
        mp.priority,
        mp.is_active
      FROM models m
      LEFT JOIN model_providers mp ON m.id = mp.model_id
      WHERE mp.is_active = 1
      ORDER BY m.name, mp.priority ASC
    `)

    // Group by model and get the best provider for each
    const modelMap = new Map<string, ModelWithProvider>()

    modelsResult.rows.forEach(row => {
      const modelId = row.id as string
      if (!modelMap.has(modelId)) {
        // Parse the JSON pricing string
        let pricing
        try {
          pricing = JSON.parse(row.pricing as string)
        } catch {
          pricing = { inputTokens: "", outputTokens: "" }
        }

        modelMap.set(modelId, {
          id: modelId,
          name: row.name as string,
          category: row.category as string,
          capabilities: JSON.parse(row.capabilities as string || '[]'),
          description: row.description as string,
          contextWindow: row.context_window as string,
          responseTime: row.response_time as string,
          provider: row.provider as string,
          pricing: {
            inputTokens: pricing.inputTokens || "",
            outputTokens: pricing.outputTokens || "",
            cacheRead: pricing.cacheRead,
            cacheWrite: pricing.cacheWrite
          },
          priority: row.priority as number,
          isActive: Boolean(row.is_active)
        })
      }
    })

    return Array.from(modelMap.values())
  } catch (error) {
    console.error('Error fetching models:', error)
    throw new Error('Failed to fetch models')
  }
}

export async function getModelCategories() {
  try {
    // Get all unique categories from models
    const categoriesResult = await turso.execute(`
      SELECT DISTINCT category FROM models WHERE category IS NOT NULL ORDER BY category
    `)

    return categoriesResult.rows.map(row => row.category as string)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getModelProviders() {
  try {
    // Get all unique providers
    const providersResult = await turso.execute(`
      SELECT DISTINCT provider FROM model_providers ORDER BY provider
    `)

    return providersResult.rows.map(row => row.provider as string)
  } catch (error) {
    console.error('Error fetching providers:', error)
    return []
  }
}

export interface ModelFormData {
  name: string
  provider: string
  category: string
  capabilities: string[]
  description: string
  contextWindow: string
  responseTime: string
  inputTokens: string
  outputTokens: string
}

export async function saveModel(formData: ModelFormData) {
  try {
    // First, check if model exists, if not create it
    const existingModelResult = await turso.execute({
      sql: "SELECT id FROM models WHERE name = ?",
      args: [formData.name],
    })

    let modelId: string

    if (existingModelResult.rows.length === 0) {
      // Create new model
      const newModelResult = await turso.execute({
        sql: `INSERT INTO models (name, category, capabilities, description, context_window, response_time)
              VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
        args: [
          formData.name,
          formData.category,
          JSON.stringify(formData.capabilities),
          formData.description,
          formData.contextWindow,
          formData.responseTime,
        ],
      })

      if (newModelResult.rows.length === 0) {
        throw new Error("Failed to create model")
      }
      modelId = newModelResult.rows[0].id as string
    } else {
      // Update existing model
      modelId = existingModelResult.rows[0].id as string
      await turso.execute({
        sql: `UPDATE models SET category = ?, capabilities = ?, description = ?, context_window = ?, response_time = ?
              WHERE id = ?`,
        args: [
          formData.category,
          JSON.stringify(formData.capabilities),
          formData.description,
          formData.contextWindow,
          formData.responseTime,
          modelId,
        ],
      })
    }

    // Create or update model-provider relationship
    await turso.execute({
      sql: `INSERT OR REPLACE INTO model_providers (model_id, provider, pricing, priority, is_active)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        modelId,
        formData.provider,
        JSON.stringify({
          inputTokens: formData.inputTokens,
          outputTokens: formData.outputTokens,
        }),
        1, // Default priority
        true, // is_active
      ],
    })

    return { success: true, message: "Model saved successfully!" }
  } catch (error) {
    console.error('Error saving model:', error)
    return { success: false, message: "Error saving model. Please try again." }
  }
}