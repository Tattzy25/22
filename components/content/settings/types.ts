export interface BrandingSettings {
  companyName: string
  logo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  customDomain: string
  favicon: string
  metaDescription: string
  socialLinks: {
    twitter: string
    linkedin: string
    github: string
    website: string
  }
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  securityAlerts: boolean
  usageReports: boolean
  weeklyDigest: boolean
  modelUpdates: boolean
}

export interface AccountSettings {
  displayName: string
  email: string
  avatar: string
  bio: string
  timezone: string
  language: string
  twoFactorEnabled: boolean
  sessionTimeout: number
}