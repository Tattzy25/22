export interface Widget {
  id: string
  name: string
  type: 'chat' | 'button' | 'form' | 'embed' | 'popup' | 'sidebar'
  config: WidgetConfig
  embedCode: string
  createdAt: Date
  lastModified: Date
  views: number
  interactions: number
  status: 'draft' | 'published' | 'archived'
}

export interface WidgetConfig {
  type: 'chat' | 'button' | 'form' | 'embed' | 'popup' | 'sidebar'
  theme: 'light' | 'dark' | 'auto'
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center' | 'inline'
  size: 'small' | 'medium' | 'large' | 'custom'
  width?: number
  height?: number
  characterId?: string
  apiKey: string
  title: string
  subtitle: string
  primaryColor: string
  secondaryColor?: string
  showAvatar: boolean
  autoOpen: boolean
  delay: number
  customCSS?: string
  targetPages?: string[]
  showOnMobile: boolean
  showOnDesktop: boolean
}

export interface WidgetAnalytics {
  widgetId: string
  totalViews: number
  totalInteractions: number
  conversionRate: number
  avgSessionDuration: number
  topPages: Array<{ page: string; views: number }>
  deviceBreakdown: { mobile: number; desktop: number; tablet: number }
  hourlyActivity: number[]
}

