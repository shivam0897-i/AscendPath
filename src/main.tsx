import { SpeedInsights } from "@vercel/speed-insights/react"
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();
import { inject } from "@vercel/analytics"
inject();
const container = document.getElementById("root")
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
