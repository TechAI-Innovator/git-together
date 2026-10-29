import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { startHealthChecks } from '@fast-bites/api-client'
import './index.css'
import App from './App.tsx'

startHealthChecks()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
