"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface BrandingSettings {
  companyName: string
  logo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  customDomain: string
  favicon: string
  metaDescription: string
  socialLinks: {
    twitter: string
    linkedin: string
    github: string
    website: string
  }
}

interface BrandingSettingsProps {
  brandingSettings: BrandingSettings
  updateBrandingSetting: (key: keyof BrandingSettings, value: any) => void
}

export function BrandingSettings({ brandingSettings, updateBrandingSetting }: BrandingSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Customization</CardTitle>
        <CardDescription>
          Customize your platform's appearance and branding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={brandingSettings.companyName}
              onChange={(e) => updateBrandingSetting('companyName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-domain">Custom Domain</Label>
            <Input
              id="custom-domain"
              placeholder="yourcompany.com"
              value={brandingSettings.customDomain}
              onChange={(e) => updateBrandingSetting('customDomain', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-description">Meta Description</Label>
          <Input
            id="meta-description"
            value={brandingSettings.metaDescription}
            onChange={(e) => updateBrandingSetting('metaDescription', e.target.value)}
          />
        </div>

        <Separator />

        <div>
          <Label className="text-base font-medium mb-4 block">Color Scheme</Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={brandingSettings.primaryColor}
                  onChange={(e) => updateBrandingSetting('primaryColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={brandingSettings.primaryColor}
                  onChange={(e) => updateBrandingSetting('primaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={brandingSettings.secondaryColor}
                  onChange={(e) => updateBrandingSetting('secondaryColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={brandingSettings.secondaryColor}
                  onChange={(e) => updateBrandingSetting('secondaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={brandingSettings.accentColor}
                  onChange={(e) => updateBrandingSetting('accentColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={brandingSettings.accentColor}
                  onChange={(e) => updateBrandingSetting('accentColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={brandingSettings.fontFamily}
            onValueChange={(value) => updateBrandingSetting('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <Label className="text-base font-medium mb-4 block">Social Links</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                placeholder="@yourcompany"
                value={brandingSettings.socialLinks.twitter}
                onChange={(e) => updateBrandingSetting('socialLinks', {
                  ...brandingSettings.socialLinks,
                  twitter: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/company/yourcompany"
                value={brandingSettings.socialLinks.linkedin}
                onChange={(e) => updateBrandingSetting('socialLinks', {
                  ...brandingSettings.socialLinks,
                  linkedin: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                placeholder="github.com/yourcompany"
                value={brandingSettings.socialLinks.github}
                onChange={(e) => updateBrandingSetting('socialLinks', {
                  ...brandingSettings.socialLinks,
                  github: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://yourcompany.com"
                value={brandingSettings.socialLinks.website}
                onChange={(e) => updateBrandingSetting('socialLinks', {
                  ...brandingSettings.socialLinks,
                  website: e.target.value
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}