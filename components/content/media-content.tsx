"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Music,
  Image as ImageIcon,
  Play,
  Pause,
  Download,
  Wand2,
  Sparkles,
  Volume2,
  Clock,
  Palette,
  Zap,
  Star,
  Heart,
  Share,
  Save,
  RefreshCw,
  Settings
} from "lucide-react"
import { MediaGenerationService, GeneratedImage, GeneratedMusic } from "@/lib/media-generation"

interface MusicGeneration {
  id: string
  title: string
  genre: string
  mood: string
  duration: number
  tempo: number
  instruments: string[]
  prompt: string
  status: 'generating' | 'completed' | 'failed'
  audioUrl?: string
  createdAt: Date
}

interface ImageGeneration {
  id: string
  title: string
  prompt: string
  style: string
  aspectRatio: string
  quality: 'standard' | 'hd' | 'ultra'
  status: 'generating' | 'completed' | 'failed'
  imageUrl?: string
  createdAt: Date
}

const musicGenres = [
  'Electronic', 'Rock', 'Jazz', 'Classical', 'Hip Hop', 'Pop', 'Ambient', 'Folk',
  'Blues', 'Reggae', 'Country', 'R&B', 'Metal', 'Punk', 'Funk', 'Soul'
]

const musicMoods = [
  'Energetic', 'Calm', 'Happy', 'Sad', 'Mysterious', 'Romantic', 'Dark', 'Uplifting',
  'Melancholic', 'Joyful', 'Tense', 'Peaceful', 'Aggressive', 'Dreamy', 'Nostalgic'
]

const imageStyles = [
  'Realistic', 'Artistic', 'Abstract', 'Cartoon', 'Minimalist', 'Vintage', 'Futuristic',
  'Fantasy', 'Cyberpunk', 'Steampunk', 'Watercolor', 'Oil Painting', 'Sketch', '3D Render'
]

const aspectRatios = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '4:3', label: 'Standard (4:3)' },
  { value: '16:9', label: 'Widescreen (16:9)' },
  { value: '3:4', label: 'Portrait (3:4)' },
  { value: '9:16', label: 'Vertical (9:16)' }
]

export function MediaContent() {
  const [activeTab, setActiveTab] = useState('music')
  const [musicGenerations, setMusicGenerations] = useState<MusicGeneration[]>([])
  const [imageGenerations, setImageGenerations] = useState<ImageGeneration[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  // Music generation state
  const [musicPrompt, setMusicPrompt] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [tempo, setTempo] = useState([120])
  const [duration, setDuration] = useState([30])
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [imageQuality, setImageQuality] = useState<'standard' | 'hd' | 'ultra'>('standard')

  const audioRef = useRef<HTMLAudioElement>(null)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const generateMusic = async () => {
    if (!musicPrompt.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // Create enhanced prompt
      const enhancedPrompt = await MediaGenerationService.generateMusicPrompt(musicPrompt)

      // Generate music
      const generatedMusic = await MediaGenerationService.generateMusic(enhancedPrompt)

      const newGeneration: MusicGeneration = {
        id: generatedMusic.id,
        title: `Generated Music ${musicGenerations.length + 1}`,
        genre: selectedGenre,
        mood: selectedMood,
        duration: generatedMusic.duration,
        tempo: tempo[0],
        instruments: selectedInstruments,
        prompt: enhancedPrompt,
        status: 'completed',
        audioUrl: generatedMusic.url,
        createdAt: generatedMusic.createdAt
      }

      setMusicGenerations(prev => [newGeneration, ...prev])
      setGenerationProgress(100)
    } catch (error) {
      console.error('Failed to generate music:', error)
      // Add failed generation to list
      const failedGeneration: MusicGeneration = {
        id: `music-${Date.now()}`,
        title: `Generated Music ${musicGenerations.length + 1}`,
        genre: selectedGenre,
        mood: selectedMood,
        duration: duration[0],
        tempo: tempo[0],
        instruments: selectedInstruments,
        prompt: musicPrompt,
        status: 'failed',
        createdAt: new Date()
      }
      setMusicGenerations(prev => [failedGeneration, ...prev])
    } finally {
      setIsGenerating(false)
    }
  }

  const generateImage = async () => {
    if (!imagePrompt.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // Create enhanced prompt
      const enhancedPrompt = await MediaGenerationService.enhancePrompt(imagePrompt, 'image')

      // Generate image
      const generatedImage = await MediaGenerationService.generateImage(enhancedPrompt)

      const newGeneration: ImageGeneration = {
        id: generatedImage.id,
        title: `Generated Image ${imageGenerations.length + 1}`,
        prompt: enhancedPrompt,
        style: selectedStyle,
        aspectRatio: aspectRatio,
        quality: imageQuality,
        status: 'completed',
        imageUrl: generatedImage.url,
        createdAt: generatedImage.createdAt
      }

      setImageGenerations(prev => [newGeneration, ...prev])
      setGenerationProgress(100)
    } catch (error) {
      console.error('Failed to generate image:', error)
      // Add failed generation to list
      const failedGeneration: ImageGeneration = {
        id: `image-${Date.now()}`,
        title: `Generated Image ${imageGenerations.length + 1}`,
        prompt: imagePrompt,
        style: selectedStyle,
        aspectRatio: aspectRatio,
        quality: imageQuality,
        status: 'failed',
        createdAt: new Date()
      }
      setImageGenerations(prev => [failedGeneration, ...prev])
    } finally {
      setIsGenerating(false)
    }
  }

  const playAudio = (audioUrl: string, generationId: string) => {
    if (playingAudio === generationId) {
      audioRef.current?.pause()
      setPlayingAudio(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setPlayingAudio(generationId)
      }
    }
  }

  const downloadMedia = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Studio</h2>
          <p className="text-muted-foreground">
            Generate music and images with AI-powered creativity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Powered
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="music" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Music Generation
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Image Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Music Generation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Create Music
                </CardTitle>
                <CardDescription>
                  Generate original music with AI using natural language prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="music-prompt">Describe your music</Label>
                  <Textarea
                    id="music-prompt"
                    placeholder="A upbeat electronic track with synth leads and driving bass..."
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {musicGenres.map(genre => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Mood</Label>
                    <Select value={selectedMood} onValueChange={setSelectedMood}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {musicMoods.map(mood => (
                          <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tempo: {tempo[0]} BPM</Label>
                  <Slider
                    value={tempo}
                    onValueChange={setTempo}
                    max={200}
                    min={60}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration: {duration[0]} seconds</Label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={300}
                    min={15}
                    step={15}
                    className="w-full"
                  />
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Generating music...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="w-full" />
                  </div>
                )}

                <Button
                  onClick={generateMusic}
                  disabled={isGenerating || !musicPrompt.trim()}
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Music'}
                </Button>
              </CardContent>
            </Card>

            {/* Music Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Your Music
                </CardTitle>
                <CardDescription>
                  Generated music tracks and compositions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {musicGenerations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No music generated yet</p>
                      <p className="text-sm">Create your first AI-generated track above</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {musicGenerations.map(generation => (
                        <div key={generation.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{generation.title}</h4>
                            <Badge variant={
                              generation.status === 'completed' ? 'default' :
                              generation.status === 'generating' ? 'secondary' : 'destructive'
                            }>
                              {generation.status}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {generation.prompt}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {generation.duration}s
                            </span>
                            <span>{generation.genre}</span>
                            <span>{generation.mood}</span>
                          </div>

                          {generation.status === 'completed' && generation.audioUrl && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => playAudio(generation.audioUrl!, generation.id)}
                              >
                                {playingAudio === generation.id ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadMedia(generation.audioUrl!, `${generation.title}.mp3`)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Image Generation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Create Images
                </CardTitle>
                <CardDescription>
                  Generate stunning visuals with AI using detailed prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">Describe your image</Label>
                  <Textarea
                    id="image-prompt"
                    placeholder="A serene mountain landscape at sunset with vibrant colors..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Style</Label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {imageStyles.map(style => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatios.map(ratio => (
                          <SelectItem key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select value={imageQuality} onValueChange={(value: 'standard' | 'hd' | 'ultra') => setImageQuality(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="hd">HD</SelectItem>
                      <SelectItem value="ultra">Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Generating image...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="w-full" />
                  </div>
                )}

                <Button
                  onClick={generateImage}
                  disabled={isGenerating || !imagePrompt.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Image'}
                </Button>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Your Images
                </CardTitle>
                <CardDescription>
                  AI-generated artwork and visuals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {imageGenerations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No images generated yet</p>
                      <p className="text-sm">Create your first AI-generated image above</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {imageGenerations.map(generation => (
                        <div key={generation.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{generation.title}</h4>
                            <Badge variant={
                              generation.status === 'completed' ? 'default' :
                              generation.status === 'generating' ? 'secondary' : 'destructive'
                            }>
                              {generation.status}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {generation.prompt}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span>{generation.style}</span>
                            <span>{generation.aspectRatio}</span>
                            <span className="capitalize">{generation.quality}</span>
                          </div>

                          {generation.status === 'completed' && generation.imageUrl && (
                            <div className="space-y-3">
                              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                {/* In a real implementation, this would be an img tag */}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadMedia(generation.imageUrl!, `${generation.title}.jpg`)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Share className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingAudio(null)}
        className="hidden"
      />
    </div>
  )
}