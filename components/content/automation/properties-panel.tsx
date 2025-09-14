"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Trash2, Settings } from "lucide-react"
import { Node } from "./types"

interface PropertiesPanelProps {
  selectedNode: Node | null
  onUpdatePosition: (nodeId: string, position: { x: number; y: number }) => void
  onDuplicateNode: (node: Node) => void
  onDeleteNode: (nodeId: string) => void
}

export function PropertiesPanel({
  selectedNode,
  onUpdatePosition,
  onDuplicateNode,
  onDeleteNode
}: PropertiesPanelProps) {
  return (
    <Card className="w-80 flex flex-col">
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <CardDescription>
          {selectedNode ? `Configure ${selectedNode.name}` : 'Select a node to configure'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {selectedNode ? (
          <ScrollArea className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{selectedNode.name}</h4>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDuplicateNode(selectedNode)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteNode(selectedNode.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Node ID</label>
                  <Input value={selectedNode.id} readOnly className="mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Badge variant="outline" className="mt-1 block w-fit">
                    {selectedNode.type}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium">Position</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      placeholder="X"
                      value={Math.round(selectedNode.position.x)}
                      onChange={(e) => onUpdatePosition(selectedNode.id, {
                        ...selectedNode.position,
                        x: parseInt(e.target.value) || 0
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Y"
                      value={Math.round(selectedNode.position.y)}
                      onChange={(e) => onUpdatePosition(selectedNode.id, {
                        ...selectedNode.position,
                        y: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                {/* Node-specific configuration */}
                {selectedNode.type === 'action' && selectedNode.name.includes('AI') && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">AI Model</label>
                      <Select defaultValue="gpt-4">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="claude-3">Claude 3</SelectItem>
                          <SelectItem value="gemini">Gemini Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Prompt</label>
                      <textarea
                        className="w-full mt-1 p-2 border rounded-md text-sm"
                        rows={3}
                        placeholder="Enter your AI prompt..."
                      />
                    </div>
                  </div>
                )}

                {selectedNode.type === 'trigger' && selectedNode.name.includes('Webhook') && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Webhook URL</label>
                      <Input
                        className="mt-1"
                        placeholder="https://your-app.com/webhook"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">HTTP Method</label>
                      <Select defaultValue="POST">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No node selected</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}