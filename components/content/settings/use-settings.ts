import { useState } from "react"
import { BrandingSettings, NotificationSettings, AccountSettings } from "./types"

export function useSettingsState() {
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    companyName: 'Bridgit AI',
    logo: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    customDomain: '',
    favicon: '',
    metaDescription: 'AI-powered platform for content creation and automation',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      website: ''
    }
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    usageReports: true,
    weeklyDigest: true,
    modelUpdates: true
  })

  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    displayName: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    bio: 'AI enthusiast and platform user',
    timezone: 'UTC',
    language: 'en',
    twoFactorEnabled: false,
    sessionTimeout: 30
  })

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [showApiKey, setShowApiKey] = useState(false)

  const updateBrandingSetting = (key: keyof BrandingSettings, value: BrandingSettings[keyof BrandingSettings]) => {
    setBrandingSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateAccountSetting = (key: keyof AccountSettings, value: AccountSettings[keyof AccountSettings]) => {
    setAccountSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    console.log('Saving settings:', { brandingSettings, notificationSettings, accountSettings, theme })
    // In a real implementation, this would save to a backend
  }

  const generateApiKey = () => {
    const newKey = `brd_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    console.log('Generated API key:', newKey)
  }

  return {
    brandingSettings,
    notificationSettings,
    accountSettings,
    theme,
    showApiKey,
    updateBrandingSetting,
    updateNotificationSetting,
    updateAccountSetting,
    setTheme,
    setShowApiKey,
    saveSettings,
    generateApiKey
  }
}