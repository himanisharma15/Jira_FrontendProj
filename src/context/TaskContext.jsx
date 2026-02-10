import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const TaskContext = createContext()

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}

const DUMMY_TASKS = [
  {
    id: '1',
    title: 'Design landing page',
    description: 'Create mockups for the new landing page',
    status: 'todo',
    priority: 'high',
    assignee: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    dueDate: '2026-02-15',
    createdAt: '2026-02-08'
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Add login and signup functionality',
    status: 'in-progress',
    priority: 'high',
    assignee: {
      id: '2',
      name: 'Sarah Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    dueDate: '2026-02-12',
    createdAt: '2026-02-07'
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints',
    status: 'done',
    priority: 'medium',
    assignee: {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
    },
    dueDate: '2026-02-10',
    createdAt: '2026-02-05'
  },
  {
    id: '4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'todo',
    priority: 'medium',
    assignee: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    dueDate: '2026-02-18',
    createdAt: '2026-02-09'
  },
  {
    id: '5',
    title: 'Fix mobile responsive issues',
    description: 'Ensure all pages work well on mobile devices',
    status: 'in-progress',
    priority: 'high',
    assignee: {
      id: '4',
      name: 'Emily Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
    },
    dueDate: '2026-02-13',
    createdAt: '2026-02-08'
  },
  {
    id: '6',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions',
    status: 'todo',
    priority: 'low',
    assignee: {
      id: '2',
      name: 'Sarah Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    dueDate: '2026-02-20',
    createdAt: '2026-02-09'
  }
]

export const TaskProvider = ({ children }) => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', assignee: 'all' })
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('board') // 'board' or 'list'

  useEffect(() => {
    // Load tasks from localStorage or use dummy data
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    } else {
      setTasks(DUMMY_TASKS)
      localStorage.setItem('tasks', JSON.stringify(DUMMY_TASKS))
    }
  }, [])

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: task.status || 'todo'
    }
    setTasks(prev => [...prev, newTask])
  }

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const moveTask = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus })
  }

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filter.status === 'all' || task.status === filter.status
      const matchesPriority = filter.priority === 'all' || task.priority === filter.priority
      const matchesAssignee = filter.assignee === 'all' || task.assignee.id === filter.assignee

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })
  }

  const getTasksByStatus = (status) => {
    return getFilteredTasks().filter(task => task.status === status)
  }

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    view,
    setView,
    getFilteredTasks,
    getTasksByStatus
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
