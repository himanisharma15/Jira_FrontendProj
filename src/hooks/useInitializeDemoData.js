import { useEffect } from 'react'

// Demo users that will be added to localStorage on first load
const DEMO_USERS = [
  {
    id: 'demo-teacher-1',
    name: 'Teacher Demo',
    email: 'teacher@demo.com',
    password: 'password123',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-student-1',
    name: 'Student Demo',
    email: 'student@demo.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student',
    createdAt: new Date().toISOString()
  }
]

export const useInitializeDemoData = () => {
  useEffect(() => {
    // Initialize demo users if not already present
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    if (users.length === 0) {
      localStorage.setItem('users', JSON.stringify(DEMO_USERS))
      console.log('Demo users initialized!')
    }
  }, [])
}

export default useInitializeDemoData
