"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Save } from "lucide-react"
import { ThemeConfig, fontFamilies } from "./types"

interface ThemeCustomizerProps {
  customTheme: ThemeConfig
  onUpdateTheme: (updates: Partial<ThemeConfig>) => void
  onSaveTheme: () => void
  onSetThemeName: (name: string) => void
}

export function ThemeCustomizer({
  customTheme,
  onUpdateTheme,
  onSaveTheme,
  onSetThemeName
}: ThemeCustomizerProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>
              Customize fonts and text styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={customTheme.fontFamily}
                onValueChange={(value) => onUpdateTheme({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map(font => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Base Font Size: {customTheme.fontSize}px</Label>
              <Slider
                value={[customTheme.fontSize]}
                onValueChange={(value) => onUpdateTheme({ fontSize: value[0] })}
                max={20}
                min={12}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Layout & Spacing</CardTitle>
            <CardDescription>
              Adjust borders, spacing, and layout
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Border Radius: {customTheme.borderRadius}px</Label>
              <Slider
                value={[customTheme.borderRadius]}
                onValueChange={(value) => onUpdateTheme({ borderRadius: value[0] })}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: customTheme.textColor }}
                />
                <Input
                  value={customTheme.textColor}
                  onChange={(e) => onUpdateTheme({ textColor: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Primary Color</Label>
                <Input
                  value={customTheme.primaryColor}
                  onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Secondary Color</Label>
                <Input
                  value={customTheme.secondaryColor}
                  onChange={(e) => onUpdateTheme({ secondaryColor: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Accent Color</Label>
                <Input
                  value={customTheme.accentColor}
                  onChange={(e) => onUpdateTheme({ accentColor: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Background Color</Label>
                <Input
                  value={customTheme.backgroundColor}
                  onChange={(e) => onUpdateTheme({ backgroundColor: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Theme
          </CardTitle>
          <CardDescription>
            Save your custom theme for future use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Theme name"
              value={customTheme.name}
              onChange={(e) => onSetThemeName(e.target.value)}
            />
            <Button onClick={onSaveTheme}>
              <Save className="h-4 w-4 mr-2" />
              Save & Apply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}