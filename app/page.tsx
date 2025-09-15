"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ContentArea } from "@/components/content"

export type ContentType =
  | 'home' | 'models' | 'playground' | 'builder'
  | 'community' | 'settings' | 'character-builder'
  | 'media-studio' | 'game-builder' | 'api-manager'
  | 'design-engineering' | 'sales-marketing' | 'control-panel' | 'agent-live'
  | 'multi-agent' | 'admin-panel'

export default function Page() {
  const [activeContent, setActiveContent] = useState<ContentType>('home')

  // Hash routing logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      const validRoutes: ContentType[] = [
        'home', 'models', 'playground', 'builder', 'community', 'settings',
        'character-builder', 'media-studio',
        'game-builder', 'api-manager', 'design-engineering', 'sales-marketing', 'control-panel', 'agent-live', 'admin-panel'
      ]

      if (hash && validRoutes.includes(hash as ContentType)) {
        setActiveContent(hash as ContentType)
      } else {
        setActiveContent('home')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const getBreadcrumbTitle = (content: ContentType): string => {
    const titles: Record<ContentType, string> = {
      'home': 'Home',
      'models': 'Models',
      'playground': 'Playground',
      'builder': 'Builder',
      'community': 'Community',
      'settings': 'Settings',
      'character-builder': 'Character Builder',
      'media-studio': 'Media Studio',
      'game-builder': 'Game Builder',
      'api-manager': 'API Manager',
      'design-engineering': 'Design Engineering',
      'sales-marketing': 'Sales & Marketing',
      'control-panel': 'Control Panel',
      'agent-live': 'AI Agent Live',
      'multi-agent': 'Multi-Agent Automations',
      'admin-panel': 'Admin Panel'
    }
    return titles[content] || 'Home'
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#home">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumbTitle(activeContent)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <ContentArea activeContent={activeContent} />
      </SidebarInset>
    </SidebarProvider>
  )
}
