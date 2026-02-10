import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContextNew'
import { tasksAPI } from '../services/api'

const TaskContext = createContext()

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }) => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', assignee: 'all' })
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('board')
  const [loading, setLoading] = useState(true)

  // Fetch tasks on mount
  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await tasksAPI.getAll()
      setTasks(response.data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (task) => {
    try {
      const response = await tasksAPI.create(task)
      setTasks(prev => [...prev, response.data])
    } catch (error) {
      console.error('Failed to add task:', error)
      throw error
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      const response = await tasksAPI.update(taskId, updates)
      setTasks(prev => prev.map(task => 
        task.id === taskId ? response.data : task
      ))
    } catch (error) {
      console.error('Failed to update task:', error)
      throw error
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw error
    }
  }

  const moveTask = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus })
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
    getTasksByStatus,
    loading,
    refreshTasks: fetchTasks
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
