import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContextNew'
import { ThemeProvider } from './context/ThemeContext'
import { TaskProvider } from './context/TaskContextNew'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
