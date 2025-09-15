import type { HubModel } from './ai-hub-models';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export class AIChatService {
  private static getApiUrl() {
    // This ensures we use the full URL on the server-side.
    // On the client-side, relative URLs are fine.
    if (typeof window === 'undefined') {
      const host = process.env.VERCEL_URL || 'localhost:3000';
      const protocol = host.startsWith('localhost') ? 'http' : 'https';
      return `${protocol}://${host}/api/v0/ai`;
    }
    return '/api/v0/ai';
  }

  static async sendMessage(session: ChatSession, userMessage: string): Promise<string> {
    const messages: ChatMessage[] = [
      ...session.messages,
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await fetch(this.getApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: session.model,
          messages: messages,
          stream: false,
          temperature: session.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} ${errorText}`);
        throw new Error(`Failed to get AI response. Status: ${response.status}`);
      }

      const result = await response.json();
      return result.text?.trim() || '';
    } catch (error) {
      console.error('Failed to get AI response:', error);
      throw new Error('Failed to get response from AI. Please try again.');
    }
  }

  static async generateTitle(messages: ChatMessage[]): Promise<string> {
    if (messages.length === 0) return 'New Chat';

    const firstUserMessage = messages.find(m => m.role === 'user')?.content || '';
    if (!firstUserMessage) return 'New Chat';

    const prompt = `Generate a short, descriptive title (max 6 words) for a conversation that starts with: "${firstUserMessage.substring(0, 100)}"`;

    try {
      const response = await fetch(this.getApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai:gpt-4', // Using a default model for title generation
          prompt,
          stream: false,
        }),
      });

       if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} ${errorText}`);
        throw new Error(`Failed to generate title. Status: ${response.status}`);
      }

      const { text } = await response.json();
      return text.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
    } catch (error) {
      console.error('Failed to generate title:', error);
      return 'New Chat';
    }
  }

  static async getAvailableModels() {
     try {
      const response = await fetch(this.getApiUrl());
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} ${errorText}`);
        throw new Error(`Failed to fetch models. Status: ${response.status}`);
      }
      const models: HubModel[] = await response.json();
      // The hub returns models with 'id', 'model', 'provider'. We adapt it here.
      return models.map((m) => ({
        id: m.id,
        name: m.model.split('/').pop() ?? '', // e.g., 'gpt-4' from 'openai/gpt-4'
        provider: m.provider,
        icon: "🤖", // Placeholder icon
        contextWindow: 16385, // Placeholder value
      }));
    } catch (error) {
      console.error('Failed to fetch available models:', error);
      return []; // Return empty array on failure
    }
  }

  static estimateTokenCount(messages: ChatMessage[]): number {
    // Rough estimation: ~4 characters per token
    const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    return Math.ceil(totalChars / 4);
  }

  static async summarizeConversation(messages: ChatMessage[]): Promise<string> {
    if (messages.length < 4) return '';

    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');

    const prompt = `Summarize this conversation in 2-3 sentences, capturing the main topics and key points discussed:\n\n${conversationText}`;

    try {
       const response = await fetch(this.getApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai:gpt-4', // Using a default model for summarization
          prompt,
          stream: false,
        }),
      });

       if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} ${errorText}`);
        throw new Error(`Failed to summarize. Status: ${response.status}`);
      }

      const { text } = await response.json();
      return text.trim();
    } catch (error) {
      console.error('Failed to summarize conversation:', error);
      return '';
    }
  }
}