"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Check } from "lucide-react"
import { ThemeConfig, predefinedThemes } from "./types"

interface ThemeSelectorProps {
  currentTheme: ThemeConfig
  onThemeSelect: (theme: ThemeConfig) => void
  onImportTheme: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function ThemeSelector({ currentTheme, onThemeSelect, onImportTheme }: ThemeSelectorProps) {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Predefined Themes</h3>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".json"
            onChange={onImportTheme}
            className="hidden"
            id="theme-import"
            aria-label="Import theme file"
          />
          <Button variant="outline" onClick={() => document.getElementById('theme-import')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import Theme
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {predefinedThemes.map(theme => (
          <Card
            key={theme.name}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              currentTheme.name === theme.name ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onThemeSelect(theme)}
          >
            <CardContent className="p-4">
              <div
                className="h-24 rounded-lg mb-3 border"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderColor: theme.secondaryColor
                }}
              >
                <div className="p-2 space-y-1">
                  <div
                    className="h-2 rounded"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div
                    className="h-2 rounded w-3/4"
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                  <div
                    className="h-2 rounded w-1/2"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>
              </div>
              <h4 className="font-medium text-center">{theme.name}</h4>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {theme.fontFamily}, {theme.borderRadius}px radius
              </p>
              {currentTheme.name === theme.name && (
                <div className="flex justify-center mt-2">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}