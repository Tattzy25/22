"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Settings,
  Layout,
  Palette,
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Move,
  Trash2,
  Copy,
  Edit,
  Save,
  Eye,
  EyeOff,
  RotateCcw,
  Download,
  Upload,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Minus
} from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { motion, AnimatePresence } from "framer-motion"

// Component types available in the library
interface ComponentType {
  id: string
  name: string
  icon: React.ReactNode
  category: string
  defaultProps: Record<string, unknown>
  render: (props: Record<string, unknown>) => React.ReactNode
}

// Page component instance
interface PageComponent {
  id: string
  type: string
  props: Record<string, unknown>
  style: {
    width?: string
    height?: string
    backgroundColor?: string
    color?: string
    fontSize?: string
    fontWeight?: string
    fontFamily?: string
    padding?: string
    margin?: string
    borderRadius?: string
    border?: string
    boxShadow?: string
    position?: 'relative' | 'absolute'
    top?: string
    left?: string
    zIndex?: number
  }
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  visible: boolean
}

// Available component types
const componentTypes: ComponentType[] = [
  {
    id: 'text',
    name: 'Text',
    icon: <Type className="h-4 w-4" />,
    category: 'Basic',
    defaultProps: { content: 'Edit this text' },
    render: (props) => <div style={props.style as React.CSSProperties}>{props.content as React.ReactNode}</div>
  },
  {
    id: 'heading',
    name: 'Heading',
    icon: <Type className="h-4 w-4" />,
    category: 'Basic',
    defaultProps: { content: 'Heading', level: 'h1' },
    render: (props) => {
      const Tag = (props.level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') || 'h1'
      return <Tag style={props.style as React.CSSProperties}>{props.content as React.ReactNode}</Tag>
    }
  },
  {
    id: 'button',
    name: 'Button',
    icon: <Square className="h-4 w-4" />,
    category: 'Interactive',
    defaultProps: { content: 'Button', variant: 'default' },
    render: (props) => (
      <Button variant={props.variant as 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost'} style={props.style as React.CSSProperties}>
        {props.content as React.ReactNode}
      </Button>
    )
  },
  {
    id: 'card',
    name: 'Card',
    icon: <Square className="h-4 w-4" />,
    category: 'Layout',
    defaultProps: { title: 'Card Title', content: 'Card content' },
    render: (props) => (
      <Card style={props.style as React.CSSProperties}>
        <CardHeader>
          <CardTitle>{props.title as React.ReactNode}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{props.content as React.ReactNode}</p>
        </CardContent>
      </Card>
    )
  },
  {
    id: 'input',
    name: 'Input',
    icon: <Square className="h-4 w-4" />,
    category: 'Form',
    defaultProps: { placeholder: 'Enter text...', type: 'text' },
    render: (props) => (
      <Input
        type={props.type as React.HTMLInputTypeAttribute}
        placeholder={props.placeholder as string}
        style={props.style as React.CSSProperties}
      />
    )
  },
  {
    id: 'textarea',
    name: 'Textarea',
    icon: <Square className="h-4 w-4" />,
    category: 'Form',
    defaultProps: { placeholder: 'Enter text...', rows: 3 },
    render: (props) => (
      <Textarea
        placeholder={props.placeholder as string}
        rows={props.rows as number}
        style={props.style as React.CSSProperties}
      />
    )
  },
  {
    id: 'badge',
    name: 'Badge',
    icon: <Circle className="h-4 w-4" />,
    category: 'Display',
    defaultProps: { content: 'Badge', variant: 'default' },
    render: (props) => (
      <Badge variant={props.variant as 'default' | 'destructive' | 'outline' | 'secondary'} style={props.style as React.CSSProperties}>
        {props.content as React.ReactNode}
      </Badge>
    )
  },
  {
    id: 'separator',
    name: 'Separator',
    icon: <Minus className="h-4 w-4" />,
    category: 'Layout',
    defaultProps: {},
    render: (props) => <Separator style={props.style as React.CSSProperties} />
  }
]

interface PageBuilderProps {
  pageId?: string
  isAdminMode?: boolean
  onSave?: (layout: PageComponent[]) => void
}

export function PageBuilder({ pageId = 'default', isAdminMode = true, onSave }: PageBuilderProps) {
  const [components, setComponents] = useState<PageComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null)
  const [showProperties, setShowProperties] = useState(false)

  // Load saved layout
  useEffect(() => {
    const saved = localStorage.getItem(`page-layout-${pageId}`)
    if (saved) {
      try {
        setComponents(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load saved layout:', error)
      }
    }
  }, [pageId])

  // Save layout
  const saveLayout = () => {
    localStorage.setItem(`page-layout-${pageId}`, JSON.stringify(components))
    onSave?.(components)
  }

  // Add component to canvas
  const addComponent = (componentType: ComponentType, x: number = 100, y: number = 100) => {
    const newComponent: PageComponent = {
      id: `${componentType.id}-${Date.now()}`,
      type: componentType.id,
      props: { ...componentType.defaultProps },
      style: {
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: '200px',
        height: '40px'
      },
      position: { x, y, width: 200, height: 40 },
      visible: true
    }
    setComponents(prev => [...prev, newComponent])
  }

  // Update component
  const updateComponent = (id: string, updates: Partial<PageComponent>) => {
    setComponents(prev => prev.map(comp =>
      comp.id === id ? { ...comp, ...updates } : comp
    ))
  }

  // Delete component
  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }

  // Handle drag end
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // If dragging from component library to canvas
    if (source.droppableId === 'component-library' && destination.droppableId === 'canvas') {
      const componentType = componentTypes.find(ct => ct.id === draggableId)
      if (componentType) {
        // Add component at default position for now
        addComponent(componentType, 100 + (components.length * 20), 100 + (components.length * 20))
      }
    }
  }

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedComponent(null)
      setShowProperties(false)
    }
  }

  // Render component on canvas
  const renderComponent = (component: PageComponent) => {
    const componentType = componentTypes.find(ct => ct.id === component.type)
    if (!componentType) return null

    const isSelected = selectedComponent?.id === component.id

    return (
      <motion.div
        key={component.id}
        className={`absolute cursor-pointer border-2 transition-all ${
          isSelected ? 'border-primary shadow-lg' : 'border-transparent hover:border-muted-foreground/50'
        } ${!component.visible ? 'opacity-50' : ''}`}
        style={{
          ...component.style,
          zIndex: isSelected ? 10 : 1
        }}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedComponent(component)
          setShowProperties(true)
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {componentType.render({ ...component.props, style: component.style })}
        {isSelected && isAdminMode && (
          <div className="absolute -top-6 -right-6 flex gap-1">
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                deleteComponent(component.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </motion.div>
    )
  }

  if (!isAdminMode) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence>
          {components.filter(comp => comp.visible).map(renderComponent)}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen bg-muted/20">
      {/* Component Library Sidebar */}
      <div className="w-80 bg-background border-r flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Component Library
          </h3>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
              </TabsList>

              {['all', 'basic', 'layout', 'form'].map(category => (
                <TabsContent key={category} value={category} className="mt-4">
                  <Droppable droppableId="component-library" isDropDisabled={true}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 gap-2">
                        {componentTypes
                          .filter(ct => category === 'all' || ct.category.toLowerCase() === category)
                          .map((componentType, index) => (
                            <Draggable key={componentType.id} draggableId={componentType.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Card className="cursor-grab hover:shadow-md transition-shadow">
                                    <CardContent className="p-3 text-center">
                                      <div className="flex flex-col items-center gap-2">
                                        {componentType.icon}
                                        <span className="text-xs font-medium">{componentType.name}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 bg-background border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold">Page Builder</h2>
            <Badge variant="outline">{components.length} components</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={() => setComponents([])}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button onClick={saveLayout}>
              <Save className="h-4 w-4 mr-2" />
              Save Layout
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="canvas">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  id="canvas-area"
                  className="relative bg-white border-2 border-dashed border-muted-foreground/25 rounded-lg mx-auto"
                  style={{ width: 1200, height: 800, minHeight: '600px' }}
                  onClick={handleCanvasClick}
                >
                  <AnimatePresence>
                    {components.map(renderComponent)}
                  </AnimatePresence>

                  {components.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Drag components here to start building</p>
                      </div>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Properties Panel */}
      <AnimatePresence>
        {showProperties && selectedComponent && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 bg-background border-l flex flex-col"
          >
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Properties
              </h3>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Content Properties */}
                <div className="space-y-4">
                  <h4 className="font-medium">Content</h4>
                  {Object.keys(selectedComponent.props).map(key => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      {typeof selectedComponent.props[key] === 'string' && key.includes('content') ? (
                        <Textarea
                          value={selectedComponent.props[key] as string}
                          onChange={(e) => updateComponent(selectedComponent.id, {
                            props: { ...selectedComponent.props, [key]: e.target.value }
                          })}
                          rows={3}
                        />
                      ) : typeof selectedComponent.props[key] === 'string' ? (
                        <Input
                          value={selectedComponent.props[key] as string}
                          onChange={(e) => updateComponent(selectedComponent.id, {
                            props: { ...selectedComponent.props, [key]: e.target.value }
                          })}
                        />
                      ) : (
                        <Select
                          value={selectedComponent.props[key] as string}
                          onValueChange={(value) => updateComponent(selectedComponent.id, {
                            props: { ...selectedComponent.props, [key]: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Add appropriate options based on property type */}
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="destructive">Destructive</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>

                {/* Style Properties */}
                <div className="space-y-4">
                  <h4 className="font-medium">Style</h4>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Background</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded border cursor-pointer"
                          style={{ backgroundColor: selectedComponent.style.backgroundColor || '#ffffff' }}
                          onClick={() => {/* Open color picker */}}
                        />
                        <Input
                          value={selectedComponent.style.backgroundColor || ''}
                          onChange={(e) => updateComponent(selectedComponent.id, {
                            style: { ...selectedComponent.style, backgroundColor: e.target.value }
                          })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Text Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded border cursor-pointer"
                          style={{ backgroundColor: selectedComponent.style.color || '#000000' }}
                          onClick={() => {/* Open color picker */}}
                        />
                        <Input
                          value={selectedComponent.style.color || ''}
                          onChange={(e) => updateComponent(selectedComponent.id, {
                            style: { ...selectedComponent.style, color: e.target.value }
                          })}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Font Size</Label>
                      <Input
                        value={selectedComponent.style.fontSize || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, {
                          style: { ...selectedComponent.style, fontSize: e.target.value }
                        })}
                        placeholder="16px"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Font Weight</Label>
                      <Select
                        value={selectedComponent.style.fontWeight || 'normal'}
                        onValueChange={(value) => updateComponent(selectedComponent.id, {
                          style: { ...selectedComponent.style, fontWeight: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="lighter">Light</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Spacing */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Padding</Label>
                      <Input
                        value={selectedComponent.style.padding || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, {
                          style: { ...selectedComponent.style, padding: e.target.value }
                        })}
                        placeholder="8px"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Margin</Label>
                      <Input
                        value={selectedComponent.style.margin || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, {
                          style: { ...selectedComponent.style, margin: e.target.value }
                        })}
                        placeholder="0px"
                      />
                    </div>
                  </div>

                  {/* Size */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Width</Label>
                      <Input
                        value={selectedComponent.style.width || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, {
                          style: { ...selectedComponent.style, width: e.target.value }
                        })}
                        placeholder="200px"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Height</Label>
                      <Input
                        value={selectedComponent.style.height || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, {
                          style: { ...selectedComponent.style, height: e.target.value }
                        })}
                        placeholder="auto"
                      />
                    </div>
                  </div>

                  {/* Border */}
                  <div className="space-y-2">
                    <Label className="text-sm">Border Radius</Label>
                    <Input
                      value={selectedComponent.style.borderRadius || ''}
                      onChange={(e) => updateComponent(selectedComponent.id, {
                        style: { ...selectedComponent.style, borderRadius: e.target.value }
                      })}
                      placeholder="4px"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <h4 className="font-medium">Actions</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateComponent(selectedComponent.id, { visible: !selectedComponent.visible })}
                    >
                      {selectedComponent.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteComponent(selectedComponent.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </DragDropContext>
  )
}