import Layout from '../components/Layout'
import { useTask } from '../context/TaskContextNew'
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { useState } from 'react'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import TaskModal from '../components/TaskModal'
import { useAuth } from '../context/AuthContextNew'

const Timeline = () => {
  const { tasks, addTask, updateTask } = useTask()
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const canEdit = user?.role === 'teacher' || user?.role === 'admin'

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      return isSameDay(new Date(task.dueDate), day)
    })
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const today = () => setCurrentDate(new Date())

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsTaskModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(false)
    setSelectedTask(null)
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        // Update existing task
        await updateTask(selectedTask.id, taskData)
      } else {
        // Create new task
        await addTask(taskData)
      }
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save task:', error)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Timeline</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View tasks in calendar format
            </p>
          </div>
          {canEdit && (
            <button 
              onClick={handleCreateTask}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          )}
        </div>

        {/* Calendar Navigation */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={today} className="btn-secondary text-sm px-3 py-1">
                Today
              </button>
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {daysInMonth.map(day => {
              const dayTasks = getTasksForDay(day)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toString()}
                  className={`min-h-24 p-2 border border-gray-200 dark:border-gray-700 rounded-lg ${
                    !isSameMonth(day, currentDate) ? 'opacity-50' : ''
                  } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 'bg-white dark:bg-gray-800'}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className="text-xs p-1 rounded bg-gray-100 dark:bg-gray-700 truncate cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title={task.title}
                      >
                        <Badge variant={task.priority} className="text-xs px-1 py-0 mr-1">
                          {task.priority[0].toUpperCase()}
                        </Badge>
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {tasks
              .filter(task => task.dueDate && new Date(task.dueDate) >= new Date())
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 5)
              .map(task => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 min-w-24">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(task.dueDate), 'MMM dd')}
                  </div>
                  <Avatar src={task.assignee.avatar} alt={task.assignee.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </h4>
                  </div>
                  <Badge variant={task.priority}>{task.priority}</Badge>
                  <Badge variant={task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'warning' : 'primary'}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
          </div>
        </div>

        {/* Task Modal */}
        {isTaskModalOpen && (
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveTask}
            task={selectedTask}
          />
        )}
      </div>
    </Layout>
  )
}

export default Timeline
