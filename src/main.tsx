import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeProvider.tsx'
import './index.css'
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();
import { inject } from "@vercel/analytics"
inject();
const container = document.getElementById("root")
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
