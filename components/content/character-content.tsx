"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Play, RefreshCw, User, Bot, Sparkles, Wand2 } from "lucide-react"
import { CharacterAIService, CharacterTraits, Character } from "@/lib/character-ai"

const personalityTypes = [
  { id: "helpful", name: "Helpful Assistant", description: "Friendly and supportive" },
  { id: "creative", name: "Creative Thinker", description: "Imaginative and innovative" },
  { id: "analytical", name: "Analytical Expert", description: "Logical and precise" },
  { id: "empathetic", name: "Empathetic Listener", description: "Understanding and caring" },
  { id: "humorous", name: "Witty Companion", description: "Fun and entertaining" },
  { id: "professional", name: "Professional Expert", description: "Formal and knowledgeable" }
]

const baseModels = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" }
]

export function CharacterContent() {
  const [character, setCharacter] = useState<Character>({
    id: "",
    name: "",
    description: "",
    avatar: "🤖",
    baseModel: "gpt-4",
    personality: "helpful",
    traits: {
      creativity: 50,
      intelligence: 70,
      empathy: 60,
      humor: 40,
      formality: 50,
      curiosity: 65
    },
    systemPrompt: "",
    exampleConversations: [],
    tags: []
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [isTesting, setIsTesting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [testMessage, setTestMessage] = useState("")
  const [testResponse, setTestResponse] = useState("")

  const updateTrait = (trait: keyof CharacterTraits, value: number) => {
    setCharacter(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [trait]: value
      }
    }))
  }

  const generateDescription = async () => {
    if (!character.name) return

    setIsGenerating(true)
    try {
      const description = await CharacterAIService.generateCharacterDescription(
        character.name,
        character.personality,
        character.traits
      )
      setCharacter(prev => ({ ...prev, description }))
    } catch (error) {
      console.error('Failed to generate description:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSystemPrompt = async () => {
    if (!character.name || !character.description) return

    setIsGenerating(true)
    try {
      const systemPrompt = await CharacterAIService.generateSystemPrompt(
        character.name,
        character.description,
        character.personality,
        character.traits
      )
      setCharacter(prev => ({ ...prev, systemPrompt }))
    } catch (error) {
      console.error('Failed to generate system prompt:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const testCharacter = async () => {
    if (!testMessage.trim() || !character.systemPrompt) return

    setIsTesting(true)
    try {
      const response = await CharacterAIService.testCharacter(character, testMessage)
      setTestResponse(response)
    } catch (error) {
      console.error('Failed to test character:', error)
      setTestResponse("Sorry, I encountered an error while testing the character.")
    } finally {
      setIsTesting(false)
    }
  }

  const generateExamples = async () => {
    setIsGenerating(true)
    try {
      const examples = await CharacterAIService.generateExampleConversations(character)
      setCharacter(prev => ({ ...prev, exampleConversations: examples }))
    } catch (error) {
      console.error('Failed to generate examples:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveCharacter = () => {
    // In a real implementation, this would save to a database
    console.log("Saving character:", character)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Character Builder</h2>
          <p className="text-muted-foreground">
            Create and customize AI characters with unique personalities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={testCharacter} disabled={isTesting}>
            {isTesting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Test Character
          </Button>
          <Button onClick={saveCharacter}>
            <Save className="h-4 w-4 mr-2" />
            Save Character
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Character Preview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Character Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-3xl">
                  {character.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {character.name || "Unnamed Character"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {personalityTypes.find(p => p.id === character.personality)?.name}
                </p>
              </div>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Base Model</span>
                  <Badge variant="secondary">
                    {baseModels.find(m => m.id === character.baseModel)?.name}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Provider</span>
                  <span className="text-muted-foreground">
                    {baseModels.find(m => m.id === character.baseModel)?.provider}
                  </span>
                </div>
              </div>

              {character.description && (
                <div className="w-full">
                  <p className="text-sm text-muted-foreground text-center">
                    {character.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Character Builder Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Character Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="personality">Personality</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Character Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter character name"
                      value={character.name}
                      onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar Emoji</Label>
                    <Input
                      id="avatar"
                      placeholder="🤖"
                      value={character.avatar}
                      onChange={(e) => setCharacter(prev => ({ ...prev, avatar: e.target.value }))}
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your character's personality and background..."
                    value={character.description}
                    onChange={(e) => setCharacter(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
                    disabled={isGenerating || !character.name}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    Generate Description with AI
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Base AI Model</Label>
                  <Select value={character.baseModel} onValueChange={(value) => setCharacter(prev => ({ ...prev, baseModel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {baseModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {model.provider}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="personality" className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="personality-type">Personality Type</Label>
                  <Select value={character.personality} onValueChange={(value) => setCharacter(prev => ({ ...prev, personality: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {personalityTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Personality Traits</h4>

                  {Object.entries(character.traits).map(([trait, value]) => (
                    <div key={trait} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="capitalize">{trait}</Label>
                        <span className="text-sm text-muted-foreground">{value}/100</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => updateTrait(trait as keyof CharacterTraits, newValue)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>System Prompt</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateSystemPrompt}
                      disabled={isGenerating || !character.name || !character.description}
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4 mr-2" />
                      )}
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Custom system prompt for the character..."
                    value={character.systemPrompt}
                    onChange={(e) => setCharacter(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    rows={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="Add tags (press Enter to add)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const tag = e.currentTarget.value.trim()
                        if (tag && !character.tags.includes(tag)) {
                          setCharacter(prev => ({
                            ...prev,
                            tags: [...prev.tags, tag]
                          }))
                          e.currentTarget.value = ''
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {character.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer"
                        onClick={() => setCharacter(prev => ({
                          ...prev,
                          tags: prev.tags.filter(t => t !== tag)
                        }))}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Character Testing Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Test Character
          </CardTitle>
          <CardDescription>
            Test your character&apos;s responses in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="test-input">Test Message</Label>
              <Textarea
                id="test-input"
                placeholder="Enter a message to test your character..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={3}
              />
              <Button
                onClick={testCharacter}
                disabled={isTesting || !testMessage.trim() || !character.systemPrompt}
                className="w-full"
              >
                {isTesting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Test Character
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Character Response</Label>
              <div className="min-h-[120px] p-3 border rounded-lg bg-muted/50">
                {testResponse ? (
                  <p className="text-sm">{testResponse}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Character response will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>

          {character.exampleConversations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Example Conversations</Label>
                <Button variant="outline" size="sm" onClick={generateExamples}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate New Examples
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {character.exampleConversations.map((conversation, index) => (
                  <div key={index} className="p-2 border rounded text-sm">
                    <pre className="whitespace-pre-wrap font-sans">{conversation}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}