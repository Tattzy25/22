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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Heart,
  MessageCircle,
  Share,
  Star,
  TrendingUp,
  Search,
  Filter,
  User,
  Gamepad2,
  Music,
  Image as ImageIcon,
  Zap,
  Trophy,
  Eye,
  ThumbsUp,
  Bookmark,
  ExternalLink,
  Crown,
  Medal,
  Award
} from "lucide-react"

interface CommunityPost {
  id: string
  type: 'game' | 'automation' | 'music' | 'image' | 'character'
  title: string
  description: string
  author: {
    id: string
    name: string
    avatar: string
    level: number
    badges: string[]
  }
  content: {
    thumbnail?: string
    previewUrl?: string
    tags: string[]
  }
  stats: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  rating: number
  createdAt: Date
  featured: boolean
  liked: boolean
  bookmarked: boolean
}

interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar: string
  }
  content: string
  createdAt: Date
  likes: number
}

const samplePosts: CommunityPost[] = [
  {
    id: '1',
    type: 'game',
    title: 'AI Dungeon Crawler',
    description: 'An immersive text-based adventure game with dynamic storytelling powered by GPT-4',
    author: {
      id: 'user1',
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      level: 15,
      badges: ['Game Master', 'AI Pioneer']
    },
    content: {
      thumbnail: '/thumbnails/dungeon.jpg',
      tags: ['Adventure', 'RPG', 'AI', 'Storytelling']
    },
    stats: {
      likes: 1247,
      comments: 89,
      shares: 234,
      views: 15432
    },
    rating: 4.8,
    createdAt: new Date('2024-01-15'),
    featured: true,
    liked: false,
    bookmarked: true
  },
  {
    id: '2',
    type: 'automation',
    title: 'Smart Content Generator',
    description: 'Automated workflow that creates blog posts, social media content, and marketing copy',
    author: {
      id: 'user2',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      level: 22,
      badges: ['Automation Expert', 'Content Creator']
    },
    content: {
      thumbnail: '/thumbnails/automation.jpg',
      tags: ['Automation', 'Content', 'Marketing', 'AI']
    },
    stats: {
      likes: 892,
      comments: 45,
      shares: 156,
      views: 8765
    },
    rating: 4.6,
    createdAt: new Date('2024-01-12'),
    featured: false,
    liked: true,
    bookmarked: false
  },
  {
    id: '3',
    type: 'music',
    title: 'Cyberpunk Synthwave',
    description: 'AI-generated electronic music with retro-futuristic vibes and neon aesthetics',
    author: {
      id: 'user3',
      name: 'Mike Rodriguez',
      avatar: '/avatars/mike.jpg',
      level: 8,
      badges: ['Music Producer', 'Synthwave']
    },
    content: {
      thumbnail: '/thumbnails/music.jpg',
      tags: ['Electronic', 'Synthwave', 'AI Music', 'Cyberpunk']
    },
    stats: {
      likes: 2156,
      comments: 134,
      shares: 445,
      views: 22341
    },
    rating: 4.9,
    createdAt: new Date('2024-01-10'),
    featured: true,
    liked: true,
    bookmarked: true
  }
]

const postTypeIcons = {
  game: Gamepad2,
  automation: Zap,
  music: Music,
  image: ImageIcon,
  character: User
}

export function CommunityContent() {
  const [activeTab, setActiveTab] = useState('discover')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [posts, setPosts] = useState<CommunityPost[]>(samplePosts)
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || post.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            stats: {
              ...post.stats,
              likes: post.liked ? post.stats.likes - 1 : post.stats.likes + 1
            }
          }
        : post
    ))
  }

  const toggleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    ))
  }

  const addComment = () => {
    if (!newComment.trim() || !selectedPost) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        id: 'current-user',
        name: 'You',
        avatar: '/avatars/current-user.jpg'
      },
      content: newComment,
      createdAt: new Date(),
      likes: 0
    }

    setComments(prev => [...prev, comment])
    setNewComment('')

    // Update post comment count
    setPosts(prev => prev.map(post =>
      post.id === selectedPost.id
        ? { ...post, stats: { ...post.stats, comments: post.stats.comments + 1 } }
        : post
    ))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const PostCard = ({ post }: { post: CommunityPost }) => {
    const Icon = postTypeIcons[post.type]

    return (
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.author.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    Level {post.author.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  {post.type}
                </div>
              </div>
            </div>
            {post.featured && (
              <Badge variant="default" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {post.description}
            </p>

            <div className="flex items-center gap-2">
              {renderStars(post.rating)}
              <span className="text-sm text-muted-foreground">({post.rating})</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {post.content.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className={`h-4 w-4 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                  {post.stats.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {post.stats.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.stats.views}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(post.id)
                  }}
                >
                  <ThumbsUp className={`h-4 w-4 ${post.liked ? 'fill-blue-500 text-blue-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark(post.id)
                  }}
                >
                  <Bookmark className={`h-4 w-4 ${post.bookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPost(post)
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Community</h2>
          <p className="text-muted-foreground">
            Discover, share, and collaborate on amazing AI creations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            12.5K Members
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            8.2K Creations
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6 mt-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search creations, users, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="game">Games</SelectItem>
                    <SelectItem value="automation">Automations</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="character">Characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Featured Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Featured Creations
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.filter(post => post.featured).map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* All Creations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Latest Creations</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts
              .sort((a, b) => b.stats.likes - a.stats.likes)
              .map(post => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-6 mt-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Follow creators to see their work</h3>
            <p className="text-muted-foreground mb-4">
              Discover amazing creators and follow them to see their latest creations in your feed
            </p>
            <Button>Browse Creators</Button>
          </div>
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts
              .filter(post => post.bookmarked)
              .map(post => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedPost.title}</CardTitle>
                <CardDescription>{selectedPost.description}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPost(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={selectedPost.author.avatar} />
                  <AvatarFallback>{selectedPost.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedPost.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Level {selectedPost.author.level} • {selectedPost.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Comments Section */}
              <div className="space-y-4">
                <h4 className="font-medium">Comments ({selectedPost.stats.comments})</h4>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-64">
                    <div className="space-y-4">
                      {comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {comment.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {comment.likes}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}