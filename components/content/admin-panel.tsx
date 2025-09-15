"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ModelCard } from "@/components/models/model-card"
import ModelAdmin from "@/components/admin/model-admin"
import {
  Settings,
  Layout,
  Move,
  Palette,
  Menu,
  Server,
  Plus,
  Edit,
  Wifi,
  FileText,
  Save
} from "lucide-react"
import { useAdminMode } from "@/contexts/admin-mode-context"

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const { isAdminMode, toggleAdminMode } = useAdminMode()

  const adminSections = [
    {
      id: 'models',
      title: 'Models',
      description: 'Manage AI models and providers',
      icon: Settings,
      color: 'bg-blue-500'
    },
    {
      id: 'tools',
      title: 'Tools',
      description: 'Admin tools and shortcuts',
      icon: Settings,
      color: 'bg-green-500'
    },
    {
      id: 'cards',
      title: 'Cards',
      description: 'Manage custom cards and content',
      icon: Layout,
      color: 'bg-purple-500'
    },
    {
      id: 'layout',
      title: 'Layout',
      description: 'Configure page layouts',
      icon: Move,
      color: 'bg-orange-500'
    },
    {
      id: 'styling',
      title: 'Styling',
      description: 'Customize themes and colors',
      icon: Palette,
      color: 'bg-pink-500'
    },
    {
      id: 'navigation',
      title: 'Navigation',
      description: 'Manage menus and links',
      icon: Menu,
      color: 'bg-indigo-500'
    },
    {
      id: 'servers',
      title: 'Servers',
      description: 'Monitor server connections',
      icon: Server,
      color: 'bg-red-500'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Advanced settings and tools',
      icon: Settings,
      color: 'bg-gray-500'
    }
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
          <p className="text-muted-foreground">
            Manage your application settings and content
          </p>
        </div>
      </div>

      {/* Admin Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {adminSections.map((section) => {
          const Icon = section.icon
          return (
            <Card
              key={section.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeSection === section.id ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-sm">{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant={activeSection === section.id ? "default" : "secondary"} className="text-xs">
                  {activeSection === section.id ? 'Active' : 'Click to open'}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Active Section Content */}
      {activeSection && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const section = adminSections.find(s => s.id === activeSection)
                const Icon = section?.icon
                return Icon ? <Icon className="h-5 w-5" /> : null
              })()}
              {adminSections.find(s => s.id === activeSection)?.title}
            </CardTitle>
            <CardDescription>
              {adminSections.find(s => s.id === activeSection)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeSection === 'models' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">AI Model Management</h3>
                  <p className="text-muted-foreground">
                    Add, update, and manage AI models and their provider configurations
                  </p>
                </div>

                {/* Model Admin Form */}
                <ModelAdmin />
              </div>
            )}

            {activeSection === 'tools' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>
                      Common administrative tasks and shortcuts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.location.hash = '#admin-panel'}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Model Administration
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Content Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Server className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Palette className="h-4 w-4 mr-2" />
                      Theme Editor
                    </Button>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      System Status
                    </CardTitle>
                    <CardDescription>
                      Current system health and connectivity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Services</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Admin Mode</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isAdminMode ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                        <span className={`text-xs ${isAdminMode ? 'text-blue-600' : 'text-gray-500'}`}>
                          {isAdminMode ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleAdminMode}
                        className="w-full"
                      >
                        {isAdminMode ? 'Disable' : 'Enable'} Admin Mode
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'cards' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add New Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Card management functionality would go here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'layout' && (
              <Card>
                <CardHeader>
                  <CardTitle>Layout Management</CardTitle>
                  <CardDescription>
                    Configure grid layouts, responsive breakpoints, and positioning.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Layout configuration would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'styling' && (
              <Card>
                <CardHeader>
                  <CardTitle>Global Styling</CardTitle>
                  <CardDescription>
                    Customize colors, fonts, spacing, and visual themes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Theme customization would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'navigation' && (
              <Card>
                <CardHeader>
                  <CardTitle>Navigation Management</CardTitle>
                  <CardDescription>
                    Add menu items, tabs, sub-tabs, and navigation elements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Navigation management would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'servers' && (
              <Card>
                <CardHeader>
                  <CardTitle>Server Management</CardTitle>
                  <CardDescription>
                    Monitor and manage server connections and integrations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Server management would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'advanced' && (
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Advanced configuration and system settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Advanced settings would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}