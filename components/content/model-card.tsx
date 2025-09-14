import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star, ExternalLink, Zap } from "lucide-react"

interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  pricing: {
    inputTokens: string
    outputTokens: string
    monthlyFee?: string
  }
  rating: number
  contextWindow: number
  responseTime: string
  status: 'available' | 'beta' | 'deprecated'
  icon: string
}

interface ModelCardProps {
  model: AIModel
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{model.icon}</div>
            <div>
              <CardTitle className="text-lg">{model.name}</CardTitle>
              <CardDescription className="text-sm">{model.provider}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{model.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {model.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {model.capabilities.slice(0, 3).map(capability => (
            <Badge key={capability} variant="secondary" className="text-xs">
              {capability}
            </Badge>
          ))}
          {model.capabilities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{model.capabilities.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-green-600">
            {model.pricing.inputTokens} in / {model.pricing.outputTokens} out
          </span>
          <span className="text-muted-foreground">{model.responseTime}</span>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-2xl">{model.icon}</span>
                  {model.name}
                  <Badge variant="secondary">{model.provider}</Badge>
                </DialogTitle>
                <DialogDescription>{model.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Context Window:</span>
                    <p className="text-muted-foreground">{model.contextWindow.toLocaleString()} tokens</p>
                  </div>
                  <div>
                    <span className="font-medium">Response Time:</span>
                    <p className="text-muted-foreground">{model.responseTime}</p>
                  </div>
                  <div>
                    <span className="font-medium">Pricing:</span>
                    <p className="text-green-600 font-medium">
                      {model.pricing.inputTokens} input / {model.pricing.outputTokens} output
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Rating:</span>
                    <p className="text-muted-foreground">{model.rating}/5.0</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium">Capabilities:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {model.capabilities.map(capability => (
                      <Badge key={capability} variant="secondary">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    <Zap className="h-4 w-4 mr-2" />
                    Try Model
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Documentation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" className="flex-1">
            <Zap className="h-4 w-4 mr-2" />
            Try Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}