"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Download } from "lucide-react"
import { useDesign } from "./design/use-design"
import { ThemeSelector } from "./design/theme-selector"
import { AssetManager } from "./design/asset-manager"
import { ThemeCustomizer } from "./design/theme-customizer"
import { CodeGenerator } from "./design/code-generator"
import { ThemePreview } from "./design/theme-preview"

export function DesignContent() {
  const [activeTab, setActiveTab] = useState('themes')
  const {
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
  } = useDesign()

  const handleSaveTheme = () => {
    applyTheme(customTheme)
  }

  const handleSetThemeName = (name: string) => {
    setCustomTheme(prev => ({ ...prev, name }))
  }

  const handleUpdateAssets = (updates: Partial<typeof brandingAssets>) => {
    setBrandingAssets(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Branding Tools</h2>
          <p className="text-muted-foreground">
            Customize themes, assets, and branding for your AI applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button onClick={exportTheme}>
            <Download className="h-4 w-4 mr-2" />
            Export Theme
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6 mt-6">
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeSelect={applyTheme}
            onImportTheme={importTheme}
          />
        </TabsContent>

        <TabsContent value="assets" className="space-y-6 mt-6">
          <AssetManager
            brandingAssets={brandingAssets}
            onAssetUpload={handleAssetUpload}
            currentTheme={currentTheme}
          />
        </TabsContent>

        <TabsContent value="customize" className="space-y-6 mt-6">
          <ThemeCustomizer
            customTheme={customTheme}
            onUpdateTheme={updateCustomTheme}
            onSaveTheme={handleSaveTheme}
            onSetThemeName={handleSetThemeName}
          />
        </TabsContent>

        <TabsContent value="code" className="space-y-6 mt-6">
          <CodeGenerator
            brandingAssets={brandingAssets}
            currentTheme={currentTheme}
            onUpdateAssets={handleUpdateAssets}
            onCopyCSS={copyCSS}
          />
          <ThemePreview currentTheme={currentTheme} />
        </TabsContent>
      </Tabs>
    </div>
  )
}