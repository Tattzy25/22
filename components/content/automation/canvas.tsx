"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"
import { Node, Connection } from "./types"

interface CanvasProps {
  nodes: Node[]
  connections: Connection[]
  selectedNode: Node | null
  canvasRef: React.RefObject<HTMLDivElement | null>
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseDown: (e: React.MouseEvent, node: Node) => void
  onNodeClick: (node: Node) => void
}

export function Canvas({
  nodes,
  connections,
  selectedNode,
  canvasRef,
  onMouseMove,
  onMouseUp,
  onMouseDown,
  onNodeClick
}: CanvasProps) {
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Workflow Canvas</CardTitle>
        <CardDescription>
          {nodes.length} nodes • {connections.length} connections
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="relative w-full h-full bg-muted/20 cursor-crosshair"
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Render connections */}
          <svg className="absolute inset-0 pointer-events-none">
            {connections.map(connection => {
              const fromNode = nodes.find(n => n.id === connection.from)
              const toNode = nodes.find(n => n.id === connection.to)
              if (!fromNode || !toNode) return null

              const fromX = fromNode.position.x + 120
              const fromY = fromNode.position.y + 40
              const toX = toNode.position.x
              const toY = toNode.position.y + 40

              return (
                <path
                  key={connection.id}
                  d={`M ${fromX} ${fromY} C ${fromX + 50} ${fromY} ${toX - 50} ${toY} ${toX} ${toY}`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              )
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7"
                refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
            </defs>
          </svg>

          {/* Render nodes */}
          {nodes.map(node => {
            const Icon = node.icon
            return (
              <div
                key={node.id}
                data-testid="automation-node"
                className={`absolute p-3 bg-background border rounded-lg shadow-sm cursor-move select-none transition-shadow min-w-[120px] ${
                  selectedNode?.id === node.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}
                style={{
                  left: node.position.x,
                  top: node.position.y
                }}
                onMouseDown={(e) => onMouseDown(e, node)}
                onClick={() => onNodeClick(node)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium truncate">{node.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {node.type}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}