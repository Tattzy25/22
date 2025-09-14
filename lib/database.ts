import { createClient } from '@libsql/client'

export interface Profile {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at: string
  updated_at?: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  model: string
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: string
  }>
  created_at: string
  updated_at: string
}

export interface Generation {
  id: string
  user_id: string
  type: 'image' | 'music' | 'text' | 'character'
  prompt: string
  result_url?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface ApiKey {
  id: string
  user_id: string
  key_hash: string
  permissions: string[]
  usage_limit: number
  usage_count: number
  created_at: string
  expires_at?: string
}

export class DatabaseService {
  private client

  constructor() {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!url) {
      throw new Error('TURSO_DATABASE_URL is required')
    }

    if (!authToken) {
      throw new Error('TURSO_AUTH_TOKEN is required')
    }

    this.client = createClient({
      url,
      authToken,
    })
  }

  // Profile Management
  async createProfile(profile: Omit<Profile, 'created_at'>): Promise<Profile> {
    const result = await this.client.execute({
      sql: `
        INSERT OR REPLACE INTO profiles (id, email, username, avatar_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        profile.id,
        profile.email,
        profile.username || null,
        profile.avatar_url || null,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    })

    return {
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM profiles WHERE id = ?',
      args: [userId]
    })

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0] as unknown as { id: string; email: string; username?: string; avatar_url?: string; created_at: string; updated_at?: string }
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      avatar_url: row.avatar_url,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const setParts: string[] = []
    const args: (string | number)[] = []

    if (updates.email !== undefined) {
      setParts.push('email = ?')
      args.push(updates.email)
    }
    if (updates.username !== undefined) {
      setParts.push('username = ?')
      args.push(updates.username)
    }
    if (updates.avatar_url !== undefined) {
      setParts.push('avatar_url = ?')
      args.push(updates.avatar_url)
    }

    setParts.push('updated_at = ?')
    args.push(new Date().toISOString())
    args.push(userId)

    await this.client.execute({
      sql: `UPDATE profiles SET ${setParts.join(', ')} WHERE id = ?`,
      args
    })

    const profile = await this.getProfile(userId)
    if (!profile) {
      throw new Error('Profile not found after update')
    }

    return profile
  }

  // Conversation Management
  async saveConversation(conversation: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>): Promise<Conversation> {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    await this.client.execute({
      sql: `
        INSERT INTO conversations (id, user_id, title, model, messages, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        conversation.user_id,
        conversation.title,
        conversation.model,
        JSON.stringify(conversation.messages),
        now,
        now
      ]
    })

    return {
      ...conversation,
      id,
      created_at: now,
      updated_at: now
    }
  }

  async getUserConversations(userId: string, limit = 50): Promise<Conversation[]> {
    const result = await this.client.execute({
      sql: `
        SELECT * FROM conversations
        WHERE user_id = ?
        ORDER BY updated_at DESC
        LIMIT ?
      `,
      args: [userId, limit]
    })

    return result.rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      user_id: row.user_id as string,
      title: row.title as string,
      model: row.model as string,
      messages: JSON.parse(row.messages as string),
      created_at: row.created_at as string,
      updated_at: row.updated_at as string
    }))
  }

  async updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<Conversation> {
    const setParts: string[] = []
    const args: (string | unknown[])[] = []

    if (updates.title !== undefined) {
      setParts.push('title = ?')
      args.push(updates.title)
    }
    if (updates.model !== undefined) {
      setParts.push('model = ?')
      args.push(updates.model)
    }
    if (updates.messages !== undefined) {
      setParts.push('messages = ?')
      args.push(JSON.stringify(updates.messages))
    }

    setParts.push('updated_at = ?')
    args.push(new Date().toISOString())
    args.push(conversationId)

    await this.client.execute({
      sql: `UPDATE conversations SET ${setParts.join(', ')} WHERE id = ?`,
      args: args as string[]
    })

    const result = await this.client.execute({
      sql: 'SELECT * FROM conversations WHERE id = ?',
      args: [conversationId]
    })

    if (result.rows.length === 0) {
      throw new Error('Conversation not found after update')
    }

    const row = result.rows[0] as unknown as { id: string; user_id: string; title: string; model: string; messages: string; created_at: string; updated_at: string }
    return {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      model: row.model,
      messages: JSON.parse(row.messages),
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }

  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    await this.client.execute({
      sql: 'DELETE FROM conversations WHERE id = ? AND user_id = ?',
      args: [conversationId, userId]
    })
  }

  // Generation Tracking
  async saveGeneration(generation: Omit<Generation, 'id' | 'created_at'>): Promise<Generation> {
    const id = crypto.randomUUID()

    await this.client.execute({
      sql: `
        INSERT INTO generations (id, user_id, type, prompt, result_url, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        generation.user_id,
        generation.type,
        generation.prompt,
        generation.result_url || null,
        generation.metadata ? JSON.stringify(generation.metadata) : null,
        new Date().toISOString()
      ]
    })

    return {
      ...generation,
      id,
      created_at: new Date().toISOString()
    }
  }

  async getUserGenerations(userId: string, type?: string, limit = 50): Promise<Generation[]> {
    let sql = `
      SELECT * FROM generations
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `
    const args: string[] = [userId, limit.toString()]

    if (type) {
      sql = `
        SELECT * FROM generations
        WHERE user_id = ? AND type = ?
        ORDER BY created_at DESC
        LIMIT ?
      `
      args.splice(1, 0, type)
    }

    const result = await this.client.execute({
      sql,
      args
    })

    return result.rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      user_id: row.user_id as string,
      type: row.type as Generation['type'],
      prompt: row.prompt as string,
      result_url: row.result_url as string | undefined,
      metadata: row.metadata ? JSON.parse(row.metadata as string) : undefined,
      created_at: row.created_at as string
    }))
  }

  // API Key Management
  async createApiKey(apiKey: Omit<ApiKey, 'id' | 'created_at' | 'usage_count'>): Promise<ApiKey> {
    const id = crypto.randomUUID()

    await this.client.execute({
      sql: `
        INSERT INTO api_keys (id, user_id, key_hash, permissions, usage_limit, usage_count, created_at, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        apiKey.user_id,
        apiKey.key_hash,
        JSON.stringify(apiKey.permissions),
        apiKey.usage_limit,
        0,
        new Date().toISOString(),
        apiKey.expires_at || null
      ]
    })

    return {
      ...apiKey,
      id,
      usage_count: 0,
      created_at: new Date().toISOString()
    }
  }

  async getApiKey(keyHash: string): Promise<ApiKey | null> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM api_keys WHERE key_hash = ?',
      args: [keyHash]
    })

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0] as Record<string, unknown>
    return {
      id: row.id as string,
      user_id: row.user_id as string,
      key_hash: row.key_hash as string,
      permissions: JSON.parse(row.permissions as string),
      usage_limit: row.usage_limit as number,
      usage_count: row.usage_count as number,
      created_at: row.created_at as string,
      expires_at: row.expires_at as string | undefined
    }
  }

  async updateApiKeyUsage(keyId: string, increment = 1): Promise<void> {
    await this.client.execute({
      sql: 'UPDATE api_keys SET usage_count = usage_count + ? WHERE id = ?',
      args: [increment, keyId]
    })
  }

  async getUserApiKeys(userId: string): Promise<ApiKey[]> {
    const result = await this.client.execute({
      sql: 'SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC',
      args: [userId]
    })

    return result.rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      user_id: row.user_id as string,
      key_hash: row.key_hash as string,
      permissions: JSON.parse(row.permissions as string),
      usage_limit: row.usage_limit as number,
      usage_count: row.usage_count as number,
      created_at: row.created_at as string,
      expires_at: row.expires_at as string | undefined
    }))
  }

  // Utility Methods
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.execute({
        sql: 'SELECT id FROM profiles LIMIT 1',
        args: []
      })
      return true
    } catch {
      return false
    }
  }

  async getStats(userId: string): Promise<{
    conversations: number
    generations: number
    apiKeys: number
    totalUsage: number
  }> {
    const [conversationsResult, generationsResult, apiKeysResult] = await Promise.all([
      this.client.execute({
        sql: 'SELECT COUNT(*) as count FROM conversations WHERE user_id = ?',
        args: [userId]
      }),
      this.client.execute({
        sql: 'SELECT COUNT(*) as count FROM generations WHERE user_id = ?',
        args: [userId]
      }),
      this.client.execute({
        sql: 'SELECT usage_count FROM api_keys WHERE user_id = ?',
        args: [userId]
      })
    ])

    const conversations = Number(conversationsResult.rows[0]?.count) || 0
    const generations = Number(generationsResult.rows[0]?.count) || 0
    const apiKeys = apiKeysResult.rows.length

    const totalUsage = apiKeysResult.rows.reduce((sum: number, row: Record<string, unknown>) =>
      sum + (Number(row.usage_count) || 0), 0)

    return {
      conversations,
      generations,
      apiKeys,
      totalUsage
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()