import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { StaticAuthProvider } from './context/StaticAuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StaticAuthProvider>
      <App />
    </StaticAuthProvider>
  </React.StrictMode>,
)
