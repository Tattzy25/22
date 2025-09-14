"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Copy, Settings, Trash2 } from "lucide-react"
import { APIKey, aiProviders } from "./types"

interface ApiKeysProps {
  apiKeys: APIKey[]
  visibleKeys: Set<string>
  onToggleVisibility: (keyId: string) => void
  onToggleStatus: (keyId: string) => void
  onDeleteKey: (keyId: string) => void
  onCopyToClipboard: (text: string) => void
}

export function ApiKeys({
  apiKeys,
  visibleKeys,
  onToggleVisibility,
  onToggleStatus,
  onDeleteKey,
  onCopyToClipboard
}: ApiKeysProps) {
  const getProviderInfo = (providerId: string) => {
    return aiProviders.find(p => p.id === providerId)
  }

  return (
    <div className="grid gap-4">
      {apiKeys.map(key => {
        const provider = getProviderInfo(key.provider)
        return (
          <Card key={key.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{provider?.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{key.name}</h3>
                    <p className="text-muted-foreground">{provider?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={key.isActive ? 'default' : 'secondary'}>
                    {key.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Switch
                    checked={key.isActive}
                    onCheckedChange={() => onToggleStatus(key.id)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-sm text-muted-foreground">API Key</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {visibleKeys.has(key.id) ? key.key : key.maskedKey}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleVisibility(key.id)}
                    >
                      {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopyToClipboard(key.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Created</Label>
                  <p className="text-sm mt-1">{key.createdAt.toLocaleDateString()}</p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Last Used</Label>
                  <p className="text-sm mt-1">
                    {key.lastUsed ? key.lastUsed.toLocaleDateString() : 'Never'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Usage</Label>
                  <p className="text-sm mt-1">
                    {key.usage.requests.toLocaleString()} requests
                  </p>
                </div>
              </div>

              <Separator className="mb-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span>Requests: {key.usage.requests}/{key.limits.monthlyRequests}</span>
                  <span>Tokens: {key.usage.tokens.toLocaleString()}/{key.limits.monthlyTokens.toLocaleString()}</span>
                  <span>Cost: ${key.usage.cost}/${key.limits.monthlyBudget}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteKey(key.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}