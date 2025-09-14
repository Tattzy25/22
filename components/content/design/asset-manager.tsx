"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Image as ImageIcon, Upload, Palette } from "lucide-react"
import { BrandingAssets } from "./types"

interface AssetManagerProps {
  brandingAssets: BrandingAssets
  onAssetUpload: (type: keyof BrandingAssets, event: React.ChangeEvent<HTMLInputElement>) => void
  currentTheme: any // Using any to avoid import issues
}

export function AssetManager({ brandingAssets, onAssetUpload, currentTheme }: AssetManagerProps) {
  return (
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
                  onChange={(e) => onAssetUpload('logo', e)}
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
                  onChange={(e) => onAssetUpload('favicon', e)}
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
                  onChange={(e) => onAssetUpload('banner', e)}
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
                  <span className="text-sm font-mono">{currentTheme.primaryColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: currentTheme.secondaryColor }}
                  />
                  <span className="text-sm font-mono">{currentTheme.secondaryColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Accent Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  />
                  <span className="text-sm font-mono">{currentTheme.accentColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Background</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: currentTheme.backgroundColor }}
                  />
                  <span className="text-sm font-mono">{currentTheme.backgroundColor}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}