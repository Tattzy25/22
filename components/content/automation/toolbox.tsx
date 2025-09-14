"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { nodeTypes, NodeType } from "./types"

interface ToolboxProps {
  onAddNode: (type: keyof typeof nodeTypes, nodeType: NodeType) => void
}

export function Toolbox({ onAddNode }: ToolboxProps) {
  return (
    <Card className="w-80 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Components
        </CardTitle>
        <CardDescription>
          Drag components to build your automation
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {Object.entries(nodeTypes).map(([category, items]) => (
              <div key={category}>
                <h4 className="font-medium capitalize mb-3 text-sm text-muted-foreground">
                  {category}s
                </h4>
                <div className="space-y-2">
                  {items.map(item => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.id}
                        data-testid="node-type"
                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onAddNode(category as keyof typeof nodeTypes, item)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {category !== 'output' && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}