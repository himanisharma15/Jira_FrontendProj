import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User already exists' }
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password
    setUser(userWithoutPassword)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
