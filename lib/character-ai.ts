import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export interface CharacterTraits {
  creativity: number;
  intelligence: number;
  empathy: number;
  humor: number;
  formality: number;
  curiosity: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  baseModel: string;
  personality: string;
  traits: CharacterTraits;
  systemPrompt: string;
  exampleConversations: string[];
  tags: string[];
}

export class CharacterAIService {
  static async generateCharacterDescription(
    name: string,
    personality: string,
    traits: CharacterTraits
  ): Promise<string> {
    const prompt = `Create a detailed character description for an AI named "${name}" with the following personality: ${personality}.

Character Traits (on a scale of 1-100):
- Creativity: ${traits.creativity}
- Intelligence: ${traits.intelligence}
- Empathy: ${traits.empathy}
- Humor: ${traits.humor}
- Formality: ${traits.formality}
- Curiosity: ${traits.curiosity}

Write a compelling 2-3 paragraph description that captures this character's personality, behavior, and unique characteristics. Make it vivid and engaging.`;

    try {
      const { text } = await generateText({
        model: openai('gpt-4'),
        prompt,
      });

      return text.trim();
    } catch (error) {
      console.error('Failed to generate character description:', error);
      return `A ${personality.toLowerCase()} AI character named ${name} with balanced traits and a unique personality.`;
    }
  }

  static async generateSystemPrompt(
    name: string,
    description: string,
    personality: string,
    traits: CharacterTraits
  ): Promise<string> {
    const prompt = `Create a detailed system prompt for an AI character with these specifications:

Name: ${name}
Description: ${description}
Personality Type: ${personality}
Traits: ${JSON.stringify(traits, null, 2)}

Generate a comprehensive system prompt that the AI should use to stay in character. Include:
1. Role definition
2. Personality guidelines
3. Behavioral instructions based on traits
4. Communication style
5. Boundaries and limitations

Make it detailed but concise, suitable for an AI system prompt.`;

    try {
      const { text } = await generateText({
        model: openai('gpt-4'),
        prompt,
      });

      return text.trim();
    } catch (error) {
      console.error('Failed to generate system prompt:', error);
      return `You are ${name}, ${description}. Stay in character and respond according to your personality traits.`;
    }
  }

  static async testCharacter(
    character: Character,
    testMessage: string
  ): Promise<string> {
    const model = character.baseModel.includes('claude') ? anthropic('claude-3-opus') : openai('gpt-4');

    try {
      const { text } = await generateText({
        model,
        system: character.systemPrompt,
        prompt: testMessage,
      });

      return text.trim();
    } catch (error) {
      console.error('Failed to test character:', error);
      return "I'm sorry, I'm having trouble responding right now. Please try again.";
    }
  }

  static async generateExampleConversations(
    character: Character
  ): Promise<string[]> {
    const prompt = `Generate 3 example conversations for the AI character "${character.name}".

Character Description: ${character.description}
Personality: ${character.personality}
System Prompt: ${character.systemPrompt}

For each conversation, provide:
1. User input
2. AI character response

Format as a JSON array of objects with "user" and "ai" properties.

Example format:
[
  {"user": "Hello!", "ai": "Hi there! How can I help you today?"},
  {"user": "Tell me a joke", "ai": "Why don't scientists trust atoms? Because they make up everything!"}
]`;

    try {
      const { text } = await generateText({
        model: openai('gpt-4'),
        prompt,
      });

      // Parse the JSON response
      const conversations = JSON.parse(text.trim());
      return conversations.map((conv: { user: string; ai: string }) => `${conv.user}\n${conv.ai}`);
    } catch (error) {
      console.error('Failed to generate example conversations:', error);
      return [
        "Hello! How can I help you today?\nHi there! I'm excited to assist you with anything you need.",
        "Tell me about yourself.\nI'm ${character.name}, ${character.description}",
        "What's your favorite thing to do?\nI love helping people and learning new things!"
      ];
    }
  }
}