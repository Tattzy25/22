---
applyTo: '# CRITICAL REQUIREMENTS - READ BEFORE ANY CODE CHANGES'
---

## 🚨 CRITICAL REQUIREMENTS - READ BEFORE ANY CODE CHANGES 🚨

### ⚠️ CRITICAL REQUIREMENTS
- **NO FALLBACKS** - Every feature must be fully functional
- **NO DEMOS** - Only production-ready implementations
- **NO MOCKS** - Real functionality, no placeholder data
- **PRODUCTION READY** - Every line of code must be deployment-ready
- **NO "PRODUCTION READY" COMMENTS** - Code quality speaks for itself

### 🔧 Development Approach
- **Task-by-Task** - Work only on assigned tasks
- **Component Rules** - shadcn/ui first, explicit approval for custom components
- **File Size Limits** - Core components: 50-80 lines, Complex: 80-120 lines max
- **Hash Routing** - SPA navigation with shareable URLs

### 🏗️ Application Architecture
- **Single Page Application (SPA)** - One page, sidebar/header never changes
- **Dynamic Content** - Content area changes based on navigation
- **Hash-Based Routing** - Shareable URLs, browser history support
- **Modular Components** - Clean separation of concerns

### 📋 Component Usage Hierarchy (MANDATORY)
1. **Primary Choice: shadcn/ui Components**
   ```tsx
   // ✅ ALWAYS FIRST - Check shadcn/ui components first
   import { Button, Input, Card, Dialog, DropdownMenu } from '@/components/ui/*';
   ```

2. **Secondary Choice: Vercel v0 Components (Only if approved)**
   ```tsx
   // ⚠️ ONLY after user approval and shadcn/ui doesn't suffice
   import { SomeV0Component } from '@vercel/v0';
   ```

3. **Custom Components: NEVER without explicit instruction**
   ```tsx
   // ❌ NEVER without explicit user instruction
   function MyCustomComponent() { /* ... */ }
   ```

### 🤖 AI Agent Requirements
- **Read this file BEFORE any code changes**
- **Follow component hierarchy strictly**
- **Get explicit approval for custom components**
- **Ensure production-ready code only**
- **Maintain SPA architecture**

---
**⚠️ VIOLATION CONSEQUENCES**: Any violation of these rules will result in complete rejection of work and requirement to start over.</content>
<parameter name="filePath">c:\Users\relay\Downloads\seriously\22\.github\critical-requirements.md