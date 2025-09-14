export interface GameTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
  features: string[]
}

export interface GameElement {
  id: string
  type: 'text' | 'button' | 'image' | 'input' | 'choice' | 'timer' | 'score'
  content: string
  position: { x: number; y: number }
  style: Record<string, unknown>
  config: Record<string, unknown>
}

export interface GameScene {
  id: string
  name: string
  elements: GameElement[]
  background: string
  music?: string
}

export interface GameConfig {
  id: string
  title: string
  description: string
  template: string
  difficulty: 'easy' | 'medium' | 'hard'
  maxScore: number
  timeLimit?: number
  scenes: GameScene[]
  globalSettings: {
    theme: 'light' | 'dark' | 'colorful'
    soundEnabled: boolean
    vibrationEnabled: boolean
    autoSave: boolean
  }
}

export const gameTemplates: GameTemplate[] = [
  {
    id: 'quiz',
    name: 'Interactive Quiz',
    description: 'Create engaging quizzes with multiple choice questions',
    category: 'Educational',
    icon: 'Target',
    difficulty: 'easy',
    estimatedTime: '15-30 min',
    features: ['Multiple Choice', 'Timer', 'Score Tracking', 'Instant Feedback']
  },
  {
    id: 'adventure',
    name: 'Text Adventure',
    description: 'Build choose-your-own-adventure style games',
    category: 'Story',
    icon: 'Puzzle',
    difficulty: 'medium',
    estimatedTime: '30-60 min',
    features: ['Branching Story', 'Character Choices', 'Multiple Endings', 'Inventory System']
  },
  {
    id: 'puzzle',
    name: 'Logic Puzzle',
    description: 'Design brain-teasing puzzles and riddles',
    category: 'Puzzle',
    icon: 'Gamepad2',
    difficulty: 'hard',
    estimatedTime: '45-90 min',
    features: ['Custom Logic', 'Hints System', 'Difficulty Levels', 'Progress Tracking']
  },
  {
    id: 'memory',
    name: 'Memory Game',
    description: 'Create memory matching and sequence games',
    category: 'Casual',
    icon: 'Zap',
    difficulty: 'easy',
    estimatedTime: '10-20 min',
    features: ['Card Matching', 'Sequence Memory', 'Time Challenges', 'High Scores']
  },
  {
    id: 'trivia',
    name: 'Trivia Challenge',
    description: 'Build trivia games with categories and scoring',
    category: 'Educational',
    icon: 'Trophy',
    difficulty: 'medium',
    estimatedTime: '20-40 min',
    features: ['Categories', 'Multiplayer', 'Leaderboards', 'Timed Rounds']
  }
]

export const elementTypes = [
  { id: 'text', name: 'Text Block', icon: '📝', description: 'Display text content' },
  { id: 'button', name: 'Interactive Button', icon: '🔘', description: 'Clickable action button' },
  { id: 'image', name: 'Image Display', icon: '🖼️', description: 'Show images or graphics' },
  { id: 'input', name: 'Text Input', icon: '⌨️', description: 'Collect user input' },
  { id: 'choice', name: 'Multiple Choice', icon: '☑️', description: 'Present options to choose from' },
  { id: 'timer', name: 'Timer/Countdown', icon: '⏱️', description: 'Display time remaining' },
  { id: 'score', name: 'Score Display', icon: '🏆', description: 'Show current score' }
]