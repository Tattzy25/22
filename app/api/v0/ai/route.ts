import { NextRequest } from 'next/server'
import { streamText, generateText } from 'ai'
import { createGateway } from '@ai-sdk/gateway'
import { HUB_MODELS, resolveModelId } from '@/lib/ai-hub-models'

// We route everything through Vercel AI Gateway. The SDK providers accept a baseURL + apiKey.
const AI_GATEWAY_BASE_URL = 'https://gateway.ai.vercel.com/v1'
const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY

const gateway = createGateway({
  baseURL: AI_GATEWAY_BASE_URL,
  apiKey: AI_GATEWAY_API_KEY,
})

// Minimal provider factory that always uses the gateway; the model string determines the target.
// For generic usage with `streamText({ model: 'provider/model', ... })` we can directly pass the id string.

export const runtime = 'nodejs'

export async function GET() {
  return Response.json({
    hub: 'central-ai-hub',
    count: HUB_MODELS.length,
    models: HUB_MODELS,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Accept either a simple prompt or full messages array
  const { prompt, messages, model, provider, temperature = 0.7, stream = true } = body || {}

    if (!model && !provider) {
      return Response.json({ error: 'model or provider+model is required' }, { status: 400 })
    }

    const resolved = resolveModelId({ model, provider })
    if (!resolved) {
      return Response.json({ error: 'Unknown or ambiguous model. Provide a fully qualified id like "openai/gpt-5".' }, { status: 400 })
    }

    if (!AI_GATEWAY_API_KEY) {
      return Response.json({ error: 'AI Gateway key not configured. Set AI_GATEWAY_API_KEY.' }, { status: 500 })
    }

    const modelRef = gateway.languageModel(resolved)

    if (stream) {
      const result = await streamText({
        model: modelRef,
        prompt,
        messages,
        temperature,
      })
      // Return a text/event-stream for streaming
      return result.toTextStreamResponse()
    }

    const { text } = await generateText({
      model: modelRef,
      prompt,
      messages,
      temperature,
    })
    return Response.json({ ok: true, model: resolved, text })
  } catch (err: unknown) {
    console.error('AI hub error:', err)
    return Response.json({ error: 'Failed to process AI request' }, { status: 500 })
  }
}
