"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gamepad2 } from "lucide-react"
import { GameConfig } from "./types"

interface GamePreviewProps {
  gameConfig: GameConfig
  isOpen: boolean
  onClose: () => void
}

export function GamePreview({ gameConfig, isOpen, onClose }: GamePreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Game Preview: {gameConfig.title}</DialogTitle>
          <DialogDescription>
            Test your game before publishing
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-96 bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Game preview would render here</p>
            <p className="text-sm text-muted-foreground mt-2">
              In a full implementation, this would show the actual playable game
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}