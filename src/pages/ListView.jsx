import { useState } from 'react'
import Layout from '../components/Layout'
import { useTask } from '../context/TaskContextNew'
import { useAuth } from '../context/AuthContextNew'
import TaskModal from '../components/TaskModal'
import Toast from '../components/Toast'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { Plus, Search, Filter, Calendar, Inbox, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

const ListView = () => {
  const { tasks, addTask, updateTask, deleteTask, searchQuery, setSearchQuery } = useTask()
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [toast, setToast] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const canEdit = user?.role === 'teacher' || user?.role === 'admin'

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
      setToast({ type: 'success', message: 'Task updated successfully!' })
    } else {
      addTask(taskData)
      setToast({ type: 'success', message: 'Task created successfully!' })
    }
    setEditingTask(null)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId)
    setToast({ type: 'success', message: 'Task deleted successfully!' })
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task List</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage all tasks in list format
            </p>
          </div>

          {canEdit && (
            <button
              onClick={() => {
                setEditingTask(null)
                setIsModalOpen(true)
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="input pl-9"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input sm:w-48"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input sm:w-48"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="card overflow-hidden">
          {filteredTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Due Date
                    </th>
                    {canEdit && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {/* Task */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Assignee */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            size="sm"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {task.assignee.name}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge variant={
                          task.status === 'done' ? 'success' :
                          task.status === 'in-progress' ? 'warning' :
                          'primary'
                        }>
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4">
                        <Badge variant={task.priority}>
                          {task.priority}
                        </Badge>
                      </td>

                      {/* Due Date */}
                      <td className="px-6 py-4">
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      {canEdit && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Edit task"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No tasks found"
              description="Try adjusting your search or filters to find what you're looking for"
              action={
                canEdit && (
                  <button
                    onClick={() => {
                      setEditingTask(null)
                      setIsModalOpen(true)
                    }}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Task
                  </button>
                )
              }
            />
          )}
        </div>

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTask(null)
          }}
          onSave={handleSaveTask}
          task={editingTask}
        />

        {/* Toast Notifications */}
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

export default ListView
