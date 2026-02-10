import { useState } from 'react'
import Layout from '../components/Layout'
import { useTask } from '../context/TaskContextNew'
import { useAuth } from '../context/AuthContextNew'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import EmptyState from '../components/EmptyState'
import Toast from '../components/Toast'
import { Plus, Filter, Search, Inbox } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortableTaskCard = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} isDragging={isDragging} />
    </div>
  )
}

const Board = () => {
  const { tasks, addTask, updateTask, deleteTask, moveTask, searchQuery, setSearchQuery } = useTask()
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [toast, setToast] = useState(null)
  const [activeId, setActiveId] = useState(null)

  const canEdit = user?.role === 'teacher' || user?.role === 'admin'

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-500' },
    { id: 'done', title: 'Done', color: 'bg-green-500' },
  ]

  const getTasksByStatus = (status) => {
    return tasks.filter(task => {
      const matchesStatus = task.status === status
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event) => {
    const { active, over } = event

    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    const overColumn = columns.find(c => c.id === over.id)

    if (overColumn && activeTask && activeTask.status !== overColumn.id) {
      moveTask(active.id, overColumn.id)
    }
  }

  const handleDragEnd = () => {
    setActiveId(null)
  }

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

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Board</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Drag and drop tasks to change their status
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                <span className="hidden sm:inline">Add Task</span>
              </button>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-6 h-full min-w-max">
              {columns.map((column) => {
                const columnTasks = getTasksByStatus(column.id)
                return (
                  <div key={column.id} className="flex-1 min-w-[320px] flex flex-col">
                    {/* Column Header */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${column.color}`} />
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {column.title}
                        </h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({columnTasks.length})
                        </span>
                      </div>
                    </div>

                    {/* Drop Zone */}
                    <SortableContext
                      items={columnTasks.map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                      id={column.id}
                    >
                      <div
                        className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-3 min-h-[200px]"
                      >
                        {columnTasks.length > 0 ? (
                          columnTasks.map((task) => (
                            <SortableTaskCard
                              key={task.id}
                              task={task}
                              onEdit={handleEditTask}
                              onDelete={handleDeleteTask}
                            />
                          ))
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <EmptyState
                              icon={Inbox}
                              title="No tasks"
                              description={`No tasks in ${column.title.toLowerCase()}`}
                            />
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                )
              })}
            </div>
          </div>

          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
                isDragging={true}
              />
            )}
          </DragOverlay>
        </DndContext>

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

export default Board
