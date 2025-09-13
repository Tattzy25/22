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
      title: "Playground",
      url: "#playground",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#playground",
        },
        {
          title: "Starred",
          url: "#playground",
        },
        {
          title: "Settings",
          url: "#settings",
        },
      ],
    },
    {
      title: "Models",
      url: "#models",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#models",
        },
        {
          title: "Explorer",
          url: "#models",
        },
        {
          title: "Quantum",
          url: "#models",
        },
      ],
    },
    {
      title: "Builder",
      url: "#builder",
      icon: Frame,
      items: [
        {
          title: "Automation",
          url: "#automation",
        },
        {
          title: "Character",
          url: "#character-builder",
        },
        {
          title: "Widget",
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
          url: "#api-manager",
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
