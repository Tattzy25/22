"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, Code, Zap } from "lucide-react"
import { BrandingAssets, ThemeConfig } from "./types"

interface CodeGeneratorProps {
  brandingAssets: BrandingAssets
  currentTheme: ThemeConfig
  onUpdateAssets: (updates: Partial<BrandingAssets>) => void
  onCopyCSS: () => void
}

export function CodeGenerator({
  brandingAssets,
  currentTheme,
  onUpdateAssets,
  onCopyCSS
}: CodeGeneratorProps) {
  return (
    <div className="space-y-6">
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
              onChange={(e) => onUpdateAssets({ customCSS: e.target.value })}
              rows={12}
              className="font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={onCopyCSS}>
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
              onChange={(e) => onUpdateAssets({ customJS: e.target.value })}
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
    </div>
  )
}