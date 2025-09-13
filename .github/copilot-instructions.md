# 🚨 CRITICAL REQUIREMENTS - READ BEFORE ANY CODE CHANGES 🚨

**⚠️ REQUIRED**: Read `.github/critical-requirements.md` BEFORE making ANY code changes. This file contains mandatory rules that MUST be followed.

---

# AI Development Instructions for All Coding Agents

## Project Overview
- **Single Page Application (SPA)**: One page where sidebar/header never changes, content changes dynamically
- This is a Next.js 13+ app using the `/app` directory structure, bootstrapped with `create-next-app`.
- The codebase is TypeScript-first, with React Server Components and Client Components.
- UI components are organized under `components/` and `components/ui/`.
- Global styles and theme variables are managed in `app/globals.css` using Tailwind CSS and custom properties.

## Key Directories & Files
- `app/`: Main app routes, layouts, and pages. Example: `app/page.tsx`, `app/dashboard/page.tsx`.
- `components/`: Shared React components. Subfolder `ui/` contains atomic UI elements (e.g., `button.tsx`, `input.tsx`).
- `hooks/`: Custom React hooks (e.g., `use-mobile.ts`).
- `lib/`: Utility functions (e.g., `utils.ts`).
- `public/`: Static assets (SVGs, favicon).
- `globals.css`: Tailwind CSS setup, custom theme variables, and dark mode support.
- `package.json`: Scripts, dependencies, and project metadata.
- **📋 Complete File Structure**: See `.github/ai-development-guide.md` for detailed modular structure with hash routing.

## Developer Workflows
- **Start Dev Server:** `pnpm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`).
- **Build:** `pnpm run build`.
- **Lint:** `pnpm run lint` (uses ESLint config in `eslint.config.mjs`).
- **Type Check:** `npm run type-check` (if defined in `package.json`).
- **Format:** Use Prettier if configured.

## Project-Specific Patterns
- **Styling:** Uses Tailwind CSS via `@import` in `globals.css`. Custom theme variables are defined with CSS custom properties and the `@theme inline` block.
- **Dark Mode:** Managed via the `.dark` class and custom variant in `globals.css`.
- **Component Structure:** Prefer functional components. UI primitives live in `components/ui/`, higher-level components in `components/`.
- **TypeScript:** All logic and components should be typed. Use `tsconfig.json` for project-wide settings.
- **Routing:** Follows Next.js `/app` directory conventions with hash-based routing for SPA navigation and sharing.
- **📖 Detailed Patterns**: See `.github/ai-development-guide.md` for complete implementation patterns and examples.

## Integration Points
- **Fonts:** Uses `next/font` for Geist font optimization and Google Fonts support
- **AI Integration:** Vercel AI Gateway with multi-provider fallback (OpenAI, Anthropic, Google)
- **External:** Designed for deployment on Vercel; see README for details

## Current Setup Status
- **✅ AI SDK Installed**: `ai@5.0.42` with providers for OpenAI, Anthropic, Google
- **✅ Environment Ready**: Support for `.env.local` with API keys
- **✅ Multi-Provider**: Automatic fallback between AI providers
- **✅ Google Fonts**: Ready for custom typography when needed

## 🎯 BRIDGIT-AI PROJECT CONTEXT
**This is Bridgit-AI (bridgit-ai.com)** - A comprehensive AI platform with advanced features. See `.cursorrules` for the complete project vision, exclusive requirements, and development standards.

**📋 Related Files:**
- `.cursorrules` - **BRIDGIT-AI EXCLUSIVE RULES** - Complete project requirements and vision
- `.github/ai-development-guide.md` - Detailed implementation patterns and architecture

## Examples
- To add a new page: create a folder under `app/` (e.g., `app/about/`) and add `page.tsx`.
- To add a new UI element: add a file to `components/ui/` and export a functional component.
- To update global styles: edit `app/globals.css` and use Tailwind or custom properties.

## Conventions
- Use atomic UI components for consistency.
- Prefer CSS custom properties for theme values.
- Keep business logic in hooks or `lib/`.
- Avoid placing logic in page components; keep them declarative.

---

## CRITICAL RULES FOR ALL AI AGENTS

### 🚫 Component Creation Rules (MANDATORY)
- **NEVER build custom components** unless explicitly instructed by the user
- **ALWAYS use shadcn/ui components first** - they are the primary choice for ALL UI needs
- **Only consider Vercel v0 components** if shadcn/ui doesn't have what's needed AND user explicitly approves
- **No external component libraries** without explicit user permission
- **Custom components require written user approval** before implementation

### 🤖 AI Integration Rules
- **Vercel AI Gateway**: Primary AI integration for unified access to 100+ models
- **Multi-Provider Support**: Ready for OpenAI, Anthropic, Google, Cohere, and other providers
- **Environment Variables**: Use `.env.local` for API keys (AI_GATEWAY_API_KEY, etc.)
- **Fallback Strategy**: Graceful degradation if primary provider unavailable

### 🔤 Typography Rules
- **Google Fonts Integration**: Available via API for custom typography needs
- **System Fonts First**: Prefer system fonts for performance
- **Custom Fonts**: Only when explicitly requested and API key is available

### 📁 File Structure Rules
- **Modular Architecture**: Keep files under 100-150 lines maximum
- **Single Responsibility**: Each file has one clear purpose
- **SPA Architecture**: Single page application - sidebar/header never changes, content changes dynamically
- **Hash Routing**: Use hash-based routing for SPA navigation and sharing
- **Clean Imports**: Use index.ts files for organized exports

### ⚡ Performance Rules
- **Lazy Loading**: Implement for route components and heavy features
- **Memoization**: Use React.memo and useMemo for expensive operations
- **Bundle Optimization**: Keep initial bundle size minimal
- **Font Optimization**: Use `display: swap` and preload critical fonts

---

## AI Agent Decision Framework

### When to Use shadcn/ui (Default Choice)
```tsx
// ✅ ALWAYS FIRST - Check shadcn/ui components first
import { Button, Input, Card, Dialog, DropdownMenu } from '@/components/ui/*';
```

### When to Ask for Permission (Custom Components)
```tsx
// ❌ NEVER without explicit user instruction
// "Please create a custom component for this specific use case"
function MyCustomComponent() { /* ... */ }
```

### When to Use Vercel v0 (Secondary Choice)
```tsx
// ⚠️ ONLY after user approval and shadcn/ui doesn't suffice
import { SomeV0Component } from '@vercel/v0';
```

### When to Use Google Fonts
```tsx
// 🔤 ONLY when explicitly requested
import { Inter } from 'next/font/google'; // After user says "use Google Fonts"
```

---

If any section is unclear or missing, please provide feedback for further refinement.

---

## 📚 Additional Resources
- **Complete File Structure & Implementation**: See `.github/ai-development-guide.md` for detailed modular architecture, hash routing patterns, and comprehensive code examples.

---

# 🚨 FINAL REMINDER FOR ALL AI AGENTS 🚨

**⚠️ CRITICAL**: Before making ANY code changes, you MUST read and follow `.github/critical-requirements.md`. This file contains mandatory rules that override all other instructions. Violation of these rules will result in complete rejection of work.

**Key Requirements:**
- NO custom components without explicit user approval
- NO fallbacks, mocks, or demos - only production-ready code
- SPA architecture: sidebar/header never changes, content changes dynamically
- shadcn/ui components FIRST and ONLY choice

**Read `.github/critical-requirements.md` NOW before proceeding with any work.**
- **Component Usage Hierarchy**: Always refer to the AI development guide for the latest component creation rules and patterns.