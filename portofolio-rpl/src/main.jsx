import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './assets/styles.css'
import './assets/admin.css'  // Untuk login style
import './assets/admin-gmail.css'  // Untuk dashboard Gmail style

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)