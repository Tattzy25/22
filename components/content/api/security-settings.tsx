"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, AlertTriangle, RefreshCw, Shield, Settings } from "lucide-react"
import { APIKey } from "./types"

interface SecuritySettingsProps {
  apiKeys: APIKey[]
}

export function SecuritySettings({ apiKeys }: SecuritySettingsProps) {
  return (
    <div className="grid gap-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your API keys are encrypted and stored securely. We recommend rotating keys regularly and using separate keys for different environments.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Key Rotation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Automatically rotate API keys to maintain security
            </p>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Rotate All Keys
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Get notified of suspicious API usage
            </p>
            <Switch defaultChecked />
            <Label className="ml-2">Enable alerts</Label>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map(key => (
              <div key={key.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h4 className="font-medium">{key.name}</h4>
                  <p className="text-sm text-muted-foreground">{key.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                  {key.permissions.map(permission => (
                    <Badge key={permission} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}