"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  
} from "lucide-react"

// Modularized imports
import { WidgetList } from "./widgets/WidgetList"
import { WidgetBuilder } from "./widgets/WidgetBuilder"
import { AnalyticsView } from "./widgets/AnalyticsView"
import { widgetTypes as WIDGET_TYPES, themes as THEMES } from "./widgets/constants"
import { generateEmbedCode } from "./widgets/utils"
import type { Widget, WidgetConfig, WidgetAnalytics } from "./widgets/types"

// Types moved to ./widgets/types

export function WidgetContent() {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      name: 'Customer Support Chat',
      type: 'chat',
      config: {
        type: 'chat',
        theme: 'auto',
        position: 'bottom-right',
        size: 'medium',
        apiKey: 'sk-...',
        title: 'Need Help?',
        subtitle: 'Chat with our AI assistant',
        primaryColor: '#3b82f6',
        showAvatar: true,
        autoOpen: false,
        delay: 3000,
        showOnMobile: true,
        showOnDesktop: true
      },
      embedCode: '',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      views: 1250,
      interactions: 89,
      status: 'published'
    },
    {
      id: '2',
      name: 'Lead Generation Form',
      type: 'form',
      config: {
        type: 'form',
        theme: 'light',
        position: 'center',
        size: 'large',
        apiKey: 'sk-...',
        title: 'Get Started Today',
        subtitle: 'Tell us about your project',
        primaryColor: '#10b981',
        showAvatar: false,
        autoOpen: false,
        delay: 0,
        showOnMobile: true,
        showOnDesktop: true
      },
      embedCode: '',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      views: 567,
      interactions: 34,
      status: 'published'
    }
  ])

  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)
  const [config, setConfig] = useState<WidgetConfig>({
    type: 'chat',
    theme: 'auto',
    position: 'bottom-right',
    size: 'medium',
    apiKey: '',
    title: 'AI Assistant',
    subtitle: 'Ask me anything!',
    primaryColor: '#3b82f6',
    showAvatar: true,
    autoOpen: false,
    delay: 3000,
    showOnMobile: true,
    showOnDesktop: true
  })

  const [generatedCode, setGeneratedCode] = useState('')
  const [activeTab, setActiveTab] = useState('widgets')
  const [isGenerating, setIsGenerating] = useState(false)
  const [analytics, setAnalytics] = useState<WidgetAnalytics | null>(null)

  // Constants moved to ./widgets/constants

  const generateCode = async () => {
    setIsGenerating(true)
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const code = generateEmbedCode(config, selectedWidget, baseUrl)
      setGeneratedCode(code)

      // Save the widget if editing existing one
      if (selectedWidget) {
        const updatedWidget: Widget = {
          ...selectedWidget,
          config,
          embedCode: code,
          lastModified: new Date()
        }
        setWidgets(prev => prev.map(w => w.id === selectedWidget.id ? updatedWidget : w))
      }

    } catch (error) {
      console.error('Error generating code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      // Could show a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const createNewWidget = () => {
    setSelectedWidget(null)
    setConfig({
      type: 'chat',
      theme: 'auto',
      position: 'bottom-right',
      size: 'medium',
      apiKey: '',
      title: 'AI Assistant',
      subtitle: 'Ask me anything!',
      primaryColor: '#3b82f6',
      showAvatar: true,
      autoOpen: false,
      delay: 3000,
      showOnMobile: true,
      showOnDesktop: true
    })
    setGeneratedCode('')
    setActiveTab('builder')
  }

  const saveWidget = () => {
    if (!selectedWidget) {
      // Create new widget
      const newWidget: Widget = {
        id: `widget-${Date.now()}`,
        name: config.title,
        type: config.type,
        config,
        embedCode: generatedCode,
        createdAt: new Date(),
        lastModified: new Date(),
        views: 0,
        interactions: 0,
        status: 'draft'
      }
      setWidgets(prev => [...prev, newWidget])
      setSelectedWidget(newWidget)
    }
    setActiveTab('widgets')
  }

  const deleteWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId))
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null)
    }
  }

  const loadWidgetAnalytics = (widgetId: string) => {
    // Mock analytics data
    setAnalytics({
      widgetId,
      totalViews: Math.floor(Math.random() * 10000) + 1000,
      totalInteractions: Math.floor(Math.random() * 1000) + 100,
      conversionRate: Math.random() * 20 + 5,
      avgSessionDuration: Math.random() * 300 + 60,
      topPages: [
        { page: '/home', views: 450 },
        { page: '/products', views: 320 },
        { page: '/about', views: 280 },
        { page: '/contact', views: 180 }
      ],
      deviceBreakdown: {
        mobile: 65,
        desktop: 30,
        tablet: 5
      },
      hourlyActivity: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Widget Generator</h2>
          <p className="text-muted-foreground">
            Create and manage embeddable AI widgets for your website
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={createNewWidget}>
            <Plus className="h-4 w-4 mr-2" />
            New Widget
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="widgets">My Widgets</TabsTrigger>
          <TabsTrigger value="builder">Widget Builder</TabsTrigger>
          <TabsTrigger value="analytics" disabled={!analytics}>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="widgets" className="space-y-6">
          <WidgetList
            widgets={widgets}
            onEdit={(widget) => {
              setSelectedWidget(widget)
              setConfig(widget.config)
              setGeneratedCode(widget.embedCode)
              setActiveTab('builder')
            }}
            onAnalytics={(id) => {
              loadWidgetAnalytics(id)
              setActiveTab('analytics')
            }}
            onDelete={deleteWidget}
          />
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <WidgetBuilder
            config={config}
            setConfig={setConfig}
            selectedWidget={selectedWidget}
            onCancel={() => setActiveTab('widgets')}
            onSave={saveWidget}
            onGenerate={generateCode}
            isGenerating={isGenerating}
            generatedCode={generatedCode}
            onCopyCode={copyToClipboard}
            themes={THEMES}
            widgetTypes={WIDGET_TYPES}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && <AnalyticsView analytics={analytics} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
