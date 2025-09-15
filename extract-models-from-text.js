const fs = require('fs');
const path = require('path');

// Read the user's model list from the query
const userModelsText = `google logo
google/gemini-2.5-pro

Gemini 2.5 Pro is our most advanced reasoning Gemini model, capable of solving complex problems. It features a 2M token context window and supports multimodal inputs including text, images, audio, video, and PDF documents.

Context 1M

Input Tokens $2.50/M

Output Tokens $10.00/M

vertex logo
Available on 1 provider

openai logo
openai/gpt-5

GPT-5 is OpenAI's flagship language model that excels at complex reasoning, broad real-world knowledge, code-intensive, and multi-step agentic tasks.

Context 400K

Input Tokens $1.25/M

Output Tokens $10.00/M

Cache Read Tokens $0.13/M

openai logo
Available on 1 provider

openai logo
openai/gpt-4.1

GPT 4.1 is OpenAI's flagship model for complex tasks. It is well suited for problem solving across domains.

Context 1M

Input Tokens $2.00/M

Output Tokens $8.00/M

Cache Read Tokens $0.50/M

azure logo
openai logo
Available on 2 providers

openai logo
openai/gpt-5-mini

GPT-5 mini is a cost optimized model that excels at reasoning/chat tasks. It offers an optimal balance between speed, cost, and capability.

Context 400K

Input Tokens $0.25/M

Output Tokens $2.00/M

Cache Read Tokens $0.03/M

openai logo
Available on 1 provider

openai logo
openai/gpt-5-nano

GPT-5 nano is a high throughput model that excels at simple instruction or classification tasks.

Context 400K

Input Tokens $0.05/M

Output Tokens $0.40/M

Cache Read Tokens $0.01/M

openai logo
Available on 1 provider

openai logo
openai/gpt-4.1-mini

GPT 4.1 mini provides a balance between intelligence, speed, and cost that makes it an attractive model for many use cases.

Context 1M

Input Tokens $0.40/M

Output Tokens $1.60/M

Cache Read Tokens $0.10/M

azure logo
openai logo
Available on 2 providers

openai logo
openai/gpt-4.1-nano

GPT-4.1 nano is the fastest, most cost-effective GPT 4.1 model.

Context 1M

Input Tokens $0.10/M

Output Tokens $0.40/M

Cache Read Tokens $0.03/M

azure logo
openai logo
Available on 2 providers

google logo
google/gemini-2.5-flash-lite

Gemini 2.5 Flash-Lite is a balanced, low-latency model with configurable thinking budgets and tool connectivity (e.g., Google Search grounding and code execution). It supports multimodal input and offers a 1M-token context window.

Context 1M

Input Tokens $0.10/M

Output Tokens $0.40/M

vertex logo
Available on 1 provider

google logo
google/gemini-2.0-flash

Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, built-in tool use, multimodal generation, and a 1M token context window.

Context 1M

Input Tokens $0.15/M

Output Tokens $0.60/M

vertex logo
Available on 1 provider

anthropic logo
anthropic/claude-sonnet-4

Claude Sonnet 4 significantly improves on Sonnet 3.7's industry-leading capabilities, excelling in coding with a state-of-the-art 72.7% on SWE-bench. The model balances performance and efficiency for internal and external use cases, with enhanced steerability for greater control over implementations. While not matching Opus 4 in most domains, it delivers an optimal mix of capability and practicality.

Context 200K

Input Tokens $3.00/M

Output Tokens $15.00/M

Cache Read Tokens $0.30/M

Cache Write Tokens $3.75/M

anthropic logo
bedrock logo
vertexAnthropic logo
Available on 3 providers

anthropic logo
anthropic/claude-3.7-sonnet

Claude 3.7 Sonnet is the first hybrid reasoning model and Anthropic's most intelligent model to date. It delivers state-of-the-art performance for coding, content generation, data analysis, and planning tasks, building upon its predecessor Claude 3.5 Sonnet's capabilities in software engineering and computer use.

Context 200K

Input Tokens $3.00/M

Output Tokens $15.00/M

Cache Read Tokens $0.30/M

Cache Write Tokens $3.75/M

anthropic logo
bedrock logo
vertexAnthropic logo
Available on 3 providers

openai logo
openai/text-embedding-3-small

OpenAI's improved, more performant version of their ada embedding model.

Input Tokens $0.02/M

azure logo
openai logo
Available on 2 providers

stealth logo
stealth/sonoma-sky-alpha

A maximally intelligent general-purpose frontier model with a 2 million token context window. Supports image inputs and parallel tool calling. Note: prompts and responses may be retained and used for training by the provider during the stealth period.

Context 2M

Input Tokens $0.00/M

Output Tokens $0.00/M

stealth logo
Available on 1 provider

deepseek logo
deepseek/deepseek-v3.1

DeepSeek-V3.1 is post-trained on the top of DeepSeek-V3.1-Base, which is built upon the original V3 base checkpoint through a two-phase long context extension approach, following the methodology outlined in the original DeepSeek-V3 report. DeepSeek has expanded their dataset by collecting additional long documents and substantially extending both training phases.

Context 164K

Input Tokens $0.20/M

Output Tokens $0.80/M

baseten logo
chutes logo
deepinfra logo
+3
Available on 6 providers

google logo
google/gemini-2.5-flash

Gemini 2.5 Flash is a thinking model that offers great, well-rounded capabilities. It is designed to offer a balance between price and performance with multimodal support and a 1M token context window.

Context 1M

Input Tokens $0.30/M

Output Tokens $2.50/M

vertex logo
Available on 1 provider

openai logo
openai/gpt-4o

GPT-4o from OpenAI has broad general knowledge and domain expertise allowing it to follow complex instructions in natural language and solve difficult problems accurately. It matches GPT-4 Turbo performance with a faster and cheaper API.

Context 128K

Input Tokens $2.50/M

Output Tokens $10.00/M

Cache Read Tokens $1.25/M

azure logo
openai logo
Available on 2 providers

openai logo
openai/gpt-4o-mini

GPT-4o mini from OpenAI is their most advanced and cost-efficient small model. It is multi-modal (accepting text or image inputs and outputting text) and has higher intelligence than gpt-3.5-turbo but is just as fast.

Context 128K

Input Tokens $0.15/M

Output Tokens $0.60/M

Cache Read Tokens $0.07/M

azure logo
openai logo
Available on 2 providers

xai logo
xai/grok-code-fast-1

xAI's latest coding model that offers fast agentic coding with a 256K context window.

Context 256K

Input Tokens $0.20/M

Output Tokens $1.50/M

xai logo
Available on 1 provider

moonshotai logo
moonshotai/kimi-k2

State of the art language model for agentic and coding tasks

Context 131K

Input Tokens $0.50/M

Output Tokens $2.00/M

baseten logo
deepinfra logo
fireworks logo
+4
Available on 7 providers

alibaba logo
alibaba/qwen3-coder

Qwen3 Coder 480B is a specialized programming model designed for ultra-efficient agentic code generation with long context and state-of-the-art performance. It excels at writing, debugging, and explaining code across multiple programming languages.

Context 131K

Input Tokens $0.40/M

Output Tokens $1.60/M

baseten logo
cerebras logo
deepinfra logo
+2
Available on 5 providers

xai logo
xai/grok-4

xAI's latest and greatest flagship model, offering unparalleled performance in natural language, math and reasoning - the perfect jack of all trades.

Context 256K

Input Tokens $3.00/M

Output Tokens $15.00/M

xai logo
Available on 1 provider

perplexity logo
perplexity/sonar

Perplexity's lightweight offering with search grounding, quicker and cheaper than Sonar Pro.

Context 127K

Input Tokens $1.00/M

Output Tokens $1.00/M

perplexity logo
Available on 1 provider

mistral logo
mistral/codestral-embed

Code embedding model that can embed code databases and repositories to power coding assistants.

Input Tokens $0.15/M

mistral logo
Available on 1 provider

openai logo
openai/gpt-oss-120b

Extremely capable general-purpose LLM with strong, controllable reasoning capabilities

Context 131K

Input Tokens $0.10/M

Output Tokens $0.50/M

baseten logo
cerebras logo
fireworks logo
+2
Available on 5 providers

moonshotai logo
moonshotai/kimi-k2-0905

Kimi K2 0905 has shown strong performance on agentic tasks thanks to its tool calling, reasoning abilities, and long context handling. But as a large parameter model (1T parameters), it's also resource-intensive. Running it in production requires a highly optimized inference stack to avoid excessive latency.

Context 131K

Input Tokens $0.60/M

Output Tokens $2.50/M

baseten logo
fireworks logo
groq logo
+1
Available on 4 providers

openai logo
openai/gpt-oss-20b

A compact, open-weight language model optimized for low-latency and resource-constrained environments, including local and edge deployments

Context 128K

Input Tokens $0.07/M

Output Tokens $0.30/M

fireworks logo
groq logo
Available on 2 providers

zai logo
zai/glm-4.5

GLM-4.5 and GLM-4.5-Air are our latest flagship models, purpose-built as foundational models for agent-oriented applications. Both leverage a Mixture-of-Experts (MoE) architecture. GLM-4.5 has a total parameter count of 355B with 32B active parameters per forward pass, while GLM-4.5-Air adopts a more streamlined design with 106B total parameters and 12B active parameters.

Context 128K

Input Tokens $0.60/M

Output Tokens $2.20/M

novita logo
zai logo
Available on 2 providers

xai logo
xai/grok-3-fast

xAI's flagship model that excels at enterprise use cases like data extraction, coding, and text summarization. Possesses deep domain knowledge in finance, healthcare, law, and science. The fast model variant is served on faster infrastructure, offering response times that are significantly faster than the standard. The increased speed comes at a higher cost per output token.

Context 131K

Input Tokens $5.00/M

Output Tokens $25.00/M

xai logo
Available on 1 provider

openai logo
openai/text-embedding-3-large

OpenAI's most capable embedding model for both english and non-english tasks.

Input Tokens $0.13/M

azure logo
openai logo
Available on 2 providers

google logo
google/gemini-2.5-flash-image-preview

Image Generation
Gemini 2.5 Flash Image Preview is our first fully hybrid reasoning model, letting developers turn thinking on or off and set thinking budgets to balance quality, cost, and latency. Upgraded for rapid creative workflows, it can generate interleaved text and images and supports conversational, multi‑turn image editing in natural language. It's also locale‑aware, enabling culturally and linguistically appropriate image generation for audiences worldwide.

Context 1M

Input Tokens $0.30/M

Output Tokens $2.50/M

google logo
Available on 1 provider

google logo
google/text-embedding-005

English-focused text embedding model optimized for code and English language tasks.

Input Tokens $0.03/M

vertex logo
Available on 1 provider

google logo
google/gemini-embedding-001

State-of-the-art embedding model with excellent performance across English, multilingual and code tasks.

Input Tokens $0.15/M

google logo
vertex logo
Available on 2 providers

anthropic logo
anthropic/claude-opus-4.1

Claude Opus 4.1 is a drop-in replacement for Opus 4 that delivers superior performance and precision for real-world coding and agentic tasks. Opus 4.1 advances state-of-the-art coding performance to 74.5% on SWE-bench Verified, and handles complex, multi-step problems with more rigor and attention to detail.

Context 200K

Input Tokens $15.00/M

Output Tokens $75.00/M

Cache Read Tokens $1.50/M

Cache Write Tokens $18.75/M

anthropic logo
bedrock logo
vertexAnthropic logo
Available on 3 providers

xai logo
xai/grok-3-mini

xAI's lightweight model that thinks before responding. Great for simple or logic-based tasks that do not require deep domain knowledge. The raw thinking traces are accessible.

Context 131K

Input Tokens $0.30/M

Output Tokens $0.50/M

xai logo
Available on 1 provider

vercel logo
vercel/v0-1.5-md

Access the model behind v0 to generate, fix, and optimize modern web apps with framework-specific reasoning and up-to-date knowledge.

Context 128K

Input Tokens $3.00/M

Output Tokens $15.00/M

vercel logo
Available on 1 provider

meta logo
meta/llama-4-scout

The Llama-4-Scout-17B-16E-Instruct model is a state-of-the-art, instruction-tuned, multimodal AI model developed by Meta as part of the Llama 4 family. It is designed to handle both text and image inputs, making it suitable for a wide range of applications, including conversational AI, code generation, and visual reasoning.

Context 128K

Input Tokens $0.08/M

Output Tokens $0.30/M

baseten logo
bedrock logo
cerebras logo
+3
Available on 6 providers

stealth logo
stealth/sonoma-dusk-alpha

A fast and intelligent general-purpose frontier model with a 2 million token context window. Supports image inputs and parallel tool calling. Note: prompts and responses may be retained and used for training by the provider during the stealth period.

Context 2M

Input Tokens $0.00/M

Output Tokens $0.00/M

stealth logo
Available on 1 provider

xai logo
xai/grok-2-vision

Grok 2 vision model excels in vision-based tasks, delivering state-of-the-art performance in visual math reasoning (MathVista) and document-based question answering (DocVQA). It can process a wide variety of visual information including documents, diagrams, charts, screenshots, and photographs.

Context 33K

Input Tokens $2.00/M

Output Tokens $10.00/M

xai logo
Available on 1 provider

anthropic logo
anthropic/claude-3.5-haiku

Claude 3.5 Haiku is the next generation of our fastest model. For a similar speed to Claude 3 Haiku, Claude 3.5 Haiku improves across every skill set and surpasses Claude 3 Opus, the largest model in our previous generation, on many intelligence benchmarks.

Context 200K

Input Tokens $0.80/M

Output Tokens $4.00/M

Cache Read Tokens $0.08/M

Cache Write Tokens $1.00/M

anthropic logo
bedrock logo
vertexAnthropic logo
Available on 3 providers

anthropic logo
anthropic/claude-3.5-sonnet

Claude 3.5 Sonnet strikes the ideal balance between intelligence and speed—particularly for enterprise workloads. It delivers strong performance at a lower cost compared to its peers, and is engineered for high endurance in large-scale AI deployments.

Context 200K

Input Tokens $3.00/M

Output Tokens $15.00/M

Cache Read Tokens $0.30/M

Cache Write Tokens $3.75/M

anthropic logo
bedrock logo
vertexAnthropic logo
Available on 3 providers

deepseek logo
deepseek/deepseek-v3

Fast general-purpose LLM with enhanced reasoning capabilities

Context 164K

Input Tokens $0.77/M

Output Tokens $0.77/M

baseten logo
fireworks logo
novita logo
+1
Available on 4 providers

openai logo
openai/o3-mini

o3-mini is OpenAI's most recent small reasoning model, providing high intelligence at the same cost and latency targets of o1-mini.

Context 200K

Input Tokens $1.10/M

Output Tokens $4.40/M

Cache Read Tokens $0.55/M

azure logo
openai logo
Available on 2 providers

meta logo
meta/llama-4-maverick

High-efficiency language processing

Context 1M

Input Tokens $0.15/M

Output Tokens $0.60/M

baseten logo
bedrock logo
deepinfra logo
+1
Available on 4 providers

google logo
google/gemini-2.0-flash-lite

Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, built-in tool use, multimodal generation, and a 1M token context window.

Context 1M

Input Tokens $0.07/M

Output Tokens $0.30/M

vertex logo
Available on 1 provider

deepseek logo
deepseek/deepseek-r1

DeepSeek Reasoner is a specialized model developed by DeepSeek that uses Chain of Thought (CoT) reasoning to improve response accuracy. Before providing a final answer, it generates detailed reasoning steps that are accessible through the API, allowing users to examine and leverage the model's thought process, served by Fireworks AI.

Context 160K

Input Tokens $0.79/M

Output Tokens $4.00/M

bedrock logo
fireworks logo
parasail logo
Available on 3 providers

perplexity logo
perplexity/sonar-pro

Perplexity's premier offering with search grounding, supporting advanced queries and follow-ups.

Context 200K

Input Tokens $3.00/M

Output Tokens $15.00/M

perplexity logo
Available on 1 provider

openai logo
openai/o3

OpenAI's o3 is their most powerful reasoning model, setting new state-of-the-art benchmarks in coding, math, science, and visual perception. It excels at complex queries requiring multi-faceted analysis, with particular strength in analyzing images, charts, and graphics.

Context 200K

Input Tokens $2.00/M

Output Tokens $8.00/M

Cache Read Tokens $0.50/M

openai logo
Available on 1 provider

zai logo
zai/glm-4.5-air

GLM-4.5 and GLM-4.5-Air are our latest flagship models, purpose-built as foundational models for agent-oriented applications. Both leverage a Mixture-of-Experts (MoE) architecture. GLM-4.5 has a total parameter count of 355B with 32B active parameters per forward pass, while GLM-4.5-Air adopts a more streamlined design with 106B total parameters and 12B active parameters.

Context 128K

Input Tokens $0.20/M

Output Tokens $1.10/M

zai logo
Available on 1 provider

meta logo
meta/llama-3.3-70b

The upgraded Llama 3.1 70B model features enhanced reasoning, tool use, and multilingual abilities, along with a significantly expanded 128K context window. These improvements make it well-suited for demanding tasks such as long-form summarization, multilingual conversations, and coding assistance.

Context 128K

Input Tokens $0.72/M

Output Tokens $0.72/M

bedrock logo
cerebras logo
groq logo
Available on 3 providers

meta logo
meta/llama-3.1-8b

Llama 3.1 8B brings powerful performance in a smaller, more efficient package. With improved multilingual support, tool use, and a 128K context length, it enables sophisticated use cases like interactive agents and compact coding assistants while remaining lightweight and accessible.

Context 128K

Input Tokens $0.05/M

Output Tokens $0.08/M

bedrock logo
cerebras logo
groq logo
Available on 3 providers

alibaba logo
alibaba/qwen3-max

Qwen3-Max improves instruction following, multilingual ability, and tool use; reduced hallucinations.

Context 262K

Input Tokens $1.20/M

Output Tokens $6.00/M

Cache Read Tokens $0.24/M

alibaba logo
Available on 1 provider

openai logo
openai/gpt-4-turbo

gpt-4-turbo from OpenAI has broad general knowledge and domain expertise allowing it to follow complex instructions in natural language and solve difficult problems accurately. It has a knowledge cutoff of April 2023 and a 128,000 token context window.

Context 128K

Input Tokens $10.00/M

Output Tokens $30.00/M

openai logo
Available on 1 provider

alibaba logo
alibaba/qwen-3-235b

Mixture-of-experts LLM with math and reasoning capabilities

Context 262K

Input Tokens $0.13/M

Output Tokens $0.60/M

baseten logo
deepinfra logo
fireworks logo
+1
Available on 4 providers

mistral logo
mistral/pixtral-12b

A 12B model with image understanding capabilities in addition to text.

Context 128K

Input Tokens $0.15/M

Output Tokens $0.15/M

mistral logo
Available on 1 provider

mistral logo
mistral/codestral

Mistral Codestral 25.01 is a state-of-the-art coding model optimized for low-latency, high-frequency use cases. Proficient in over 80 programming languages, it excels at tasks like fill-in-the-middle (FIM), code correction, and test generation.

Context 256K

Input Tokens $0.30/M

Output Tokens $0.90/M

mistral logo
Available on 1 provider

anthropic logo
anthropic/claude-opus-4

Claude Opus 4 is Anthropic's most powerful model yet and the best coding model in the world, leading on SWE-bench (72.5%) and Terminal-bench (43.2%). It delivers sustained performance on long-running tasks that require focused effort and thousands of steps, with the ability to work continuously for several hours—dramatically outperforming all Sonnet models and significantly expanding what AI agents can accomplish.

Context 200K

Input Tokens $15.00/M

Output Tokens $75.00/M

Cache Read Tokens $1.50/M

Cache Write Tokens $18.75/M

anthropic logo
bedrock logo
vertexAnthropic logo
Available on 3 providers

xai logo
xai/grok-2

Grok 2 is a frontier language model with state-of-the-art reasoning capabilities. It features advanced capabilities in chat, coding, and reasoning, outperforming both Claude 3.5 Sonnet and GPT-4-Turbo on the LMSYS leaderboard.

Context 131K

Input Tokens $2.00/M

Output Tokens $10.00/M

xai logo
Available on 1 provider

xai logo
xai/grok-3-mini-fast

xAI's lightweight model that thinks before responding. Great for simple or logic-based tasks that do not require deep domain knowledge. The raw thinking traces are accessible. The fast model variant is served on faster infrastructure, offering response times that are significantly faster than the standard. The increased speed comes at a higher cost per output token.

Context 131K

Input Tokens $0.60/M

Output Tokens $4.00/M

xai logo
Available on 1 provider

mistral logo
mistral/mistral-large

Mistral Large is ideal for complex tasks that require large reasoning capabilities or are highly specialized - like Synthetic Text Generation, Code Generation, RAG, or Agents.

Context 32K

Input Tokens $2.00/M

Output Tokens $6.00/M

mistral logo
Available on 1 provider

openai logo
openai/gpt-3.5-turbo

OpenAI's most capable and cost effective model in the GPT-3.5 family optimized for chat purposes, but also works well for traditional completions tasks.

Context 16K

Input Tokens $0.50/M

Output Tokens $1.50/M

openai logo
Available on 1 provider

deepseek logo
deepseek/deepseek-v3.1-base

DeepSeek V3.1 Base is an improved version of the DeepSeek V3 model.

Context 128K

Input Tokens $0.20/M

Output Tokens $0.80/M

chutes logo
Available on 1 provider

alibaba logo
alibaba/qwen3-next-80b-a3b-instruct

A new generation of open-source, non-thinking mode model powered by Qwen3. This version demonstrates superior Chinese text understanding, augmented logical reasoning, and enhanced capabilities in text generation tasks over the previous iteration (Qwen3-235B-A22B-Instruct-2507).

Context 131K

Input Tokens $0.15/M

Output Tokens $1.50/M

alibaba logo
novita logo
Available on 2 providers

openai logo
openai/o4-mini

OpenAI's o4-mini delivers fast, cost-efficient reasoning with exceptional performance for its size, particularly excelling in math (best-performing on AIME benchmarks), coding, and visual tasks.

Context 200K

Input Tokens $1.10/M

Output Tokens $4.40/M

Cache Read Tokens $0.28/M

azure logo
openai logo
Available on 2 providers

anthropic logo
anthropic/claude-3-haiku

Claude 3 Haiku is Anthropic's fastest model yet, designed for enterprise workloads which often involve longer prompts. Haiku to quickly analyze large volumes of documents, such as quarterly filings, contracts, or legal cases, for half the cost of other models in its performance tier.

Context 200K

Input Tokens $0.25/M

Output Tokens $1.25/M

Cache Read Tokens $0.03/M

Cache Write Tokens $0.30/M

anthropic logo
bedrock logo
vertexAnthropic logo
Available on 3 providers

morph logo
morph/morph-v3-fast

Morph offers a specialized AI model that applies code changes suggested by frontier models (like Claude or GPT-4o) to your existing code files FAST - 4500+ tokens/second. It acts as the final step in the AI coding workflow. Supports 16k input tokens and 16k output tokens.

Context 82K

Input Tokens $0.80/M

Output Tokens $1.20/M

morph logo
Available on 1 provider

mistral logo
mistral/mistral-small

Mistral Small is the ideal choice for simple tasks that one can do in bulk - like Classification, Customer Support, or Text Generation. It offers excellent performance at an affordable price point.

Context 32K

Input Tokens $0.10/M

Output Tokens $0.30/M

mistral logo
Available on 1 provider

anthropic logo
anthropic/claude-3-opus

Claude 3 Opus is Anthropic's most intelligent model, with best-in-market performance on highly complex tasks. It can navigate open-ended prompts and sight-unseen scenarios with remarkable fluency and human-like understanding. Opus shows us the outer limits of what's possible with generative AI.

Context 200K

Input Tokens $15.00/M

Output Tokens $75.00/M

Cache Read Tokens $1.50/M

Cache Write Tokens $18.75/M

anthropic logo
bedrock logo
vertexAnthropic logo
Available on 3 providers

alibaba logo
alibaba/qwen-3-32b

Qwen3-32B is a world-class model with comparable quality to DeepSeek R1 while outperforming GPT-4.1 and Claude Sonnet 3.7. It excels in code-gen, tool-calling, and advanced reasoning, making it an exceptional model for a wide range of production use cases.

Context 128K

Input Tokens $0.10/M

Output Tokens $0.30/M

cerebras logo
deepinfra logo
groq logo
+1
Available on 4 providers

alibaba logo
alibaba/qwen-3-14b

Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense and mixture-of-experts (MoE) models. Built upon extensive training, Qwen3 delivers groundbreaking advancements in reasoning, instruction-following, agent capabilities, and multilingual support

Context 41K

Input Tokens $0.06/M

Output Tokens $0.24/M

deepinfra logo
Available on 1 provider

vercel logo
vercel/v0-1.0-md

Access the model behind v0 to generate, fix, and optimize modern web apps with framework-specific reasoning and up-to-date knowledge.

Context 128K

Input Tokens $3.00/M

Output Tokens $15.00/M

vercel logo
Available on 1 provider

alibaba logo
alibaba/qwen-3-30b

Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense and mixture-of-experts (MoE) models. Built upon extensive training, Qwen3 delivers groundbreaking advancements in reasoning, instruction-following, agent capabilities, and multilingual support

Context 41K

Input Tokens $0.08/M

Output Tokens $0.29/M

deepinfra logo
Available on 1 provider

mistral logo
mistral/magistral-small

Complex thinking, backed by deep understanding, with transparent reasoning you can follow and verify. The model excels in maintaining high-fidelity reasoning across numerous languages, even when switching between languages mid-task.

Context 128K

Input Tokens $0.50/M

Output Tokens $1.50/M

mistral logo
Available on 1 provider

cohere logo
cohere/command-r-plus

Command R+ is Cohere's newest large language model, optimized for conversational interaction and long-context tasks. It aims at being extremely performant, enabling companies to move beyond proof of concept and into production.

Context 128K

Input Tokens $2.50/M

Output Tokens $10.00/M

cohere logo
Available on 1 provider

google logo
google/text-multilingual-embedding-002

Multilingual text embedding model optimized for cross-lingual tasks across many languages.

Input Tokens $0.03/M

vertex logo
Available on 1 provider

xai logo
xai/grok-3

xAI's flagship model that excels at enterprise use cases like data extraction, coding, and text summarization. Possesses deep domain knowledge in finance, healthcare, law, and science.

Context 131K

Input Tokens $3.00/M

Output Tokens $15.00/M

xai logo
Available on 1 provider

mistral logo
mistral/devstral-small

Devstral is an agentic LLM for software engineering tasks built under a collaboration between Mistral AI and All Hands AI 🙌. Devstral excels at using tools to explore codebases, editing multiple files and power software engineering agents.

Context 128K

Input Tokens $0.10/M

Output Tokens $0.30/M

mistral logo
Available on 1 provider

mistral logo
mistral/ministral-3b

A compact, efficient model for on-device tasks like smart assistants and local analytics, offering low-latency performance.

Context 128K

Input Tokens $0.04/M

Output Tokens $0.04/M

mistral logo
Available on 1 provider

cohere logo
cohere/command-a

Command A is Cohere's most performant model to date, excelling at tool use, agents, retrieval augmented generation (RAG), and multilingual use cases. Command A has a context length of 256K, only requires two GPUs to run, and has 150% higher throughput compared to Command R+ 08-2024.

Context 256K

Input Tokens $2.50/M

Output Tokens $10.00/M

cohere logo
Available on 1 provider

meituan logo
meituan/longcat-flash-chat

LongCat-Flash-Chat is a high-throughput MoE chat model (128k context) optimized for agentic tasks.

Context 128K

Input Tokens $0.00/M

Output Tokens $0.00/M

meituan logo
Available on 1 provider

moonshotai logo
moonshotai/kimi-k2-turbo

Kimi K2 Turbo is the high-speed version of kimi-k2, with the same model parameters as kimi-k2, but the output speed is increased to 60 tokens per second, with a maximum of 100 tokens per second, the context length is 256k

Context 256K

Input Tokens $2.40/M

Output Tokens $10.00/M

moonshotai logo
Available on 1 provider

mistral logo
mistral/mixtral-8x22b-instruct

8x22b Instruct model. 8x22b is mixture-of-experts open source model by Mistral served by Fireworks.

Context 66K

Input Tokens $1.20/M

Output Tokens $1.20/M

fireworks logo
Available on 1 provider

zai logo
zai/glm-4.5v

Built on the GLM-4.5-Air base model, GLM-4.5V inherits proven techniques from GLM-4.1V-Thinking while achieving effective scaling through a powerful 106B-parameter MoE architecture.

Context 66K

Input Tokens $0.60/M

Output Tokens $1.80/M

novita logo
zai logo
Available on 2 providers

amazon logo
amazon/nova-lite

A very low cost multimodal model that is lightning fast for processing image, video, and text inputs.

Context 300K

Input Tokens $0.06/M

Output Tokens $0.24/M

bedrock logo
Available on 1 provider

alibaba logo
alibaba/qwen-3-235b

Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense and mixture-of-experts (MoE) models. Built upon extensive training, Qwen3 delivers groundbreaking advancements in reasoning, instruction-following, agent capabilities, and multilingual support

Context 41K

Input Tokens $0.13/M

Output Tokens $0.60/M

baseten logo
deepinfra logo
fireworks logo
+1
Available on 4 providers

mistral logo
mistral/magistral-medium

Complex thinking, backed by deep understanding, with transparent reasoning you can follow and verify. The model excels in maintaining high-fidelity reasoning across numerous languages, even when switching between languages mid-task.

Context 128K

Input Tokens $2.00/M

Output Tokens $5.00/M

mistral logo
Available on 1 provider

deepseek logo
deepseek/deepseek-r1-distill-llama-70b

DeepSeek-R1 is a state-of-the-art reasoning model trained with reinforcement learning and cold-start data, delivering strong performance across math, code, and complex reasoning tasks. It offers improved stability, readability, and multilingual handling compared to earlier versions, and is available alongside several high-quality distilled variants.

Context 128K

Input Tokens $0.75/M

Output Tokens $0.99/M

cerebras logo
groq logo
Available on 2 providers

openai logo
openai/o1

o1 is OpenAI's flagship reasoning model, designed for complex problems that require deep thinking. It provides strong reasoning capabilities with improved accuracy for complex multi-step tasks.

Context 200K

Input Tokens $15.00/M

Output Tokens $60.00/M

Cache Read Tokens $7.50/M

azure logo
openai logo
Available on 2 providers

meta logo
meta/llama-3.1-70b

An update to Meta Llama 3 70B Instruct that includes an expanded 128K context length, multilinguality and improved reasoning capabilities.

Context 128K

Input Tokens $0.72/M

Output Tokens $0.72/M

bedrock logo
Available on 1 provider

morph logo
morph/morph-v3-large

Morph offers a specialized AI model that applies code changes suggested by frontier models (like Claude or GPT-4o) to your existing code files FAST - 2500+ tokens/second. It acts as the final step in the AI coding workflow. Supports 16k input tokens and 16k output tokens.

Context 82K

Input Tokens $0.90/M

Output Tokens $1.90/M

morph logo
Available on 1 provider

google logo
google/gemma-2-9b

9 billion parameter open source model by Google fine-tuned for chat purposes. Served by Groq with their custom Language Processing Units (LPUs) hardware to provide fast and efficient inference.

Context 8K

Input Tokens $0.20/M

Output Tokens $0.20/M

groq logo
Available on 1 provider

meta logo
meta/llama-3.2-1b

Text-only model, supporting on-device use cases such as multilingual local knowledge retrieval, summarization, and rewriting.

Context 128K

Input Tokens $0.10/M

Output Tokens $0.10/M

bedrock logo
Available on 1 provider

meta logo
meta/llama-3.2-90b

Instruction-tuned image reasoning generative model (text + images in / text out) optimized for visual recognition, image reasoning, captioning and answering general questions about the image.

Context 128K

Input Tokens $0.72/M

Output Tokens $0.72/M

bedrock logo
Available on 1 provider

meta logo
meta/llama-3.2-11b

Instruction-tuned image reasoning generative model (text + images in / text out) optimized for visual recognition, image reasoning, captioning and answering general questions about the image.

Context 128K

Input Tokens $0.16/M

Output Tokens $0.16/M

bedrock logo
Available on 1 provider

meta logo
meta/llama-3.2-3b

Text-only model, fine-tuned for supporting on-device use cases such as multilingual local knowledge retrieval, summarization, and rewriting.

Context 128K

Input Tokens $0.15/M

Output Tokens $0.15/M

bedrock logo
Available on 1 provider

mistral logo
mistral/pixtral-large

Pixtral Large is the second model in our multimodal family and demonstrates frontier-level image understanding. Particularly, the model is able to understand documents, charts and natural images, while maintaining the leading text-only understanding of Mistral Large 2.

Context 128K

Input Tokens $2.00/M

Output Tokens $6.00/M

mistral logo
Available on 1 provider

mistral logo
mistral/mistral-medium

Mistral Medium 3 delivers frontier performance while being an order of magnitude less expensive. For instance, the model performs at or above 90% of Claude Sonnet 3.7 on benchmarks across the board at a significantly lower cost.

Context 128K

Input Tokens $0.40/M

Output Tokens $2.00/M

mistral logo
Available on 1 provider

inception logo
inception/mercury-coder-small

Mercury Coder Small is ideal for code generation, debugging, and refactoring tasks with minimal latency.

Context 32K

Input Tokens $0.25/M

Output Tokens $1.00/M

inception logo
Available on 1 provider

cohere logo
cohere/embed-v4.0

A model that allows for text, images, or mixed content to be classified or turned into embeddings.

Input Tokens $0.12/M

cohere logo
Available on 1 provider

mistral logo
mistral/mistral-embed

General-purpose text embedding model for semantic search, similarity, clustering, and RAG workflows.

Input Tokens $0.10/M

mistral logo
Available on 1 provider

openai logo
openai/text-embedding-ada-002

OpenAI's legacy text embedding model.

Input Tokens $0.10/M

azure logo
openai logo
Available on 2 providers

meta logo
meta/llama-3-8b

Llama is a 8 billion parameter open source model by Meta fine-tuned for instruction following purposes. Served by Groq with their custom Language Processing Units (LPUs) hardware to provide fast and efficient inference.

Context 8K

Input Tokens $0.05/M

Output Tokens $0.08/M

groq logo
Available on 1 provider

deepseek logo
deepseek/deepseek-v3.1-thinking

DeepSeek-V3.1 marks DeepSeek's first step toward the agent era with revolutionary hybrid inference capabilities. Operates in two modes: Think and Non-Think. The Think variant delivers faster reasoning compared to DeepSeek-R1-0528, reaching answers more efficiently while maintaining high-quality outputs. Enhanced through specialized post-training, the model excels at tool usage and complex multi-step agent tasks.

Context 128K

Input Tokens $0.56/M

Output Tokens $1.68/M

Cache Read Tokens $0.07/M

deepseek logo
Available on 1 provider

meta logo
meta/llama-3-70b

Llama is a 70 billion parameter open source model by Meta fine-tuned for instruction following purposes. Served by Groq with their custom Language Processing Units (LPUs) hardware to provide fast and efficient inference.

Context 8K

Input Tokens $0.59/M

Output Tokens $0.79/M

groq logo
Available on 1 provider

voyage logo
voyage/voyage-3.5

Voyage AI's embedding model optimized for general-purpose and multilingual retrieval quality.

Input Tokens $0.06/M

voyage logo
Available on 1 provider

openai logo
openai/gpt-3.5-turbo-instruct

Similar capabilities as GPT-3 era models. Compatible with legacy Completions endpoint and not Chat Completions.

Context 16K

Input Tokens $0.50/M

Output Tokens $1.50/M

openai logo
Available on 1 provider

amazon logo
amazon/titan-embed-text-v2

Amazon Titan Text Embeddings V2 is a light weight, efficient multilingual embedding model supporting 1024, 512, and 256 dimensions.

Input Tokens $0.02/M

bedrock logo
Available on 1 provider

voyage logo
voyage/voyage-3-large

Voyage AI's embedding model with the best general-purpose and multilingual retrieval quality.

Input Tokens $0.18/M

voyage logo
Available on 1 provider

voyage logo
voyage/voyage-3.5-lite

Voyage AI's embedding model optimized for latency and cost.

Input Tokens $0.02/M

voyage logo
Available on 1 provider

voyage logo
voyage/voyage-code-2

Voyage AI's embedding model optimized for code retrieval (17% better than alternatives). This is the previous generation of code embeddings models.

Input Tokens $0.12/M

voyage logo
Available on 1 provider

voyage logo
voyage/voyage-code-3

Voyage AI's embedding model optimized for code retrieval.

Input Tokens $0.18/M

voyage logo
Available on 1 provider

voyage logo
voyage/voyage-finance-2

Voyage AI's embedding model optimized for finance retrieval and RAG.

Input Tokens $0.12/M

voyage logo
Available on 1 provider

voyage logo
voyage/voyage-law-2

Voyage AI's embedding model optimized for legal retrieval and RAG.

Input Tokens $0.12/M

voyage logo
Available on 1 provider`;

// Extract model IDs using regex
const modelIdRegex = /([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/g;
const matches = userModelsText.match(modelIdRegex);

if (!matches) {
  console.log('No model IDs found in the text');
  process.exit(1);
}

// Remove duplicates and filter for valid model IDs
const allModelIds = [...new Set(matches)].filter(id => {
  // Basic validation: should contain a slash and not be a URL
  return id.includes('/') && !id.includes('http') && !id.includes('www');
});

console.log(`Found ${allModelIds.length} unique model IDs from the user's text`);

// Read our current official models
const officialModelsPath = path.join(__dirname, 'official-models.txt');
const currentOfficialModels = fs.readFileSync(officialModelsPath, 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

console.log(`Current official models: ${currentOfficialModels.length}`);

// Find new models not in our current list
const newModels = allModelIds.filter(id => !currentOfficialModels.includes(id));
console.log(`New models to add: ${newModels.length}`);
newModels.forEach(model => console.log(model));

// If there are new models, update our official list
if (newModels.length > 0) {
  const updatedModels = [...currentOfficialModels, ...newModels].sort();
  fs.writeFileSync(officialModelsPath, updatedModels.join('\n'));
  console.log(`Updated official-models.txt with ${newModels.length} new models`);
} else {
  console.log('No new models to add');
}