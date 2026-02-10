import { useState } from 'react'
import { X } from 'lucide-react'
import Modal from './Modal'

const DUMMY_USERS = [
  { id: '1', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  { id: '2', name: 'Sarah Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: '3', name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
  { id: '4', name: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
]

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState(
    task || {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: DUMMY_USERS[0],
      dueDate: '',
    }
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAssigneeChange = (e) => {
    const userId = e.target.value
    const assignee = DUMMY_USERS.find((u) => u.id === userId)
    setFormData((prev) => ({ ...prev, assignee }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            {task ? 'Update' : 'Create'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="Enter task title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="input resize-none"
            placeholder="Enter task description"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assignee
          </label>
          <select
            value={formData.assignee?.id}
            onChange={handleAssigneeChange}
            className="input"
          >
            {DUMMY_USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="input"
          />
        </div>
      </form>
    </Modal>
  )
}

export default TaskModal
