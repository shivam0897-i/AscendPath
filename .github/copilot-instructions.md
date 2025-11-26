# AscendPath - AI Coding Instructions

## Project Overview
AscendPath is an AI-driven career counseling platform that generates personalized learning roadmaps using Gemini API. It's a React + TypeScript SPA with Supabase backend, deployed on Vercel.

## Architecture

### Frontend Stack
- **React 18** + **TypeScript** with Vite (port 8080)
- **shadcn/ui** components in `src/components/ui/` - extend these, don't reinvent
- **Tailwind CSS** with custom colors: `empowerPurple` (#9b87f5) and `empowerBlue` (#0EA5E9)
- **React Router** with `AnimatePresence` for page transitions in `App.tsx`
- Path alias: `@/` maps to `src/` (e.g., `import { Button } from "@/components/ui/button"`)

### Backend & Data Flow
- **Supabase** for auth and database - client at `src/integrations/supabase/client.ts`
- **Supabase Edge Functions** (Deno) in `supabase/functions/` for server-side AI calls
- **Vercel API Routes** in `api/` for client-facing endpoints (e.g., `api/gemini.ts` for chatbot)
- Database types auto-generated in `src/integrations/supabase/types.ts`

### AI Integration Points
| Feature | Endpoint | Model |
|---------|----------|-------|
| Chatbot (Edura) | `/api/gemini` | gemini-2.5-flash |
| Roadmap Generation | Supabase Edge Function | gemini-2.5-pro |

## Key Patterns

### Authentication
```tsx
// Always use the AuthContext hook
import { useAuth } from "@/context/AuthContext";
const { user, session, isLoading, signIn, signOut, signInWithGoogle } = useAuth();
```

### Protected Routes
Wrap authenticated pages with `<ProtectedRoute>` - see `App.tsx` for examples.

### Component Conventions
- UI primitives: `src/components/ui/` (shadcn - don't modify directly)
- Feature components: `src/components/` (Navbar, Footer, Chatbot, etc.)
- Pages: `src/pages/` - each renders Navbar + content + Footer
- Use `cn()` from `@/lib/utils` for conditional classNames

### Toast Notifications
```tsx
import { toast } from "sonner";
toast.success("Success message");
toast.error("Error message");
```

### Supabase Queries
```tsx
import { supabase } from "@/integrations/supabase/client";
// Fetch with type safety
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### Theme Support
Uses `next-themes` with `ThemeProvider` - supports "light", "dark", "system".

## Commands
```bash
npm run dev      # Start dev server at http://localhost:8080
npm run build    # Production build to dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Environment Variables
Required in `.env`:
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` - Database connection
- `GEMINI_API_KEY` - For AI features

## File Structure Conventions
- New pages → `src/pages/` + add route in `App.tsx`
- New components → `src/components/` (use PascalCase)
- Hooks → `src/hooks/` with `use-` prefix
- Context providers → `src/context/`

## Edge Function Pattern (Deno)
```typescript
// supabase/functions/*/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  // ... handle request
});
```

## Styling Notes
- Custom font families: `font-sans` (Inter), `font-heading` (Poppins)
- Animation utility: `animate-fade-in` for entry animations
- Always use Tailwind utilities; CSS variables for theming in `src/index.css`
