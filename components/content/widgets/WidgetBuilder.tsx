"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Settings, Code } from "lucide-react"
import type { Widget, WidgetConfig } from "./types"

type ThemeOption = { id: 'light' | 'dark' | 'auto'; name: string; preview: string }
type WidgetTypeOption = { id: WidgetConfig['type']; name: string; description: string; icon: React.ComponentType<{ className?: string }> }

type Props = {
  config: WidgetConfig
  setConfig: React.Dispatch<React.SetStateAction<WidgetConfig>>
  selectedWidget: Widget | null
  onCancel: () => void
  onSave: () => void
  onGenerate: () => void
  isGenerating: boolean
  generatedCode: string
  onCopyCode: () => void
  themes: ThemeOption[]
  widgetTypes: WidgetTypeOption[]
}

export function WidgetBuilder({
  config,
  setConfig,
  selectedWidget,
  onCancel,
  onSave,
  onGenerate,
  isGenerating,
  generatedCode,
  onCopyCode,
  themes,
  widgetTypes
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">
            {selectedWidget ? `Editing: ${selectedWidget.name}` : 'Create New Widget'}
          </h3>
          <p className="text-muted-foreground">
            Configure your widget settings and generate embed code
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Widget
          </Button>
          <Button onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Code className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Code'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Widget Type Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Widget Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {widgetTypes.map(type => {
                const Icon = type.icon
                return (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${config.type === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                      }`}
                    onClick={() => setConfig(prev => ({ ...prev, type: type.id as WidgetConfig['type'] }))}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Settings */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Widget Title</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={config.subtitle}
                  onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Your API key"
                  value={config.apiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-16"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={config.theme} onValueChange={(value) => setConfig(prev => ({ ...prev, theme: value as WidgetConfig['theme'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme.id} value={theme.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border ${theme.preview}`}></div>
                          {theme.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={config.position} onValueChange={(value) => setConfig(prev => ({ ...prev, position: value as WidgetConfig['position'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="inline">Inline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={config.size} onValueChange={(value) => setConfig(prev => ({ ...prev, size: value as WidgetConfig['size'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Size */}
            {config.size === 'custom' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="400"
                    value={config.width || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, width: parseInt(e.target.value) || undefined }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="600"
                    value={config.height || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, height: parseInt(e.target.value) || undefined }))}
                  />
                </div>
              </div>
            )}

            {/* Behavior Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Avatar</Label>
                  <p className="text-sm text-muted-foreground">Display AI avatar in the widget</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.showAvatar}
                  onChange={(e) => setConfig(prev => ({ ...prev, showAvatar: e.target.checked }))}
                  className="rounded"
                  aria-label="Show avatar in widget"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Open</Label>
                  <p className="text-sm text-muted-foreground">Automatically open widget after delay</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoOpen}
                  onChange={(e) => setConfig(prev => ({ ...prev, autoOpen: e.target.checked }))}
                  className="rounded"
                  aria-label="Auto open widget after delay"
                />
              </div>

              {config.autoOpen && (
                <div className="space-y-2">
                  <Label htmlFor="delay">Auto Open Delay (milliseconds)</Label>
                  <Input
                    id="delay"
                    type="number"
                    value={config.delay}
                    onChange={(e) => setConfig(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show on Mobile</Label>
                  <p className="text-sm text-muted-foreground">Display widget on mobile devices</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.showOnMobile}
                  onChange={(e) => setConfig(prev => ({ ...prev, showOnMobile: e.target.checked }))}
                  className="rounded"
                  aria-label="Show widget on mobile devices"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show on Desktop</Label>
                  <p className="text-sm text-muted-foreground">Display widget on desktop devices</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.showOnDesktop}
                  onChange={(e) => setConfig(prev => ({ ...prev, showOnDesktop: e.target.checked }))}
                  className="rounded"
                  aria-label="Show widget on desktop devices"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Code */}
      {generatedCode && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Embed Code</CardTitle>
              <Button variant="outline" size="sm" onClick={onCopyCode}>
                Copy Code
              </Button>
            </div>
            <CardDescription>
              Copy and paste this code into your website&apos;s HTML
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedCode}
              readOnly
              rows={15}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

