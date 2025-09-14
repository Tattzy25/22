"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useAdminMode } from '@/contexts/admin-mode-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Edit,
  Trash2,
  Copy,
  Move,
  Settings,
  Save,
  X,
  Plus,
  GripVertical
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ComponentContent {
  text?: string
  variant?: string
  title?: string
  content?: string
  [key: string]: unknown
}

interface ComponentUpdate {
  content?: ComponentContent
  style?: React.CSSProperties | Record<string, unknown>
}

interface EditableComponentProps {
  id: string
  children: React.ReactNode
  type?: 'text' | 'image' | 'button' | 'card' | 'custom'
  content?: ComponentContent
  style?: React.CSSProperties | Record<string, unknown>
  onUpdate?: (id: string, updates: ComponentUpdate) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  className?: string
}

export function EditableComponent({
  id,
  children,
  type = 'custom',
  content,
  style,
  onUpdate,
  onDelete,
  onDuplicate,
  className = ''
}: EditableComponentProps) {
  const { isAdminMode } = useAdminMode()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content || {})
  const componentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEditContent(content || {})
  }, [content])

  const handleSave = () => {
    onUpdate?.(id, { content: editContent })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(content || {})
    setIsEditing(false)
  }

  if (!isAdminMode) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={componentRef}
      className={`relative group ${className}`}
      style={style}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      onClick={(e) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
    >
      {/* Admin overlay controls */}
      <div className="absolute -top-3 -right-3 z-50 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0 bg-white shadow-md border"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0 bg-white shadow-md border"
          onClick={() => onDuplicate?.(id)}
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-6 w-6 p-0 bg-white shadow-md border"
          onClick={() => onDelete?.(id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Drag handle */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white shadow-md border rounded p-1 cursor-move">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Edit Component</h3>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {type === 'text' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Text Content</label>
                      <Textarea
                        value={editContent.text || ''}
                        onChange={(e) => setEditContent({ ...editContent, text: e.target.value })}
                        placeholder="Enter text content..."
                        rows={3}
                      />
                    </div>
                  )}

                  {type === 'button' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Button Text</label>
                        <Input
                          value={editContent.text || ''}
                          onChange={(e) => setEditContent({ ...editContent, text: e.target.value })}
                          placeholder="Button text..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Button Variant</label>
                        <Select
                          value={editContent.variant || 'default'}
                          onValueChange={(value) => setEditContent({ ...editContent, variant: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="outline">Outline</SelectItem>
                            <SelectItem value="ghost">Ghost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {type === 'card' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          value={editContent.title || ''}
                          onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                          placeholder="Card title..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Content</label>
                        <Textarea
                          value={editContent.content || ''}
                          onChange={(e) => setEditContent({ ...editContent, content: e.target.value })}
                          placeholder="Card content..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface EditableComponent {
  id: string
  type: 'text' | 'image' | 'button' | 'card' | 'custom'
  content: ComponentContent
  style: React.CSSProperties | Record<string, unknown>
}

interface ComponentUpdate {
  content?: ComponentContent
  style?: React.CSSProperties | Record<string, unknown>
  [key: string]: unknown
}

// Hook for managing editable page content
export function useEditablePage(pageId: string) {
  const [components, setComponents] = useState<EditableComponent[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(`editable-page-${pageId}`)
    if (saved) {
      try {
        setComponents(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load editable page:', error)
      }
    }
  }, [pageId])

  const updateComponent = (id: string, updates: ComponentUpdate) => {
    setComponents(prev => {
      const updated = prev.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      )
      localStorage.setItem(`editable-page-${pageId}`, JSON.stringify(updated))
      return updated
    })
  }

  const addComponent = (type: 'text' | 'image' | 'button' | 'card' | 'custom', position: { x: number, y: number }) => {
    const newComponent = {
      id: `${type}-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      style: {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '200px',
        height: 'auto'
      }
    }

    setComponents(prev => {
      const updated = [...prev, newComponent]
      localStorage.setItem(`editable-page-${pageId}`, JSON.stringify(updated))
      return updated
    })
  }

  const deleteComponent = (id: string) => {
    setComponents(prev => {
      const updated = prev.filter(comp => comp.id !== id)
      localStorage.setItem(`editable-page-${pageId}`, JSON.stringify(updated))
      return updated
    })
  }

  const duplicateComponent = (id: string) => {
    const component = components.find(c => c.id === id)
    if (!component) return

    const duplicated = {
      ...component,
      id: `${component.type}-${Date.now()}`,
      style: {
        ...component.style,
        left: `${parseInt(String(component.style.left)) + 20}px`,
        top: `${parseInt(String(component.style.top)) + 20}px`
      }
    }

    setComponents(prev => {
      const updated = [...prev, duplicated]
      localStorage.setItem(`editable-page-${pageId}`, JSON.stringify(updated))
      return updated
    })
  }

  return {
    components,
    updateComponent,
    addComponent,
    deleteComponent,
    duplicateComponent
  }
}

function getDefaultContent(type: string) {
  switch (type) {
    case 'text':
      return { text: 'Edit this text content...' }
    case 'button':
      return { text: 'Click me', variant: 'default' }
    case 'card':
      return { title: 'Card Title', content: 'Card content goes here...' }
    default:
      return {}
  }
}