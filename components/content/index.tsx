"use client"

import { ContentType } from "@/app/page"
import { HomeContent } from "./home-content"
import { ModelsContent } from "./models-content"
import { PlaygroundContent } from "./playground-content"
import { BuilderContent } from "./builder-content"
import { CommunityContent } from "./community-content"
import { SettingsContent } from "./settings-content"
import { AutomationContent } from "./automation-content"
import { CharacterContent } from "./character-content"
import { WidgetContent } from "./widget-content"
import { MediaContent } from "./media-content"
import { GameContent } from "./game-content"
import { ApiContent } from "./api-content"
import { DesignContent } from "./design-content"
import { SalesContent } from "./sales-content"
import { AgentLiveContent } from "./agent-live-content"
import { ControlContent } from "./control-content"
import { MultiAgentContent } from "./multi-agent-content"

interface ContentAreaProps {
  activeContent: ContentType
}

export function ContentArea({ activeContent }: ContentAreaProps) {
  switch (activeContent) {
    case 'home':
      return <HomeContent />
    case 'models':
      return <ModelsContent />
    case 'playground':
      return <PlaygroundContent />
    case 'builder':
      return <BuilderContent />
    case 'community':
      return <CommunityContent />
    case 'settings':
      return <SettingsContent />
    case 'automation':
      return <AutomationContent />
    case 'character-builder':
      return <CharacterContent />
    case 'widget-generator':
      return <WidgetContent />
    case 'media-studio':
      return <MediaContent />
    case 'game-builder':
      return <GameContent />
    case 'api-manager':
      return <ApiContent />
    case 'design-engineering':
      return <DesignContent />
    case 'sales-marketing':
      return <SalesContent />
    case 'control-panel':
      return <ControlContent />
    case 'agent-live':
      return <AgentLiveContent />
    case 'multi-agent':
      return <MultiAgentContent />
    default:
      return <HomeContent />
  }
}