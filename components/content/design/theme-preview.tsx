"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeConfig } from "./types"

interface ThemePreviewProps {
  currentTheme: ThemeConfig
}

export function ThemePreview({ currentTheme }: ThemePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Preview</CardTitle>
        <CardDescription>
          See how your theme looks in action
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: currentTheme.backgroundColor,
            color: currentTheme.textColor,
            fontFamily: currentTheme.fontFamily,
            borderRadius: `${currentTheme.borderRadius}px`
          }}
        >
          <div className="space-y-4">
            <div
              className="h-8 rounded"
              style={{
                backgroundColor: currentTheme.primaryColor,
                borderRadius: `${currentTheme.borderRadius}px`
              }}
            />
            <div className="flex gap-2">
              <div
                className="h-6 w-16 rounded"
                style={{
                  backgroundColor: currentTheme.secondaryColor,
                  borderRadius: `${currentTheme.borderRadius}px`
                }}
              />
              <div
                className="h-6 w-12 rounded"
                style={{
                  backgroundColor: currentTheme.accentColor,
                  borderRadius: `${currentTheme.borderRadius}px`
                }}
              />
            </div>
            <p style={{ fontSize: `${currentTheme.fontSize}px` }}>
              This is how your text will look with the current theme settings.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}