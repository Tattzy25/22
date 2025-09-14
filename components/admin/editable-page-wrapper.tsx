"use client"

import React, { useState, useEffect } from 'react'
import { useAdminMode } from '@/contexts/admin-mode-context'
import { EditableComponent, useEditablePage } from './editable-component'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EditablePageWrapperProps {
  pageId: string
  children: React.ReactNode
  className?: string
}

export function EditablePageWrapper({ pageId, children, className = '' }: EditablePageWrapperProps) {
  const { isAdminMode } = useAdminMode()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const {
    components,
    updateComponent,
    addComponent,
    deleteComponent,
    duplicateComponent
  } = useEditablePage(pageId)

  // Listen for add component events from the footer
  useEffect(() => {
    const handleAddComponent = (event: CustomEvent) => {
      const { type } = event.detail
      // Add component at center of viewport
      const centerX = window.innerWidth / 2 - 100
      const centerY = window.innerHeight / 2 - 50
      addComponent(type, { x: centerX, y: centerY })
    }

    window.addEventListener('addComponent', handleAddComponent as EventListener)
    return () => window.removeEventListener('addComponent', handleAddComponent as EventListener)
  }, [addComponent])

  // Show saved indicator briefly when components change
  useEffect(() => {
    if (components.length > 0) {
      setSaveStatus('saved')
      const timer = setTimeout(() => setSaveStatus('idle'), 2000)
      return () => clearTimeout(timer)
    }
  }, [components])

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isAdminMode) return

    // Only add component if clicking on empty space
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      addComponent('text', { x, y })
    }
  }

  if (!isAdminMode) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Original page content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Editable overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        onClick={handleCanvasClick}
        style={{ pointerEvents: isAdminMode ? 'auto' : 'none' }}
      >
        {components.map((component) => (
          <EditableComponent
            key={component.id}
            id={component.id}
            type={component.type}
            content={component.content}
            style={component.style}
            onUpdate={updateComponent}
            onDelete={deleteComponent}
            onDuplicate={duplicateComponent}
            className="pointer-events-auto"
          >
            {/* Render the component based on type */}
            {component.type === 'text' && (
              <div className="p-2 bg-white/90 rounded shadow-sm border">
                {component.content?.text || 'Edit this text...'}
              </div>
            )}
            {component.type === 'button' && (
              <Button variant={(component.content?.variant as 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost') || 'default'}>
                {component.content?.text || 'Button'}
              </Button>
            )}
            {component.type === 'card' && (
              <div className="p-4 bg-white rounded shadow-sm border max-w-sm">
                <h3 className="font-semibold mb-2">{component.content?.title || 'Card Title'}</h3>
                <p className="text-sm text-muted-foreground">{component.content?.content || 'Card content...'}</p>
              </div>
            )}
          </EditableComponent>
        ))}
      </div>

      {/* Admin toolbar */}
      {isAdminMode && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <AnimatePresence>
            {saveStatus === 'saved' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg"
              >
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Changes Saved</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}