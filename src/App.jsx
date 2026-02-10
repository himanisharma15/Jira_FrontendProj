import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContextNew'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Board from './pages/Board'
import ListView from './pages/ListView'
import Timeline from './pages/Timeline'
import Forms from './pages/Forms'
import Pages from './pages/Pages'
import Issues from './pages/Issues'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import './App.css'

function App() {
  const { user } = useAuth()

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/board" element={user ? <Board /> : <Navigate to="/login" />} />
          <Route path="/list" element={user ? <ListView /> : <Navigate to="/login" />} />
          <Route path="/timeline" element={user ? <Timeline /> : <Navigate to="/login" />} />
          <Route path="/forms" element={user ? <Forms /> : <Navigate to="/login" />} />
          <Route path="/pages" element={user ? <Pages /> : <Navigate to="/login" />} />
          <Route path="/issues" element={user ? <Issues /> : <Navigate to="/login" />} />
          <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
