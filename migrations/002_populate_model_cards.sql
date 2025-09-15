-- Migration 002: Populate Model Cards from CSV Data
-- This populates the models table with real AI model data

-- Insert model cards based on CSV data
INSERT INTO models (id, name, provider, description, capabilities, pricing_input, pricing_output, rating, context_window, response_time, status) VALUES

-- xAI Grok Models
('grok-4', 'Grok 4', 'xAI Grok', 'Latest Grok model with advanced reasoning capabilities', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.015/1K', '$0.045/1K', 4.8, 128000, '~2-3s', 'available'),
('grok-3', 'Grok 3', 'xAI Grok', 'Powerful reasoning model with tool integration', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.012/1K', '$0.036/1K', 4.7, 128000, '~2-3s', 'available'),
('grok-3-fast', 'Grok 3 Fast', 'xAI Grok', 'Optimized for speed with maintained quality', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.010/1K', '$0.030/1K', 4.6, 128000, '~1-2s', 'available'),
('grok-3-mini', 'Grok 3 Mini', 'xAI Grok', 'Compact model for efficient processing', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.008/1K', '$0.024/1K', 4.5, 64000, '~1-2s', 'available'),
('grok-3-mini-fast', 'Grok 3 Mini Fast', 'xAI Grok', 'Ultra-fast compact model', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.006/1K', '$0.018/1K', 4.4, 64000, '~1s', 'available'),
('grok-2-1212', 'Grok 2 (Dec 12)', 'xAI Grok', 'December 2024 release with improvements', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.010/1K', '$0.030/1K', 4.5, 128000, '~2-3s', 'available'),
('grok-2-vision-1212', 'Grok 2 Vision (Dec 12)', 'xAI Grok', 'Vision-enabled model for image analysis', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.015/1K', '$0.045/1K', 4.6, 128000, '~3-4s', 'available'),
('grok-beta', 'Grok Beta', 'xAI Grok', 'Beta version with experimental features', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.008/1K', '$0.024/1K', 4.3, 128000, '~2-4s', 'available'),
('grok-vision-beta', 'Grok Vision Beta', 'xAI Grok', 'Beta vision model for image processing', '["Image Input"]', '$0.012/1K', '$0.036/1K', 4.2, 128000, '~3-5s', 'available'),

-- Vercel Models
('v0-1.0-md', 'v0 1.0 MD', 'Vercel', 'Code generation model optimized for web development', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.020/1K', '$0.060/1K', 4.4, 64000, '~2-3s', 'available'),

-- OpenAI Models
('gpt-5', 'GPT-5', 'OpenAI', 'Next-generation language model with advanced reasoning', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.050/1K', '$0.150/1K', 4.9, 256000, '~3-5s', 'available'),
('gpt-5-mini', 'GPT-5 Mini', 'OpenAI', 'Efficient version of GPT-5 for faster responses', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.025/1K', '$0.075/1K', 4.8, 128000, '~2-3s', 'available'),
('gpt-5-nano', 'GPT-5 Nano', 'OpenAI', 'Ultra-compact GPT-5 for rapid processing', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.015/1K', '$0.045/1K', 4.6, 64000, '~1-2s', 'available'),
('gpt-5-chat-latest', 'GPT-5 Chat Latest', 'OpenAI', 'Latest chat-optimized GPT-5 variant', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.040/1K', '$0.120/1K', 4.9, 256000, '~3-4s', 'available'),

-- Anthropic Models
('claude-opus-4-latest', 'Claude Opus 4 Latest', 'Anthropic', 'Most capable Claude model for complex reasoning', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.030/1K', '$0.090/1K', 4.9, 200000, '~3-5s', 'available'),
('claude-sonnet-4-latest', 'Claude Sonnet 4 Latest', 'Anthropic', 'Balanced performance and efficiency', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.020/1K', '$0.060/1K', 4.8, 200000, '~2-3s', 'available'),
('claude-3-7-sonnet-latest', 'Claude 3.7 Sonnet Latest', 'Anthropic', 'Enhanced Sonnet with improved capabilities', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.018/1K', '$0.054/1K', 4.7, 200000, '~2-3s', 'available'),
('claude-3-5-sonnet-latest', 'Claude 3.5 Sonnet Latest', 'Anthropic', 'Latest version of the popular 3.5 Sonnet', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.015/1K', '$0.045/1K', 4.8, 200000, '~2-3s', 'available'),
('claude-3-5-haiku-latest', 'Claude 3.5 Haiku Latest', 'Anthropic', 'Fast and efficient model for quick tasks', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.010/1K', '$0.030/1K', 4.6, 200000, '~1-2s', 'available'),

-- Mistral Models
('pixtral-large-latest', 'Pixtral Large Latest', 'Mistral', 'Large vision model for complex image tasks', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.025/1K', '$0.075/1K', 4.7, 128000, '~3-4s', 'available'),
('mistral-large-latest', 'Mistral Large Latest', 'Mistral', 'Most capable Mistral model for complex tasks', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.020/1K', '$0.060/1K', 4.7, 128000, '~2-3s', 'available'),
('mistral-medium-latest', 'Mistral Medium Latest', 'Mistral', 'Balanced model for general use cases', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.015/1K', '$0.045/1K', 4.6, 128000, '~2-3s', 'available'),
('mistral-medium-2505', 'Mistral Medium 25.05', 'Mistral', 'May 2025 release with improved performance', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.015/1K', '$0.045/1K', 4.6, 128000, '~2-3s', 'available'),
('mistral-small-latest', 'Mistral Small Latest', 'Mistral', 'Efficient model for quick responses', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.010/1K', '$0.030/1K', 4.5, 64000, '~1-2s', 'available'),
('pixtral-12b-2409', 'Pixtral 12B (Sep 24)', 'Mistral', '12B parameter vision model', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.012/1K', '$0.036/1K', 4.4, 64000, '~2-3s', 'available'),

-- Google Gen AI Models
('gemini-2.0-flash-exp', 'Gemini 2.0 Flash (Exp)', 'Google Gen AI', 'Experimental next-gen Gemini with enhanced speed', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.018/1K', '$0.054/1K', 4.8, 128000, '~1-2s', 'available'),
('gemini-1.5-flash-genai', 'Gemini 1.5 Flash', 'Google Gen AI', 'Fast and efficient Gemini model', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.012/1K', '$0.036/1K', 4.7, 128000, '~1-2s', 'available'),
('gemini-1.5-pro-genai', 'Gemini 1.5 Pro', 'Google Gen AI', 'Advanced Gemini for complex reasoning', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.020/1K', '$0.060/1K', 4.8, 128000, '~2-3s', 'available'),

-- Google Vertex Models
('gemini-2.0-flash-exp-vertex', 'Gemini 2.0 Flash (Exp)', 'Google Vertex', 'Experimental next-gen Gemini via Vertex AI', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.018/1K', '$0.054/1K', 4.8, 128000, '~1-2s', 'available'),
('gemini-1.5-flash-vertex', 'Gemini 1.5 Flash', 'Google Vertex', 'Fast Gemini model via Vertex AI', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.012/1K', '$0.036/1K', 4.7, 128000, '~1-2s', 'available'),
('gemini-1.5-pro-vertex', 'Gemini 1.5 Pro', 'Google Vertex', 'Advanced Gemini via Vertex AI', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.020/1K', '$0.060/1K', 4.8, 128000, '~2-3s', 'available'),

-- DeepSeek Models
('deepseek-chat', 'DeepSeek Chat', 'DeepSeek', 'Conversational AI model optimized for chat', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.008/1K', '$0.024/1K', 4.5, 128000, '~2-3s', 'available'),
('deepseek-reasoner', 'DeepSeek Reasoner', 'DeepSeek', 'Specialized reasoning model for complex problems', '[]', '$0.012/1K', '$0.036/1K', 4.6, 128000, '~3-5s', 'available'),

-- Cerebras Models
('llama3.1-8b-cerebras', 'Llama 3.1 8B', 'Cerebras', '8B parameter Llama model on Cerebras hardware', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.005/1K', '$0.015/1K', 4.3, 128000, '~1s', 'available'),
('llama3.1-70b-cerebras', 'Llama 3.1 70B', 'Cerebras', '70B parameter Llama model with high performance', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.015/1K', '$0.045/1K', 4.6, 128000, '~1-2s', 'available'),
('llama3.3-70b-cerebras', 'Llama 3.3 70B', 'Cerebras', 'Latest 70B Llama model with improvements', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.015/1K', '$0.045/1K', 4.7, 128000, '~1-2s', 'available'),

-- Groq Models
('meta-llama-scout-17b', 'Meta Llama Scout 17B', 'Groq', 'Advanced 17B parameter model with vision capabilities', '["Image Input", "Object Generation", "Tool Usage", "Tool Streaming"]', '$0.010/1K', '$0.030/1K', 4.5, 128000, '~1s', 'available'),
('llama-3.3-70b-versatile', 'Llama 3.3 70B Versatile', 'Groq', 'Versatile 70B model for diverse tasks', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.012/1K', '$0.036/1K', 4.6, 128000, '~1s', 'available'),
('llama-3.1-8b-instant', 'Llama 3.1 8B Instant', 'Groq', 'Ultra-fast 8B model for instant responses', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.004/1K', '$0.012/1K', 4.2, 128000, '~0.5s', 'available'),
('mixtral-8x7b-32768', 'Mixtral 8x7B', 'Groq', 'Mixture of experts model with 32K context', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.008/1K', '$0.024/1K', 4.4, 32768, '~1s', 'available'),
('gemma2-9b-it', 'Gemma2 9B IT', 'Groq', '9B parameter instruction-tuned model', '["Object Generation", "Tool Usage", "Tool Streaming"]', '$0.006/1K', '$0.018/1K', 4.3, 128000, '~1s', 'available');

-- Update the timestamps
UPDATE models SET updated_at = CURRENT_TIMESTAMP;