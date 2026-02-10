import axios from 'axios'

const API_URL = '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Authentication API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
}

// Tasks API
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, updates) => api.put(`/tasks/${id}`, updates),
  delete: (id) => api.delete(`/tasks/${id}`)
}

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getMe: () => api.get('/users/me')
}

// Forms API
export const formsAPI = {
  getAll: () => api.get('/forms'),
  getById: (id) => api.get(`/forms/${id}`),
  create: (formData) => api.post('/forms', formData),
  update: (id, updates) => api.put(`/forms/${id}`, updates),
  delete: (id) => api.delete(`/forms/${id}`)
}

// Pages API
export const pagesAPI = {
  getAll: () => api.get('/pages'),
  getById: (id) => api.get(`/pages/${id}`),
  create: (pageData) => api.post('/pages', pageData),
  update: (id, updates) => api.put(`/pages/${id}`, updates),
  delete: (id) => api.delete(`/pages/${id}`)
}

// Issues API
export const issuesAPI = {
  getAll: () => api.get('/issues'),
  getById: (id) => api.get(`/issues/${id}`),
  create: (issueData) => api.post('/issues', issueData),
  update: (id, updates) => api.put(`/issues/${id}`, updates),
  delete: (id) => api.delete(`/issues/${id}`)
}

export default api
