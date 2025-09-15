"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#home",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "#home",
        },
        {
          title: "Analytics",
          url: "#home",
        },
        {
          title: "Activity",
          url: "#home",
        },
      ],
    },
    {
      title: "AI Models",
      url: "#models",
      icon: Bot,
      items: [
        {
          title: "All Models",
          url: "#models",
        },
        {
          title: "My Models",
          url: "#models",
        },
        {
          title: "Favorites",
          url: "#models",
        },
      ],
    },
    {
      title: "Playground",
      url: "#playground",
      icon: Frame,
      items: [
        {
          title: "Multi-Chat",
          url: "#playground",
        },
        {
          title: "Conversations",
          url: "#playground",
        },
        {
          title: "Templates",
          url: "#playground",
        },
      ],
    },
    {
      title: "Content Creation",
      url: "#content-creation",
      icon: BookOpen,
      items: [
        {
          title: "Text Generation",
          url: "#content-creation",
        },
        {
          title: "Image Generation",
          url: "#content-creation",
        },
        {
          title: "Video Generation",
          url: "#content-creation",
        },
      ],
    },
    {
      title: "Automation",
      url: "#automation",
      icon: Settings2,
      items: [
        {
          title: "Workflows",
          url: "#automation",
        },
        {
          title: "Integrations",
          url: "#automation",
        },
        {
          title: "API Manager",
          url: "#api-manager",
        },
      ],
    },
    {
      title: "Widget Generator",
      url: "#widget-generator",
      icon: Frame,
      items: [
        {
          title: "Widget Generator",
          url: "#widget-generator",
        },
        {
          title: "AI Agent Live",
          url: "#agent-live",
        },
        {
          title: "Multi-Agent Automations",
          url: "#multi-agent",
        },
      ],
    },
    {
      title: "Community",
      url: "#community",
      icon: BookOpen,
      items: [
        {
          title: "Discover",
          url: "#community",
        },
        {
          title: "My Creations",
          url: "#community",
        },
        {
          title: "Tutorials",
          url: "#community",
        },
      ],
    },
    {
      title: "Media Studio",
      url: "#media-studio",
      icon: GalleryVerticalEnd,
      items: [
        {
          title: "Image Generation",
          url: "#media-studio",
        },
        {
          title: "Music Generation",
          url: "#media-studio",
        },
        {
          title: "Game Builder",
          url: "#game-builder",
        },
      ],
    },
    {
      title: "Settings",
      url: "#settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#settings",
        },
        {
          title: "API Keys",
          url: "#api-manager",
        },
        {
          title: "Billing",
          url: "#sales-marketing",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#design-engineering",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#sales-marketing",
      icon: PieChart,
    },
    {
      name: "Control Panel",
      url: "#control-panel",
      icon: Map,
    },
    {
      name: "Admin Panel",
      url: "#admin-panel",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}