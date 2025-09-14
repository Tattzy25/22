import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { DatabaseService } from './database'

export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at: string
}

export class AuthService {
  private supabase
  private databaseService

  constructor() {
    this.supabase = createClientComponentClient()
    this.databaseService = new DatabaseService()
  }

  async signUp(email: string, password: string, username?: string): Promise<User> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0]
        }
      }
    })

    if (error) throw error
    if (!data.user) throw new Error('User creation failed')

    // Create profile in database
    const profile = await this.databaseService.createProfile({
      id: data.user.id,
      email: data.user.email!,
      username: username || data.user.email!.split('@')[0],
      avatar_url: data.user.user_metadata?.avatar_url
    })

    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    if (!data.user) throw new Error('Sign in failed')

    // Get or create profile
    let profile = await this.databaseService.getProfile(data.user.id)
    if (!profile) {
      profile = await this.databaseService.createProfile({
        id: data.user.id,
        email: data.user.email!,
        username: data.user.email!.split('@')[0],
        avatar_url: data.user.user_metadata?.avatar_url
      })
    }

    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    if (error || !user) return null

    const profile = await this.databaseService.getProfile(user.id)
    if (!profile) return null

    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at
    }
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
  }

  async updateProfile(updates: Partial<Pick<User, 'username' | 'avatar_url'>>): Promise<User> {
    const { data: { user }, error: userError } = await this.supabase.auth.getUser()
    if (userError || !user) throw new Error('Not authenticated')

    // Update auth metadata if avatar changed
    if (updates.avatar_url) {
      await this.supabase.auth.updateUser({
        data: { avatar_url: updates.avatar_url }
      })
    }

    // Update profile in database
    const profile = await this.databaseService.updateProfile(user.id, updates)

    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at
    }
  }

  // Auth state listener
  onAuthStateChange(callback: (user: User | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await this.databaseService.getProfile(session.user.id)
        if (profile) {
          callback({
            id: profile.id,
            email: profile.email,
            username: profile.username,
            avatar_url: profile.avatar_url,
            created_at: profile.created_at
          })
        } else {
          callback(null)
        }
      } else if (event === 'SIGNED_OUT') {
        callback(null)
      }
    })
  }

  // OAuth sign in
  async signInWithProvider(provider: 'google' | 'github' | 'discord') {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // Email verification
  async resendVerificationEmail(): Promise<void> {
    const currentUser = await this.getCurrentUser()
    if (!currentUser?.email) throw new Error('No email found for current user')

    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email: currentUser.email
    })
    if (error) throw error
  }
}

// Export singleton instance
export const authService = new AuthService()