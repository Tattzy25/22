import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
  model: string;
}

export interface GeneratedMusic {
  id: string;
  url: string;
  prompt: string;
  duration: number;
  createdAt: Date;
  model: string;
}

export class MediaGenerationService {
  static async generateImage(prompt: string, model: 'dall-e-3' | 'dall-e-2' = 'dall-e-3'): Promise<GeneratedImage> {
    try {
      // Using OpenAI's DALL-E through their API
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          model,
          n: 1,
          size: model === 'dall-e-3' ? '1024x1024' : '512x512',
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        id: `img_${Date.now()}`,
        url: data.data[0].url,
        prompt,
        createdAt: new Date(),
        model,
      };
    } catch (error) {
      console.error('Failed to generate image:', error);
      throw new Error('Failed to generate image. Please try again.');
    }
  }

  static async generateMusicPrompt(description: string): Promise<string> {
    const prompt = `Create a detailed music generation prompt based on this description: "${description}"

Generate a comprehensive prompt for an AI music generation model that includes:
- Genre and style
- Mood and atmosphere
- Instruments and arrangement
- Tempo and rhythm
- Key elements and characteristics

Make it vivid and specific for high-quality music generation.`;

    try {
      const { text } = await generateText({
        model: openai('gpt-4'),
        prompt,
      });

      return text.trim();
    } catch (error) {
      console.error('Failed to generate music prompt:', error);
      return description;
    }
  }

  static async generateMusic(description: string): Promise<GeneratedMusic> {
    try {
      // For now, we'll simulate music generation since we don't have a direct music API
      // In a real implementation, you'd use services like Suno AI, Udio, or similar
      const musicPrompt = await this.generateMusicPrompt(description);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      return {
        id: `music_${Date.now()}`,
        url: `https://example.com/generated-music-${Date.now()}.mp3`, // Placeholder
        prompt: musicPrompt,
        duration: 180, // 3 minutes
        createdAt: new Date(),
        model: 'music-gen-ai',
      };
    } catch (error) {
      console.error('Failed to generate music:', error);
      throw new Error('Failed to generate music. Please try again.');
    }
  }

  static async enhancePrompt(originalPrompt: string, type: 'image' | 'music'): Promise<string> {
    const enhancementPrompt = type === 'image'
      ? `Enhance this image generation prompt to be more detailed and effective: "${originalPrompt}"

Make it more descriptive, add artistic style, lighting, composition, and technical details that would improve AI image generation.`
      : `Enhance this music generation prompt to be more detailed and effective: "${originalPrompt}"

Make it more specific about genre, instruments, mood, tempo, arrangement, and musical characteristics.`;

    try {
      const { text } = await generateText({
        model: openai('gpt-4'),
        prompt: enhancementPrompt,
      });

      return text.trim();
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
      return originalPrompt;
    }
  }

  static async generateVariations(basePrompt: string, count: number = 3, type: 'image' | 'music' = 'image'): Promise<string[]> {
    const variationPrompt = `Generate ${count} creative variations of this ${type} prompt: "${basePrompt}"

Each variation should be unique and explore different aspects, styles, or interpretations while maintaining the core concept. Make them detailed and ready for AI generation.`;

    try {
      const { text } = await generateText({
        model: openai('gpt-4'),
        prompt: variationPrompt,
      });

      // Split by numbered list or newlines
      const variations = text.split(/\d+\.\s*/).filter(v => v.trim().length > 0);
      return variations.slice(0, count);
    } catch (error) {
      console.error('Failed to generate variations:', error);
      return [basePrompt];
    }
  }
}