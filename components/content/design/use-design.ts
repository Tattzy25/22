"use client"

import { useState } from "react"
import { ThemeConfig, BrandingAssets, predefinedThemes } from "./types"

export function useDesign() {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(predefinedThemes[0])
  const [customTheme, setCustomTheme] = useState<ThemeConfig>(predefinedThemes[0])
  const [brandingAssets, setBrandingAssets] = useState<BrandingAssets>({
    logo: null,
    favicon: null,
    banner: null,
    customCSS: '',
    customJS: ''
  })
  const [previewMode, setPreviewMode] = useState(false)

  const applyTheme = (theme: ThemeConfig) => {
    setCurrentTheme(theme)
    setCustomTheme(theme)
    // In a real implementation, this would apply the theme to the entire app
  }

  const updateCustomTheme = (updates: Partial<ThemeConfig>) => {
    const newTheme = { ...customTheme, ...updates }
    setCustomTheme(newTheme)
    setCurrentTheme(newTheme)
  }

  const exportTheme = () => {
    const themeData = {
      theme: currentTheme,
      assets: brandingAssets,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bridgit-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string)
        if (themeData.theme) {
          setCurrentTheme(themeData.theme)
          setCustomTheme(themeData.theme)
        }
        if (themeData.assets) {
          setBrandingAssets(themeData.assets)
        }
      } catch (error) {
        console.error('Failed to import theme:', error)
      }
    }
    reader.readAsText(file)
  }

  const handleAssetUpload = (type: keyof BrandingAssets, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // In a real implementation, this would upload to a server
    const url = URL.createObjectURL(file)
    setBrandingAssets(prev => ({ ...prev, [type]: url }))
  }

  const copyCSS = () => {
    const css = `
:root {
  --primary-color: ${currentTheme.primaryColor};
  --secondary-color: ${currentTheme.secondaryColor};
  --accent-color: ${currentTheme.accentColor};
  --background-color: ${currentTheme.backgroundColor};
  --text-color: ${currentTheme.textColor};
  --border-radius: ${currentTheme.borderRadius}px;
  --font-family: ${currentTheme.fontFamily};
  --font-size: ${currentTheme.fontSize}px;
}
${brandingAssets.customCSS}
    `.trim()
    navigator.clipboard.writeText(css)
  }

  return {
    currentTheme,
    customTheme,
    setCustomTheme,
    brandingAssets,
    setBrandingAssets,
    previewMode,
    setPreviewMode,
    applyTheme,
    updateCustomTheme,
    exportTheme,
    importTheme,
    handleAssetUpload,
    copyCSS
  }
}