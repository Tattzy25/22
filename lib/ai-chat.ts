import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { cohere } from '@ai-sdk/cohere';
import { generateText } from 'ai';

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
  static async sendMessage(session: ChatSession, userMessage: string): Promise<string> {
    const messages: ChatMessage[] = [
      ...session.messages,
      { role: 'user', content: userMessage }
    ];

    let model;
    switch (session.model) {
      case 'gpt-4':
        model = openai('gpt-4');
        break;
      case 'gpt-3.5-turbo':
        model = openai('gpt-3.5-turbo');
        break;
      case 'claude-3-opus':
        model = anthropic('claude-3-opus');
        break;
      case 'claude-3-haiku':
        model = anthropic('claude-3-haiku');
        break;
      case 'gemini-pro':
        model = google('models/gemini-pro');
        break;
      case 'command-r':
        model = cohere('command-r');
        break;
      default:
        model = openai('gpt-4');
    }

    try {
      const { text } = await generateText({
        model,
        messages,
        temperature: session.temperature || 0.7,
      });

      return text.trim();
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
      const { text } = await generateText({
        model: openai('gpt-4'),
        prompt,
      });

      return text.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
    } catch (error) {
      console.error('Failed to generate title:', error);
      return 'New Chat';
    }
  }

  static getAvailableModels() {
    return [
      { id: "gpt-4", name: "GPT-4", provider: "OpenAI", icon: "🤖", contextWindow: 8192 },
      { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", icon: "🧠", contextWindow: 200000 },
      { id: "gemini-pro", name: "Gemini Pro", provider: "Google", icon: "🌟", contextWindow: 32768 },
      { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", icon: "⚡", contextWindow: 200000 },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", icon: "🚀", contextWindow: 4096 },
      { id: "command-r", name: "Command R", provider: "Cohere", icon: "🏢", contextWindow: 128000 }
    ];
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
      const { text } = await generateText({
        model: openai('gpt-4'),
        prompt,
      });

      return text.trim();
    } catch (error) {
      console.error('Failed to summarize conversation:', error);
      return '';
    }
  }
}