import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContextNew'
import { AlertCircle, Plus, Filter, Bug, AlertTriangle, Info } from 'lucide-react'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import { format } from 'date-fns'
import { issuesAPI } from '../services/api'

const Issues = () => {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    type: 'bug',
    severity: 'medium',
    priority: 'medium'
  })

  const canEdit = user?.role === 'teacher' || user?.role === 'admin'

  // Fetch issues from API
  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      setLoading(true)
      const response = await issuesAPI.getAll()
      setIssues(response.data)
    } catch (error) {
      console.error('Error fetching issues:', error)
      setToast({ type: 'error', message: 'Failed to load issues' })
    } finally {
      setLoading(false)
    }
  }

  const filteredIssues = issues.filter(issue => {
    const matchesType = typeFilter === 'all' || issue.type === typeFilter
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
    return matchesType && matchesStatus
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug': return Bug
      case 'performance': return AlertTriangle
      case 'enhancement': return Info
      default: return AlertCircle
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'bug': return 'danger'
      case 'performance': return 'warning'
      case 'enhancement': return 'primary'
      default: return 'default'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'default'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success'
      case 'in-progress': return 'warning'
      case 'open': return 'primary'
      default: return 'default'
    }
  }

  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length
  }

  const handleReportIssue = () => {
    setIsReportModalOpen(true)
  }

  const handleSubmitIssue = async (e) => {
    e.preventDefault()
    
    if (!newIssue.title.trim()) {
      setToast({ type: 'error', message: 'Issue title is required!' })
      return
    }

    if (!newIssue.description.trim()) {
      setToast({ type: 'error', message: 'Issue description is required!' })
      return
    }

    try {
      const issueToCreate = {
        title: newIssue.title,
        description: newIssue.description,
        type: newIssue.type,
        severity: newIssue.severity,
        priority: newIssue.priority
      }

      const response = await issuesAPI.create(issueToCreate)
      setIssues([response.data, ...issues])
      setToast({ type: 'success', message: 'Issue reported successfully!' })
      setIsReportModalOpen(false)
      setNewIssue({
        title: '',
        description: '',
        type: 'bug',
        severity: 'medium',
        priority: 'medium'
      })
    } catch (error) {
      console.error('Error creating issue:', error)
      setToast({ type: 'error', message: 'Failed to create issue' })
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Issues</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track bugs, enhancements, and technical issues
            </p>
          </div>
          {canEdit && (
            <button 
              onClick={handleReportIssue}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Report Issue
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.open}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.inProgress}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.resolved}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Types</option>
                <option value="bug">Bug</option>
                <option value="performance">Performance</option>
                <option value="enhancement">Enhancement</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        {filteredIssues.length > 0 ? (
          <div className="space-y-4">
            {filteredIssues.map(issue => {
              const TypeIcon = getTypeIcon(issue.type)
              return (
                <div key={issue.id} className="card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      issue.type === 'bug' ? 'bg-red-100 dark:bg-red-900/20' :
                      issue.type === 'performance' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      'bg-blue-100 dark:bg-blue-900/20'
                    }`}>
                      <TypeIcon className={`w-6 h-6 ${
                        issue.type === 'bug' ? 'text-red-600 dark:text-red-400' :
                        issue.type === 'performance' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                          {issue.id}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                          {issue.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {issue.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant={getTypeColor(issue.type)}>{issue.type}</Badge>
                        <Badge variant={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                        <Badge variant={getStatusColor(issue.status)}>{issue.status}</Badge>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Avatar src={issue.reporter.avatar} alt={issue.reporter.name} size="sm" />
                          <span>Reported by {issue.reporter.name}</span>
                        </div>

                        {issue.assignee && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Avatar src={issue.assignee.avatar} alt={issue.assignee.name} size="sm" />
                            <span>Assigned to {issue.assignee.name}</span>
                          </div>
                        )}

                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                          {issue.comments} comments
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={AlertCircle}
            title="No issues found"
            description="Try adjusting your filters or report a new issue"
          />
        )}

        {/* Report Issue Modal */}
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false)
            setNewIssue({
              title: '',
              description: '',
              type: 'bug',
              severity: 'medium',
              priority: 'medium'
            })
          }}
          title="Report New Issue"
        >
          <form onSubmit={handleSubmitIssue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                value={newIssue.title}
                onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                className="input w-full"
                placeholder="e.g., Login button not working"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                className="input w-full"
                rows={5}
                placeholder="Describe the issue in detail...\n\nSteps to reproduce:\n1. Go to...\n2. Click on...\n3. See error"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newIssue.type}
                  onChange={(e) => setNewIssue({ ...newIssue, type: e.target.value })}
                  className="input w-full"
                >
                  <option value="bug">Bug</option>
                  <option value="performance">Performance</option>
                  <option value="enhancement">Enhancement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Severity
                </label>
                <select
                  value={newIssue.severity}
                  onChange={(e) => setNewIssue({ ...newIssue, severity: e.target.value })}
                  className="input w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={newIssue.priority}
                onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value })}
                className="input w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Tip:</strong> Provide as much detail as possible including steps to reproduce, expected vs actual behavior, and any error messages.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsReportModalOpen(false)
                  setNewIssue({
                    title: '',
                    description: '',
                    type: 'bug',
                    severity: 'medium',
                    priority: 'medium'
                  })
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Report Issue
              </button>
            </div>
          </form>
        </Modal>

        {/* Toast */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </Layout>
  )
}

export default Issues
