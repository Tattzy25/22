import { MessageSquare, Zap, Bot, Code, ExternalLink, Monitor } from "lucide-react"

export const widgetTypes = [
  { id: 'chat', name: 'Chat Widget', description: 'Interactive chat interface', icon: MessageSquare },
  { id: 'button', name: 'Action Button', description: 'Simple call-to-action button', icon: Zap },
  { id: 'form', name: 'Contact Form', description: 'AI-powered contact form', icon: Bot },
  { id: 'embed', name: 'Full Embed', description: 'Complete AI interface embed', icon: Code },
  { id: 'popup', name: 'Popup Modal', description: 'Attention-grabbing popup', icon: ExternalLink },
  { id: 'sidebar', name: 'Sidebar Panel', description: 'Slide-out sidebar widget', icon: Monitor }
]

export const themes = [
  { id: 'light', name: 'Light', preview: 'bg-white text-black border-gray-200' },
  { id: 'dark', name: 'Dark', preview: 'bg-gray-900 text-white border-gray-700' },
  { id: 'auto', name: 'Auto', preview: 'bg-gradient-to-r from-white to-gray-100 border-gray-300' }
]

