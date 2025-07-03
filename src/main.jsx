import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import AppProvider from './lib/ContextPanel.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
       <BrowserRouter  >
       <AppProvider>
    <App />
    </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
