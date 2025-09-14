import { createClient } from '@supabase/supabase-js'

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
  private supabase

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
    }

    if (!supabaseKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  // Profile Management
  async createProfile(profile: Omit<Profile, 'created_at'>): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Conversation Management
  async saveConversation(conversation: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>): Promise<Conversation> {
    const { data, error } = await this.supabase
      .from('conversations')
      .insert({
        ...conversation,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserConversations(userId: string, limit = 50): Promise<Conversation[]> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  async updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<Conversation> {
    const { data, error } = await this.supabase
      .from('conversations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', conversationId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', userId)

    if (error) throw error
  }

  // Generation Tracking
  async saveGeneration(generation: Omit<Generation, 'id' | 'created_at'>): Promise<Generation> {
    const { data, error } = await this.supabase
      .from('generations')
      .insert({
        ...generation,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserGenerations(userId: string, type?: string, limit = 50): Promise<Generation[]> {
    let query = this.supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // API Key Management
  async createApiKey(apiKey: Omit<ApiKey, 'id' | 'created_at' | 'usage_count'>): Promise<ApiKey> {
    const { data, error } = await this.supabase
      .from('api_keys')
      .insert({
        ...apiKey,
        usage_count: 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getApiKey(keyHash: string): Promise<ApiKey | null> {
    const { data, error } = await this.supabase
      .from('api_keys')
      .select('*')
      .eq('key_hash', keyHash)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async updateApiKeyUsage(keyId: string, increment = 1): Promise<void> {
    const { error } = await this.supabase.rpc('increment_api_key_usage', {
      key_id: keyId,
      increment_by: increment
    })

    if (error) throw error
  }

  async getUserApiKeys(userId: string): Promise<ApiKey[]> {
    const { data, error } = await this.supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Utility Methods
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .select('id')
        .limit(1)

      return !error
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
    const [conversations, generations, apiKeysResult] = await Promise.all([
      this.supabase.from('conversations').select('id', { count: 'exact' }).eq('user_id', userId),
      this.supabase.from('generations').select('id', { count: 'exact' }).eq('user_id', userId),
      this.supabase.from('api_keys').select('usage_count').eq('user_id', userId)
    ])

    const totalUsage = apiKeysResult.data?.reduce((sum: number, key: { usage_count: number }) =>
      sum + (key.usage_count || 0), 0) || 0

    return {
      conversations: conversations.count || 0,
      generations: generations.count || 0,
      apiKeys: apiKeysResult.count || 0,
      totalUsage
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()