import Layout from '../components/Layout'
import { useTask } from '../context/TaskContextNew'
import { useAuth } from '../context/AuthContextNew'
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  TrendingUp,
  Plus,
  BarChart3
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'

const Dashboard = () => {
  const { tasks } = useTask()
  const { user } = useAuth()

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  const recentTasks = tasks.slice(0, 5)

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening with your projects today
            </p>
          </div>
          <Link to="/board" className="btn-primary inline-flex items-center gap-2 justify-center">
            <Plus className="w-5 h-5" />
            View Board
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={ListTodo}
            label="Total Tasks"
            value={stats.total}
            color="text-blue-600"
            bgColor="bg-blue-100 dark:bg-blue-900/20"
          />
          <StatCard
            icon={Clock}
            label="To Do"
            value={stats.todo}
            color="text-purple-600"
            bgColor="bg-purple-100 dark:bg-purple-900/20"
          />
          <StatCard
            icon={TrendingUp}
            label="In Progress"
            value={stats.inProgress}
            color="text-yellow-600"
            bgColor="bg-yellow-100 dark:bg-yellow-900/20"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats.done}
            color="text-green-600"
            bgColor="bg-green-100 dark:bg-green-900/20"
          />
        </div>

        {/* Recent Tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Tasks</h2>
            <Link to="/list" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Avatar src={task.assignee.avatar} alt={task.assignee.name} size="sm" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Assigned to {task.assignee.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={task.priority}>
                      {task.priority}
                    </Badge>
                    <Badge variant={
                      task.status === 'done' ? 'success' : 
                      task.status === 'in-progress' ? 'warning' : 
                      'primary'
                    }>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tasks yet. Create your first task!
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Distribution */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Priority Distribution
            </h3>
            <div className="space-y-3">
              {['high', 'medium', 'low'].map((priority) => {
                const count = tasks.filter(t => t.priority === priority).length
                const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0
                return (
                  <div key={priority}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{priority}</span>
                      <span className="text-gray-900 dark:text-white font-medium">{count} tasks</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          priority === 'high' ? 'bg-red-500' :
                          priority === 'medium' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Team Members */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Activity</h3>
            <div className="space-y-4">
              {Array.from(new Set(tasks.map(t => t.assignee.id))).map((assigneeId) => {
                const assignee = tasks.find(t => t.assignee.id === assigneeId)?.assignee
                const assigneeTasks = tasks.filter(t => t.assignee.id === assigneeId)
                const completed = assigneeTasks.filter(t => t.status === 'done').length

                return (
                  <div key={assigneeId} className="flex items-center gap-3">
                    <Avatar src={assignee?.avatar} alt={assignee?.name} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{assignee?.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {completed} of {assigneeTasks.length} tasks completed
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {assigneeTasks.length > 0 ? Math.round((completed / assigneeTasks.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
