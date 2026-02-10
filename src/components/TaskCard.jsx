import { Calendar, MoreVertical, Trash2, Edit } from 'lucide-react'
import { format } from 'date-fns'
import Avatar from './Avatar'
import Badge from './Badge'
import { useAuth } from '../context/AuthContextNew'
import { useState, useRef, useEffect } from 'react'

const TaskCard = ({ task, onEdit, onDelete, isDragging }) => {
  const { user } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  const canEdit = user?.role === 'teacher' || user?.role === 'admin'

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'high'
      case 'medium':
        return 'medium'
      case 'low':
        return 'low'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'success'
      case 'in-progress':
        return 'warning'
      case 'todo':
        return 'primary'
      default:
        return 'default'
    }
  }

  return (
    <div
      className={`card p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Badge variant={getPriorityColor(task.priority)} className="uppercase">
          {task.priority}
        </Badge>
        {canEdit && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <button
                  onClick={() => {
                    onEdit(task)
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 break-words">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 break-words">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <Avatar
          src={task.assignee.avatar}
          alt={task.assignee.name}
          size="sm"
        />
        
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(task.dueDate), 'MMM dd')}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard
