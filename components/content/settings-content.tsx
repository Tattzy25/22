"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"
import { ProfileSettings } from "./settings/profile-settings"
import { BrandingSettings } from "./settings/branding-settings"
import { NotificationSettings } from "./settings/notification-settings"
import { SecuritySettings } from "./settings/security-settings"
import { PreferencesSettings } from "./settings/preferences-settings"
import { useSettingsState } from "./settings/use-settings"

export function SettingsContent() {
  const {
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
  } = useSettingsState()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Button onClick={saveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="flex-1">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <ProfileSettings
            accountSettings={accountSettings}
            updateAccountSetting={updateAccountSetting}
          />
        </TabsContent>

        <TabsContent value="branding" className="space-y-6 mt-6">
          <BrandingSettings
            brandingSettings={brandingSettings}
            updateBrandingSetting={updateBrandingSetting}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <NotificationSettings
            notificationSettings={notificationSettings}
            updateNotificationSetting={updateNotificationSetting}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <SecuritySettings
            accountSettings={accountSettings}
            updateAccountSetting={updateAccountSetting}
            showApiKey={showApiKey}
            setShowApiKey={setShowApiKey}
            generateApiKey={generateApiKey}
          />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 mt-6">
          <PreferencesSettings
            theme={theme}
            setTheme={setTheme}
            accountSettings={accountSettings}
            updateAccountSetting={updateAccountSetting}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}