import {
  Webhook,
  Zap,
  Mail,
  FileText,
  MessageSquare,
  Image,
  Music,
  Database,
  Settings,
  ArrowRight
} from "lucide-react"

import { LucideIcon } from "lucide-react"

export interface Node {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'output'
  name: string
  icon: LucideIcon
  position: { x: number; y: number }
  config: Record<string, unknown>
  connections: string[]
}

export interface Connection {
  id: string
  from: string
  to: string
  fromHandle: string
  toHandle: string
}

export interface NodeType {
  id: string
  name: string
  icon: LucideIcon
  description: string
}

export const nodeTypes = {
  trigger: [
    { id: 'webhook', name: 'Webhook Trigger', icon: Webhook, description: 'HTTP webhook trigger' },
    { id: 'schedule', name: 'Schedule Trigger', icon: Zap, description: 'Time-based trigger' },
    { id: 'email', name: 'Email Trigger', icon: Mail, description: 'Email received trigger' },
    { id: 'form', name: 'Form Submission', icon: FileText, description: 'Form submission trigger' }
  ] as NodeType[],
  action: [
    { id: 'ai-chat', name: 'AI Chat', icon: MessageSquare, description: 'Generate AI response' },
    { id: 'ai-image', name: 'Generate Image', icon: Image, description: 'Create AI image' },
    { id: 'ai-music', name: 'Generate Music', icon: Music, description: 'Create AI music' },
    { id: 'webhook-call', name: 'Call Webhook', icon: Webhook, description: 'Make HTTP request' },
    { id: 'email-send', name: 'Send Email', icon: Mail, description: 'Send email notification' },
    { id: 'database', name: 'Database Query', icon: Database, description: 'Query database' }
  ] as NodeType[],
  condition: [
    { id: 'if-else', name: 'If/Else', icon: Settings, description: 'Conditional logic' },
    { id: 'switch', name: 'Switch', icon: Settings, description: 'Multi-condition switch' }
  ] as NodeType[],
  output: [
    { id: 'response', name: 'API Response', icon: ArrowRight, description: 'Return API response' },
    { id: 'file', name: 'Save File', icon: FileText, description: 'Save to file' },
    { id: 'notification', name: 'Notification', icon: Zap, description: 'Send notification' }
  ] as NodeType[]
}