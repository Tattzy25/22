"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Key, Save } from "lucide-react"

interface AccountSettings {
  displayName: string
  email: string
  avatar: string
  bio: string
  timezone: string
  language: string
  twoFactorEnabled: boolean
  sessionTimeout: number
}

interface SecuritySettingsProps {
  accountSettings: AccountSettings
  updateAccountSetting: (key: keyof AccountSettings, value: AccountSettings[keyof AccountSettings]) => void
  showApiKey: boolean
  setShowApiKey: (show: boolean) => void
  generateApiKey: () => void
}

export function SecuritySettings({
  accountSettings,
  updateAccountSetting,
  showApiKey,
  setShowApiKey,
  generateApiKey
}: SecuritySettingsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={accountSettings.twoFactorEnabled}
              onCheckedChange={(checked) => updateAccountSetting('twoFactorEnabled', checked)}
            />
          </div>

          {accountSettings.twoFactorEnabled && (
            <div className="p-4 border rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground mb-2">
                Two-factor authentication is enabled. Use an authenticator app to scan the QR code.
              </p>
              <Button variant="outline" size="sm">Configure 2FA</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for programmatic access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current API Key</Label>
            <div className="flex gap-2">
              <Input
                value={showApiKey ? 'brd_live_1234567890abcdef' : '••••••••••••••••••••••••••'}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={generateApiKey}>
              <Key className="h-4 w-4 mr-2" />
              Generate New Key
            </Button>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Copy Key
            </Button>
          </div>

          <div className="p-4 border rounded-lg bg-muted/20">
            <h4 className="font-medium mb-2">API Key Permissions</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Read access to models</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Generate content</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Manage automations</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Access billing data</span>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}