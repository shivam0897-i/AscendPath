# Sentry Integration Guide

## Overview

The AscendPath project uses a structured logging utility (`src/lib/logger.ts`) that is ready for Sentry integration. This guide explains how to connect Sentry for production error monitoring.

## Prerequisites

1. Create a Sentry account at https://sentry.io
2. Create a new project for "React" platform
3. Get your DSN from Project Settings → Client Keys

## Installation

```bash
npm install @sentry/react
```

## Configuration

### 1. Initialize Sentry in `src/main.tsx`

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD, // Only in production
  tracesSampleRate: 0.1, // 10% of transactions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 2. Add Environment Variable

Add to `.env`:
```
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 3. Update Logger to Send to Sentry

In `src/lib/logger.ts`, modify the `log` method:

```typescript
import * as Sentry from "@sentry/react";

// In the log method, add:
if (!isDev && level === 'error') {
  Sentry.captureException(error?.originalError || new Error(message), {
    tags: { operation: entry.context?.operation },
    extra: entry.context,
  });
}
```

### 4. Wrap Error Boundary

Update `src/components/ErrorBoundary.tsx`:

```typescript
import * as Sentry from "@sentry/react";

// In componentDidCatch:
Sentry.captureException(error, {
  contexts: { react: { componentStack: errorInfo.componentStack } }
});
```

## Verification

1. Deploy to staging
2. Trigger an error (e.g., disconnect network during API call)
3. Check Sentry dashboard for the captured error

## Features Available After Integration

- **Error tracking**: All unhandled errors auto-captured
- **Performance monitoring**: API call latencies
- **Session replay**: See what user did before error
- **Release tracking**: Know which deployment introduced bugs

## Cost Considerations

- Free tier: 5K errors/month
- Team tier: 50K errors/month
- Consider setting `tracesSampleRate` based on traffic
