"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Settings,
  Layout,
  Palette,
  Menu,
  Eye,
  EyeOff,
  Move,
  Trash2,
  Copy,
  Edit,
  Save,
  FileText,
  Server,
  Play,
  Square,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff
} from "lucide-react"

interface CustomCard {
  id: string
  title: string
  content: string
  type: 'text' | 'metric' | 'chart' | 'button' | 'image' | 'custom'
  size: 'small' | 'medium' | 'large' | 'full'
  position: number
  visible: boolean
  style: {
    backgroundColor?: string
    textColor?: string
    borderRadius?: string
    padding?: string
  }
}

interface MCPServer {
  id: string
  name: string
  description: string
  endpoint: string
  status: 'connected' | 'idle' | 'error' | 'offline'
  tools: string[]
}

interface CustomizationFooterProps {
  onPageChange?: (pageId: string) => void
  currentPageId?: string
  onAdminModeToggle?: () => void
  isAdminMode?: boolean
}

export function CustomizationFooter({ onPageChange, currentPageId = 'home', onAdminModeToggle, isAdminMode = false }: CustomizationFooterProps) {
  const [cards, setCards] = useState<CustomCard[]>([
    {
      id: 'welcome',
      title: 'Welcome Card',
      content: 'Welcome to your admin dashboard. This card can be customized.',
      type: 'text',
      size: 'medium',
      position: 0,
      visible: true,
      style: {}
    }
  ])

  const [activeTab, setActiveTab] = useState('pages')
  const [selectedCard, setSelectedCard] = useState<CustomCard | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [newCardContent, setNewCardContent] = useState('')
  const [newCardType, setNewCardType] = useState<CustomCard['type']>('text')
  const [newCardSize, setNewCardSize] = useState<CustomCard['size']>('medium')

  // MCP Server state
  const [servers, setServers] = useState<MCPServer[]>([
    {
      id: 'canva',
      name: 'Canva Design Server',
      description: 'Import/export designs',
      endpoint: 'https://musarty.com/api/mcp/canva',
      status: 'connected',
      tools: ['import_design', 'export_design']
    },
    {
      id: 'figma',
      name: 'Figma Integration Server',
      description: 'Design file management',
      endpoint: 'https://musarty.com/api/mcp/figma',
      status: 'idle',
      tools: ['import_figma', 'export_figma']
    },
    {
      id: 'ai-content',
      name: 'AI Content Generation',
      description: 'Text and image generation',
      endpoint: 'https://musarty.com/api/mcp/ai',
      status: 'error',
      tools: ['generate_text', 'generate_image']
    },
    {
      id: 'database',
      name: 'Database Connector',
      description: 'Data management and queries',
      endpoint: 'https://musarty.com/api/mcp/database',
      status: 'offline',
      tools: ['query_data', 'update_data']
    },
    {
      id: 'analytics',
      name: 'Analytics & Tracking',
      description: 'User behavior analytics',
      endpoint: 'https://musarty.com/api/mcp/analytics',
      status: 'connected',
      tools: ['track_event', 'get_analytics']
    }
  ])

  // Available pages for selection
  const availablePages = [
    { id: 'home', name: 'Home Page', description: 'Main landing page' },
    { id: 'music', name: 'Music Page', description: 'Music content and playlists' },
    { id: 'culture', name: 'Culture Page', description: 'Cultural content and articles' },
    { id: 'about', name: 'About Page', description: 'About us and company info' },
    { id: 'contact', name: 'Contact Page', description: 'Contact information and forms' },
    { id: 'blog', name: 'Blog Page', description: 'Blog posts and articles' }
  ]

  const handlePageChange = (pageId: string) => {
    if (onPageChange) {
      onPageChange(pageId)
    }
  }

  const renderCardContent = (card: CustomCard) => {
    switch (card.type) {
      case 'text':
        return <p className="text-sm">{card.content}</p>
      case 'metric':
        return (
          <div className="text-center">
            <div className="text-2xl font-bold">{card.content}</div>
            <div className="text-xs text-muted-foreground">{card.title}</div>
          </div>
        )
      case 'button':
        return (
          <Button className="w-full" variant="outline">
            {card.content || card.title}
          </Button>
        )
      case 'chart':
        return (
          <div className="h-32 bg-muted/20 rounded flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Chart: {card.title}</span>
          </div>
        )
      case 'image':
        return (
          <div className="h-32 bg-muted/20 rounded flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Image: {card.title}</span>
          </div>
        )
      default:
        return <p className="text-sm">{card.content}</p>
    }
  }

  const addNewCard = () => {
    if (!newCardTitle.trim()) return

    const newCard: CustomCard = {
      id: `card-${Date.now()}`,
      title: newCardTitle,
      content: newCardContent,
      type: newCardType,
      size: newCardSize,
      position: cards.length,
      visible: true,
      style: {}
    }

    setCards(prev => [...prev, newCard])
    setNewCardTitle('')
    setNewCardContent('')
    setNewCardType('text')
    setNewCardSize('medium')
  }

  const updateCard = (cardId: string, updates: Partial<CustomCard>) => {
    setCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    ))
  }

  const deleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId))
  }

  const duplicateCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId)
    if (!card) return

    const duplicatedCard: CustomCard = {
      ...card,
      id: `card-${Date.now()}`,
      title: `${card.title} (Copy)`,
      position: cards.length
    }

    setCards(prev => [...prev, duplicatedCard])
  }

  // Server management functions
  const startServer = (serverId: string) => {
    setServers(prev => prev.map(server =>
      server.id === serverId
        ? { ...server, status: 'connected' as const }
        : server
    ))
  }

  const stopServer = (serverId: string) => {
    setServers(prev => prev.map(server =>
      server.id === serverId
        ? { ...server, status: 'offline' as const }
        : server
    ))
  }

  const startAllServers = () => {
    setServers(prev => prev.map(server => ({
      ...server,
      status: 'connected' as const
    })))
  }

  const stopAllServers = () => {
    setServers(prev => prev.map(server => ({
      ...server,
      status: 'offline' as const
    })))
  }

  // Computed server stats
  const serverStats = {
    connected: servers.filter(s => s.status === 'connected').length,
    error: servers.filter(s => s.status === 'error').length,
    idle: servers.filter(s => s.status === 'idle').length,
    offline: servers.filter(s => s.status === 'offline').length
  }

  return (
    <Card className="mt-8 border-t-4 border-t-primary">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Customization Management Footer
            </CardTitle>
            <CardDescription>
              Complete control over your dashboard customization. Add, resize, and manage all components.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onAdminModeToggle}
              variant={isAdminMode ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              {isAdminMode ? "Exit Admin Mode" : "Navigate & Edit"}
            </Button>
            <Badge variant="secondary" className="px-3 py-1">
              {cards.length} Cards Active
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Cards
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Move className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="styling" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Styling
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="servers" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Servers
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Page Selection
                </CardTitle>
                <CardDescription>
                  Choose a page to customize. Each page maintains its own layout and components.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePages.map((page) => (
                    <Card
                      key={page.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        currentPageId === page.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handlePageChange(page.id)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{page.name}</CardTitle>
                        <CardDescription className="text-sm">{page.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Badge variant={currentPageId === page.id ? "default" : "secondary"} className="text-xs">
                          {currentPageId === page.id ? 'Active' : 'Select'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Currently editing:</strong> {availablePages.find(p => p.id === currentPageId)?.name || 'Unknown Page'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Changes made in the page builder above will be saved to this page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Component Editor
                </CardTitle>
                <CardDescription>
                  {isAdminMode
                    ? "Click on any component on the page to edit it, or use the tools below to add new components."
                    : "Enable admin mode to start editing page components."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAdminMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center gap-2"
                        onClick={() => {
                          // This will be handled by the editable wrapper
                          const event = new CustomEvent('addComponent', { detail: { type: 'text' } })
                          window.dispatchEvent(event)
                        }}
                      >
                        <FileText className="h-6 w-6" />
                        <span className="text-xs">Text</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center gap-2"
                        onClick={() => {
                          const event = new CustomEvent('addComponent', { detail: { type: 'button' } })
                          window.dispatchEvent(event)
                        }}
                      >
                        <Layout className="h-6 w-6" />
                        <span className="text-xs">Button</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center gap-2"
                        onClick={() => {
                          const event = new CustomEvent('addComponent', { detail: { type: 'card' } })
                          window.dispatchEvent(event)
                        }}
                      >
                        <Settings className="h-6 w-6" />
                        <span className="text-xs">Card</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center gap-2"
                        onClick={() => {
                          const event = new CustomEvent('addComponent', { detail: { type: 'image' } })
                          window.dispatchEvent(event)
                        }}
                      >
                        <Palette className="h-6 w-6" />
                        <span className="text-xs">Image</span>
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Instructions:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Click on any component on the page to edit its content</li>
                        <li>• Use the buttons above to add new components</li>
                        <li>• Hover over components to see edit controls</li>
                        <li>• Drag components to reposition them</li>
                        <li>• All changes are saved automatically</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Edit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Click &quot;Navigate &amp; Edit&quot; to enable component editing mode
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4 mt-6">
            {/* Add New Card Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      placeholder="Card title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newCardType} onValueChange={(value: CustomCard['type']) => setNewCardType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="metric">Metric</SelectItem>
                        <SelectItem value="chart">Chart</SelectItem>
                        <SelectItem value="button">Button</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Select value={newCardSize} onValueChange={(value: CustomCard['size']) => setNewCardSize(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="full">Full Width</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={newCardContent}
                      onChange={(e) => setNewCardContent(e.target.value)}
                      placeholder="Card content..."
                      rows={2}
                    />
                  </div>
                </div>
                <Button onClick={addNewCard} className="mt-4" disabled={!newCardTitle.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </CardContent>
            </Card>

            {/* Cards Management */}
            <div className="space-y-4">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  className={`transition-all duration-200 ${card.visible ? '' : 'opacity-50'}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{card.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {card.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {card.size}
                          </Badge>
                          {!card.visible && (
                            <Badge variant="secondary" className="text-xs">
                              Hidden
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateCard(card.id, { visible: !card.visible })}
                        >
                          {card.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => duplicateCard(card.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Dialog open={isEditDialogOpen && selectedCard?.id === card.id} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedCard(card)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Card: {card.title}</DialogTitle>
                              <DialogDescription>
                                Modify the card properties and content.
                              </DialogDescription>
                            </DialogHeader>
                            {selectedCard && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Title</Label>
                                  <Input
                                    value={selectedCard.title}
                                    onChange={(e) => setSelectedCard(prev => prev ? {...prev, title: e.target.value} : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Content</Label>
                                  <Textarea
                                    value={selectedCard.content}
                                    onChange={(e) => setSelectedCard(prev => prev ? {...prev, content: e.target.value} : null)}
                                    rows={4}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                      value={selectedCard.type}
                                      onValueChange={(value: CustomCard['type']) =>
                                        setSelectedCard(prev => prev ? {...prev, type: value} : null)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="text">Text</SelectItem>
                                        <SelectItem value="metric">Metric</SelectItem>
                                        <SelectItem value="chart">Chart</SelectItem>
                                        <SelectItem value="button">Button</SelectItem>
                                        <SelectItem value="image">Image</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Size</Label>
                                    <Select
                                      value={selectedCard.size}
                                      onValueChange={(value: CustomCard['size']) =>
                                        setSelectedCard(prev => prev ? {...prev, size: value} : null)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                        <SelectItem value="full">Full Width</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => {
                                    if (selectedCard) {
                                      updateCard(card.id, selectedCard)
                                      setIsEditDialogOpen(false)
                                      setSelectedCard(null)
                                    }
                                  }}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCard(card.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderCardContent(card)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout Management</CardTitle>
                <CardDescription>
                  Configure grid layouts, responsive breakpoints, and positioning.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Grid Columns</Label>
                      <Select defaultValue="4">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns</SelectItem>
                          <SelectItem value="4">4 Columns</SelectItem>
                          <SelectItem value="6">6 Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Gap Size</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Container Width</Label>
                      <Select defaultValue="full">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="narrow">Narrow</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="wide">Wide</SelectItem>
                          <SelectItem value="full">Full Width</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button>Apply Layout Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="styling" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Styling</CardTitle>
                <CardDescription>
                  Customize colors, fonts, spacing, and visual themes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <Input type="color" defaultValue="#3b82f6" />
                    </div>
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <Input type="color" defaultValue="#ffffff" />
                    </div>
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <Input type="color" defaultValue="#000000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Border Radius</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="full">Full</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button>Apply Styling Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Management</CardTitle>
                <CardDescription>
                  Add menu items, tabs, sub-tabs, and navigation elements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Add Menu Item</Label>
                      <Input placeholder="Menu item name..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Parent Menu</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent menu..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Main Menu</SelectItem>
                          <SelectItem value="admin">Admin Menu</SelectItem>
                          <SelectItem value="settings">Settings Menu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Add Tab</Label>
                      <Input placeholder="Tab name..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Add Sub-tab</Label>
                      <Input placeholder="Sub-tab name..." />
                    </div>
                  </div>
                  <Button>Add Navigation Item</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Customization</CardTitle>
                <CardDescription>
                  Custom CSS, JavaScript, API integrations, and advanced features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Custom CSS</Label>
                    <Textarea
                      placeholder="Enter custom CSS rules..."
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custom JavaScript</Label>
                    <Textarea
                      placeholder="Enter custom JavaScript code..."
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>API Endpoint</Label>
                      <Input placeholder="https://api.example.com/..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input placeholder="https://webhook.example.com/..." />
                    </div>
                  </div>
                  <Button>Apply Advanced Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servers" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  MCP Server Management
                </CardTitle>
                <CardDescription>
                  Manage Model Context Protocol servers for external tool integrations. Control server status and monitor connections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Server Status Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{serverStats.connected}</div>
                      <div className="text-sm text-green-600">Connected</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">{serverStats.error}</div>
                      <div className="text-sm text-red-600">Error</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">{serverStats.idle}</div>
                      <div className="text-sm text-yellow-600">Idle</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
                      <WifiOff className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-600">{serverStats.offline}</div>
                      <div className="text-sm text-gray-600">Offline</div>
                    </div>
                  </div>

                  {/* Server List */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Server Instances</h4>

                    {servers.map((server) => (
                      <Card key={server.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              server.status === 'connected' ? 'bg-green-500' :
                              server.status === 'idle' ? 'bg-yellow-500' :
                              server.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                            }`}></div>
                            <div>
                              <div className="font-medium">{server.name}</div>
                              <div className="text-sm text-muted-foreground">{server.description} • {server.endpoint.replace('https://musarty.com/api/mcp/', '')}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`${
                              server.status === 'connected' ? 'bg-green-100 text-green-800' :
                              server.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                              server.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {server.status === 'connected' ? 'Connected' :
                               server.status === 'idle' ? 'Idle' :
                               server.status === 'error' ? 'Connection Failed' : 'Offline'}
                            </Badge>
                            {server.status === 'connected' || server.status === 'idle' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => stopServer(server.id)}
                              >
                                <Square className="h-4 w-4 mr-1" />
                                Stop
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => startServer(server.id)}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Global Controls */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1" onClick={startAllServers}>
                      <Play className="h-4 w-4 mr-2" />
                      Start All Servers
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={stopAllServers}>
                      <Square className="h-4 w-4 mr-2" />
                      Stop All Servers
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}