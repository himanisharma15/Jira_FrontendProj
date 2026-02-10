import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

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
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      const { user, token } = response.data
      
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData)
      const { user, token } = response.data
      
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Signup failed' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
