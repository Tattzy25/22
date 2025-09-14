"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import {
  Search,
  Share2,
  Download,
  Star,
  TrendingUp,
  Users,
  Bot,
  Image as ImageIcon,
  Music,
  Zap,
  Plus,
  ThumbsUp,
  Eye,
  Tag,
  MessageSquare
} from "lucide-react"

interface CommunityItem {
  id: string
  type: 'character' | 'image' | 'music' | 'automation' | 'prompt'
  title: string
  description: string
  author: {
    name: string
    avatar?: string
    verified?: boolean
  }
  thumbnail?: string
  tags: string[]
  likes: number
  comments: number
  views: number
  createdAt: Date
  featured?: boolean
  downloads?: number
}

interface Comment {
  id: string
  author: {
    name: string
    avatar?: string
  }
  content: string
  createdAt: Date
  likes: number
}

export function CommunityContent() {
  const [items, setItems] = useState<CommunityItem[]>([
    {
      id: '1',
      type: 'character',
      title: 'Tech Mentor AI',
      description: 'A helpful AI mentor for coding and technology guidance',
      author: { name: 'Alex Chen', verified: true },
      tags: ['education', 'coding', 'mentor'],
      likes: 1247,
      comments: 89,
      views: 15420,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      featured: true,
      downloads: 342
    },
    {
      id: '2',
      type: 'image',
      title: 'Cyberpunk Cityscape',
      description: 'Futuristic urban landscape with neon lights and flying cars',
      author: { name: 'Sarah Kim', verified: true },
      thumbnail: '/api/placeholder/300/200',
      tags: ['cyberpunk', 'city', 'futuristic'],
      likes: 892,
      comments: 45,
      views: 9876,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      downloads: 567
    },
    {
      id: '3',
      type: 'automation',
      title: 'Content Generation Pipeline',
      description: 'Automated workflow for creating blog posts and social media content',
      author: { name: 'Mike Johnson' },
      tags: ['automation', 'content', 'social-media'],
      likes: 634,
      comments: 23,
      views: 5432,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      downloads: 123
    },
    {
      id: '4',
      type: 'music',
      title: 'Ambient Study Beats',
      description: 'Calming electronic music perfect for focus and concentration',
      author: { name: 'Luna Rodriguez', verified: true },
      tags: ['ambient', 'electronic', 'study'],
      likes: 2156,
      comments: 156,
      views: 25678,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
      featured: true,
      downloads: 892
    }
  ])

  const [selectedItem, setSelectedItem] = useState<CommunityItem | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('trending')
  const [isSharing, setIsSharing] = useState(false)

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === 'all' || item.type === selectedType
    return matchesSearch && matchesType
  }).sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.likes + b.comments * 2) - (a.likes + a.comments * 2)
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime()
      case 'popular':
        return b.likes - a.likes
      case 'downloads':
        return (b.downloads || 0) - (a.downloads || 0)
      default:
        return 0
    }
  })

  const getTypeIcon = (type: CommunityItem['type']) => {
    switch (type) {
      case 'character': return <Bot className="h-4 w-4" />
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'music': return <Music className="h-4 w-4" />
      case 'automation': return <Zap className="h-4 w-4" />
      case 'prompt': return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: CommunityItem['type']) => {
    switch (type) {
      case 'character': return 'bg-blue-500'
      case 'image': return 'bg-green-500'
      case 'music': return 'bg-purple-500'
      case 'automation': return 'bg-orange-500'
      case 'prompt': return 'bg-red-500'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleLike = (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, likes: item.likes + 1 } : item
    ))
  }

  const handleShare = (item: CommunityItem) => {
    // In a real app, this would open a share dialog or copy link
    navigator.clipboard.writeText(`Check out this ${item.type}: ${item.title} by ${item.author.name}`)
    setIsSharing(true)
    setTimeout(() => setIsSharing(false), 2000)
  }

  const openItemDetails = (item: CommunityItem) => {
    setSelectedItem(item)
    // Mock comments for the selected item
    setComments([
      {
        id: '1',
        author: { name: 'John Doe', avatar: '/api/placeholder/32/32' },
        content: 'This is amazing! Really helpful for my projects.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        likes: 12
      },
      {
        id: '2',
        author: { name: 'Jane Smith' },
        content: 'Could you share how you created this?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
        likes: 5
      }
    ])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Community Hub</h2>
          <p className="text-muted-foreground">
            Discover, share, and collaborate on AI creations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Share Creation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Creation</DialogTitle>
                <DialogDescription>
                  Share your AI-generated content with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="share-type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="character">AI Character</SelectItem>
                      <SelectItem value="image">Generated Image</SelectItem>
                      <SelectItem value="music">AI Music</SelectItem>
                      <SelectItem value="automation">Automation</SelectItem>
                      <SelectItem value="prompt">Prompt Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="share-title">Title</Label>
                  <Input id="share-title" placeholder="Give it a catchy title" />
                </div>
                <div>
                  <Label htmlFor="share-description">Description</Label>
                  <Textarea id="share-description" placeholder="Describe what makes this special" />
                </div>
                <div>
                  <Label htmlFor="share-tags">Tags</Label>
                  <Input id="share-tags" placeholder="Add tags separated by commas" />
                </div>
                <Button className="w-full">Share with Community</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creations, tags, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="character">Characters</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="automation">Automations</SelectItem>
                <SelectItem value="prompt">Prompts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Liked</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Community Feed */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            {item.featured && (
                              <Badge variant="secondary" className="gap-1">
                                <Star className="h-3 w-3" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">{item.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.tags.length - 3} more
                              </Badge>
                            )}
                          </div>

                          {/* Author and Stats */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {item.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {item.author.name}
                                {item.author.verified && <Star className="inline h-3 w-3 ml-1 text-yellow-500" />}
                              </span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {formatNumber(item.views)}
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {formatNumber(item.likes)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {formatNumber(item.comments)}
                              </div>
                              {item.downloads && (
                                <div className="flex items-center gap-1">
                                  <Download className="h-4 w-4" />
                                  {formatNumber(item.downloads)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail for images */}
                      {item.thumbnail && (
                        <div className="ml-4 flex-shrink-0">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            width={96}
                            height={96}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(item.id)
                      }}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openItemDetails(item)
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShare(item)
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    {item.downloads !== undefined && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['AI Characters', 'Cyberpunk Art', 'Ambient Music', 'Automation Workflows', 'Prompt Engineering'].map((topic) => (
                  <div key={topic} className="flex items-center justify-between">
                    <span className="text-sm font-medium">#{topic.toLowerCase().replace(' ', '')}</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.floor(Math.random() * 50) + 10}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Alex Chen', contributions: 247, verified: true },
                  { name: 'Sarah Kim', contributions: 189, verified: true },
                  { name: 'Luna Rodriguez', contributions: 156, verified: true },
                  { name: 'Mike Johnson', contributions: 98, verified: false }
                ].map((contributor) => (
                  <div key={contributor.name} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <span className="text-sm font-medium">
                        {contributor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{contributor.name}</span>
                        {contributor.verified && <Star className="h-3 w-3 text-yellow-500" />}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {contributor.contributions} contributions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Creations</span>
                  <span className="font-medium">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="font-medium">3,421</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Downloads</span>
                  <span className="font-medium">89,532</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Comments</span>
                  <span className="font-medium">15,678</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Item Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedItem.type)}
                  {selectedItem.title}
                </DialogTitle>
                <DialogDescription>{selectedItem.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedItem.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{selectedItem.author.name}</span>
                      {selectedItem.author.verified && <Star className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(selectedItem.createdAt)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {formatNumber(selectedItem.views)} views
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {formatNumber(selectedItem.likes)} likes
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {formatNumber(selectedItem.comments)} comments
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <h4 className="font-medium">Comments</h4>
                  <ScrollArea className="h-48">
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {comment.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{comment.author.name}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {comment.likes}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Input placeholder="Add a comment..." className="flex-1" />
                    <Button size="sm">Post</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Success Toast */}
      {isSharing && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Link copied to clipboard!
        </div>
      )}
    </div>
  )
}