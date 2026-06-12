import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if (import.meta.env.VITE_GEMINI_API_KEY) {
  console.log("✅ Gemini API Key detected successfully on startup.");
} else {
  console.error("❌ CRITICAL ERROR: VITE_GEMINI_API_KEY is missing from .env.local.");
  console.error("The OpportunityOS Copilot and AI features will not function correctly.");
}


