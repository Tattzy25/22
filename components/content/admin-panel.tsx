"use client"

import { useState } from "react"
import ModelAdmin from "@/components/admin/model-admin"
import { ModelCard } from "@/components/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PreviewModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  pricing: {
    inputTokens: string
    outputTokens: string
  }
  rating: number
  contextWindow: string
  responseTime: string
  status: 'available' | 'beta' | 'deprecated'
}

export function AdminPanel() {
  const [previewModel, setPreviewModel] = useState<PreviewModel | null>(null)

  const handleFormChange = (formData: any) => {
    // Convert form data to preview model format
    const preview: PreviewModel = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name || 'Model Name',
      provider: formData.provider || 'Provider',
      description: formData.description || 'Model description will appear here...',
      capabilities: formData.capabilities.length > 0 ? formData.capabilities : ['Capability 1', 'Capability 2', 'Capability 3'],
      pricing: {
        inputTokens: formData.inputTokens || '$0.00',
        outputTokens: formData.outputTokens || '$0.00',
      },
      rating: 4.5,
      contextWindow: formData.contextWindow || 'Unknown',
      responseTime: formData.responseTime || 'Unknown',
      status: 'available'
    }
    setPreviewModel(preview)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
          <p className="text-muted-foreground">
            Customize and manage your application settings
          </p>
        </div>
      </div>

      {/* AI Model Management Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">AI Model Management</h3>
          <p className="text-muted-foreground">
            Add, update, and manage AI models and their provider configurations
          </p>
        </div>

        {/* Two-column layout: Form on left, Preview on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Form */}
          <div>
            <ModelAdmin onFormChange={handleFormChange} />
          </div>

          {/* Preview Card */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Model Card Preview</CardTitle>
                <CardDescription>
                  This shows how your model will appear to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {previewModel ? (
                  <ModelCard model={previewModel} />
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <div className="text-muted-foreground">
                      <div className="font-audiowide text-xl mb-2">Model Name</div>
                      <div className="text-sm mb-2">by Provider</div>
                      <div className="text-xs space-y-1">
                        <div>• Capability 1</div>
                        <div>• Capability 2</div>
                        <div>• Capability 3</div>
                      </div>
                      <div className="mt-4 text-xs text-muted-foreground">
                        Model description will appear here...
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}