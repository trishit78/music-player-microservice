import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SongProvider } from './context/SongContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SongProvider>

    <App />
    </SongProvider>
  </StrictMode>,
)
