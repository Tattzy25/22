export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at: string
}

export class AuthService {
  async getCurrentUser(): Promise<User | null> {
    // Stub implementation - returns null to indicate no auth
    return null
  }
}

export const authService = new AuthService()
