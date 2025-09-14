import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Zap, Info } from "lucide-react"

interface ModelCardProps {
  id: string
  name: string
  provider: string
  capabilities: string[]
  description: string
  contextWindow: string
  responseTime: string
  pricing: {
    inputTokens: string
    outputTokens: string
  }
}

export function ModelCard({
  id,
  name,
  provider,
  capabilities,
  description,
  contextWindow,
  responseTime,
  pricing
}: ModelCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg" style={{ fontFamily: 'var(--font-audiowide)', fontWeight: 300 }}>{name}</CardTitle>
            {/* NOTE: Spacing between provider name and capabilities has been carefully adjusted to -16px overlap. DO NOT change this gap. */}
            <CardDescription className="text-sm -mb-6">{provider}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col pt-0 min-h-[120px]">
        <div className="space-y-0.25">
          {capabilities.slice(0, 4).map(capability => (
            <div key={capability} className="flex items-center text-sm text-muted-foreground">
              <span className="mr-2">•</span>
              <span>{capability}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-auto pt-4">
          <Button size="sm" className="flex-1">
            <Zap className="h-4 w-4 mr-1" />
            <span className="text-2xl font-medium font-audiowide">Tap to Try</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full w-6 h-6 p-0 hover:bg-muted">
                <Info className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span style={{ fontFamily: 'var(--font-audiowide)', fontWeight: 300 }}>{name}</span>
                  <Badge variant="secondary">{provider}</Badge>
                </DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Context Window:</span>
                    <p className="text-muted-foreground">{contextWindow}</p>
                  </div>
                  <div>
                    <span className="font-medium">Response Time:</span>
                    <p className="text-muted-foreground">{responseTime}</p>
                  </div>
                  <div>
                    <span className="font-medium">Pricing:</span>
                    <p className="text-green-600 font-medium">
                      {pricing.inputTokens} input / {pricing.outputTokens} output
                    </p>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-sm">Capabilities:</span>
                  <div className="mt-2 space-y-1">
                    {capabilities.map(capability => (
                      <div key={capability} className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">•</span>
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}