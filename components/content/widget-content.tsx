"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Copy, Code, Eye, Settings, Zap, MessageSquare, Bot } from "lucide-react"

interface WidgetConfig {
  type: 'chat' | 'button' | 'form' | 'embed'
  theme: 'light' | 'dark' | 'auto'
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  size: 'small' | 'medium' | 'large'
  characterId?: string
  apiKey: string
  title: string
  subtitle: string
  primaryColor: string
  showAvatar: boolean
  autoOpen: boolean
  delay: number
}

const widgetTypes = [
  { id: 'chat', name: 'Chat Widget', description: 'Interactive chat interface', icon: MessageSquare },
  { id: 'button', name: 'Action Button', description: 'Simple call-to-action button', icon: Zap },
  { id: 'form', name: 'Contact Form', description: 'AI-powered contact form', icon: Bot },
  { id: 'embed', name: 'Full Embed', description: 'Complete AI interface embed', icon: Code }
]

const themes = [
  { id: 'light', name: 'Light', preview: 'bg-white text-black' },
  { id: 'dark', name: 'Dark', preview: 'bg-gray-900 text-white' },
  { id: 'auto', name: 'Auto', preview: 'bg-gradient-to-r from-white to-gray-100' }
]

export function WidgetContent() {
  const [config, setConfig] = useState<WidgetConfig>({
    type: 'chat',
    theme: 'auto',
    position: 'bottom-right',
    size: 'medium',
    apiKey: '',
    title: 'AI Assistant',
    subtitle: 'Ask me anything!',
    primaryColor: '#3b82f6',
    showAvatar: true,
    autoOpen: false,
    delay: 3000
  })

  const [generatedCode, setGeneratedCode] = useState('')
  const [activeTab, setActiveTab] = useState('config')

  const generateCode = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const scriptUrl = `${baseUrl}/api/widget`

    let code = ''

    switch (config.type) {
      case 'chat':
        code = `<script>
  window.AIWidgetConfig = {
    type: 'chat',
    theme: '${config.theme}',
    position: '${config.position}',
    size: '${config.size}',
    title: '${config.title}',
    subtitle: '${config.subtitle}',
    primaryColor: '${config.primaryColor}',
    showAvatar: ${config.showAvatar},
    autoOpen: ${config.autoOpen},
    delay: ${config.delay},
    apiKey: '${config.apiKey}'
  };
</script>
<script src="${scriptUrl}"></script>`
        break

      case 'button':
        code = `<div id="ai-widget-button" style="
  position: fixed;
  ${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
  ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
  z-index: 9999;
">
  <button style="
    background: ${config.primaryColor};
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
  " onclick="window.openAIWidget()">
    ${config.title}
  </button>
</div>
<script>
  window.openAIWidget = function() {
    window.open('${baseUrl}/chat?widget=true&apiKey=${config.apiKey}', '_blank', 'width=400,height=600');
  };
</script>`
        break

      case 'form':
        code = `<div id="ai-contact-form">
  <form style="
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: ${config.theme === 'dark' ? '#1f2937' : 'white'};
    color: ${config.theme === 'dark' ? 'white' : 'black'};
  ">
    <h3 style="margin-bottom: 16px; font-size: 18px;">${config.title}</h3>
    <p style="margin-bottom: 20px; color: #6b7280; font-size: 14px;">${config.subtitle}</p>

    <input type="text" placeholder="Your Name" style="
      width: 100%;
      padding: 12px;
      margin-bottom: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
    " />

    <input type="email" placeholder="Your Email" style="
      width: 100%;
      padding: 12px;
      margin-bottom: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
    " />

    <textarea placeholder="Your Message" rows="4" style="
      width: 100%;
      padding: 12px;
      margin-bottom: 16px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
      resize: vertical;
    "></textarea>

    <button type="submit" style="
      width: 100%;
      padding: 12px;
      background: ${config.primaryColor};
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s ease;
    " onmouseover="this.style.background='${config.primaryColor}dd'" onmouseout="this.style.background='${config.primaryColor}'">
      Send Message
    </button>
  </form>
</div>
<script>
  document.getElementById('ai-contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Handle form submission with AI processing
    fetch('${baseUrl}/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: e.target[0].value,
        email: e.target[1].value,
        message: e.target[2].value,
        apiKey: '${config.apiKey}'
      })
    });
  });
</script>`
        break

      case 'embed':
        code = `<iframe
  src="${baseUrl}/embed?type=full&apiKey=${config.apiKey}&theme=${config.theme}"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="${config.title}"
></iframe>`
        break
    }

    setGeneratedCode(code)
    setActiveTab('code')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const previewWidget = () => {
    // In a real implementation, this would open a preview modal
    console.log('Preview widget:', config)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Widget Generator</h2>
          <p className="text-muted-foreground">
            Generate embeddable AI widgets for your website
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={previewWidget}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={generateCode}>
            <Code className="h-4 w-4 mr-2" />
            Generate Code
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="code" disabled={!generatedCode}>Generated Code</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Widget Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Widget Type
                </CardTitle>
                <CardDescription>
                  Choose the type of widget you want to create
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {widgetTypes.map(type => {
                    const Icon = type.icon
                    return (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          config.type === type.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, type: type.id as any }))}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Basic Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Widget Title</Label>
                  <Input
                    id="title"
                    value={config.title}
                    onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={config.subtitle}
                    onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Your API key"
                    value={config.apiKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={config.theme} onValueChange={(value) => setConfig(prev => ({ ...prev, theme: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border ${theme.preview}`}></div>
                            {theme.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select value={config.position} onValueChange={(value) => setConfig(prev => ({ ...prev, position: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select value={config.size} onValueChange={(value) => setConfig(prev => ({ ...prev, size: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.showAvatar}
                    onChange={(e) => setConfig(prev => ({ ...prev, showAvatar: e.target.checked }))}
                  />
                  <span className="text-sm">Show Avatar</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.autoOpen}
                    onChange={(e) => setConfig(prev => ({ ...prev, autoOpen: e.target.checked }))}
                  />
                  <span className="text-sm">Auto Open</span>
                </label>
              </div>

              {config.autoOpen && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="delay">Auto Open Delay (ms)</Label>
                  <Input
                    id="delay"
                    type="number"
                    value={config.delay}
                    onChange={(e) => setConfig(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Code</CardTitle>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
              <CardDescription>
                Copy and paste this code into your website's HTML
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedCode}
                readOnly
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}