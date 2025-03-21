import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Globalstate from './components/context/GlobalContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Globalstate>
        <App />
    </Globalstate>,
  </StrictMode>,
)
