"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Palette,
  Image as ImageIcon,
  Code,
  Download,
  Upload,
  Eye,
  Save,
  RefreshCw,
  Settings,
  Type,
  Layout,
  Zap,
  Star,
  Heart,
  Check,
  Copy,
  Share
} from "lucide-react"

interface ThemeConfig {
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  borderRadius: number
  fontFamily: string
  fontSize: number
}

interface BrandingAssets {
  logo: string | null
  favicon: string | null
  banner: string | null
  customCSS: string
  customJS: string
}

const predefinedThemes = [
  {
    name: 'Default',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: 8,
    fontFamily: 'Inter',
    fontSize: 14
  },
  {
    name: 'Dark',
    primaryColor: '#60a5fa',
    secondaryColor: '#94a3b8',
    accentColor: '#fbbf24',
    backgroundColor: '#1f2937',
    textColor: '#f9fafb',
    borderRadius: 8,
    fontFamily: 'Inter',
    fontSize: 14
  },
  {
    name: 'Minimal',
    primaryColor: '#000000',
    secondaryColor: '#6b7280',
    accentColor: '#ef4444',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    borderRadius: 0,
    fontFamily: 'Helvetica',
    fontSize: 14
  },
  {
    name: 'Colorful',
    primaryColor: '#8b5cf6',
    secondaryColor: '#06b6d4',
    accentColor: '#10b981',
    backgroundColor: '#fef3c7',
    textColor: '#1f2937',
    borderRadius: 12,
    fontFamily: 'Poppins',
    fontSize: 14
  }
]

const fontFamilies = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Helvetica', 'Arial', 'Georgia', 'Times New Roman'
]

export function DesignContent() {
  const [activeTab, setActiveTab] = useState('themes')
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
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Predefined Themes</h3>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={importTheme}
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
                  onClick={() => applyTheme(theme)}
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
        </TabsContent>

        <TabsContent value="assets" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Logo & Branding
                </CardTitle>
                <CardDescription>
                  Upload your brand assets and logos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                      {brandingAssets.logo ? (
                        <img src={brandingAssets.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAssetUpload('logo', e)}
                        className="hidden"
                        id="logo-upload"
                        aria-label="Upload logo image"
                      />
                      <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, SVG up to 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                      {brandingAssets.favicon ? (
                        <img src={brandingAssets.favicon} alt="Favicon" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAssetUpload('favicon', e)}
                        className="hidden"
                        id="favicon-upload"
                        aria-label="Upload favicon image"
                      />
                      <Button variant="outline" onClick={() => document.getElementById('favicon-upload')?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Favicon
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        ICO, PNG 32x32px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-12 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                      {brandingAssets.banner ? (
                        <img src={brandingAssets.banner} alt="Banner" className="w-full h-full object-cover rounded" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAssetUpload('banner', e)}
                        className="hidden"
                        id="banner-upload"
                        aria-label="Upload banner image"
                      />
                      <Button variant="outline" onClick={() => document.getElementById('banner-upload')?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Banner
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        1200x300px recommended
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Palette
                </CardTitle>
                <CardDescription>
                  Current theme colors and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: currentTheme.primaryColor }}
                        />
                        <Input
                          value={currentTheme.primaryColor}
                          onChange={(e) => updateCustomTheme({ primaryColor: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: currentTheme.secondaryColor }}
                        />
                        <Input
                          value={currentTheme.secondaryColor}
                          onChange={(e) => updateCustomTheme({ secondaryColor: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Accent Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: currentTheme.accentColor }}
                        />
                        <Input
                          value={currentTheme.accentColor}
                          onChange={(e) => updateCustomTheme({ accentColor: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Background</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: currentTheme.backgroundColor }}
                        />
                        <Input
                          value={currentTheme.backgroundColor}
                          onChange={(e) => updateCustomTheme({ backgroundColor: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customize" className="space-y-6 mt-6">
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
                    onValueChange={(value) => updateCustomTheme({ fontFamily: value })}
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
                    onValueChange={(value) => updateCustomTheme({ fontSize: value[0] })}
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
                    onValueChange={(value) => updateCustomTheme({ borderRadius: value[0] })}
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
                      style={{ backgroundColor: currentTheme.textColor }}
                    />
                    <Input
                      value={currentTheme.textColor}
                      onChange={(e) => updateCustomTheme({ textColor: e.target.value })}
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
                  onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                />
                <Button onClick={() => applyTheme(customTheme)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save & Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Custom CSS
                </CardTitle>
                <CardDescription>
                  Add custom CSS for advanced styling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="/* Add your custom CSS here */
.my-custom-class {
  /* Custom styles */
}"
                  value={brandingAssets.customCSS}
                  onChange={(e) => setBrandingAssets(prev => ({ ...prev, customCSS: e.target.value }))}
                  rows={12}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={copyCSS}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy CSS Variables
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSS
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Custom JavaScript
                </CardTitle>
                <CardDescription>
                  Add custom JavaScript for interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="// Add your custom JavaScript here
console.log('Custom JS loaded');"
                  value={brandingAssets.customJS}
                  onChange={(e) => setBrandingAssets(prev => ({ ...prev, customJS: e.target.value }))}
                  rows={12}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2 mt-4">
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy JS
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export JS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

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
        </TabsContent>
      </Tabs>
    </div>
  )
}