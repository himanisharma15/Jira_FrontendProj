import Layout from '../components/Layout'
import { useTask } from '../context/TaskContextNew'
import { BarChart3, TrendingUp, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

const Reports = () => {
  const { tasks } = useTask()

  // Calculate metrics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  const highPriority = tasks.filter(t => t.priority === 'high').length
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length
  const lowPriority = tasks.filter(t => t.priority === 'low').length

  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false
    return new Date(t.dueDate) < new Date()
  }).length

  // Team performance
  const teamMembers = Array.from(new Set(tasks.map(t => t.assignee.id))).map(id => {
    const member = tasks.find(t => t.assignee.id === id)?.assignee
    const memberTasks = tasks.filter(t => t.assignee.id === id)
    const completed = memberTasks.filter(t => t.status === 'done').length
    return {
      ...member,
      total: memberTasks.length,
      completed,
      rate: memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0
    }
  })

  // Status distribution
  const statusDistribution = [
    { status: 'To Do', count: tasks.filter(t => t.status === 'todo').length, color: 'bg-blue-500' },
    { status: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length, color: 'bg-yellow-500' },
    { status: 'Done', count: tasks.filter(t => t.status === 'done').length, color: 'bg-green-500' }
  ]

  const StatCard = ({ icon: Icon, label, value, subtext, color, bgColor }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      {subtext && <p className="text-sm text-gray-500 dark:text-gray-400">{subtext}</p>}
    </div>
  )

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analytics and insights for your projects
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={BarChart3}
            label="Total Tasks"
            value={totalTasks}
            subtext="All time"
            color="text-blue-600"
            bgColor="bg-blue-100 dark:bg-blue-900/20"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completion Rate"
            value={`${completionRate}%`}
            subtext={`${completedTasks} of ${totalTasks} completed`}
            color="text-green-600"
            bgColor="bg-green-100 dark:bg-green-900/20"
          />
          <StatCard
            icon={TrendingUp}
            label="In Progress"
            value={tasks.filter(t => t.status === 'in-progress').length}
            subtext="Active tasks"
            color="text-yellow-600"
            bgColor="bg-yellow-100 dark:bg-yellow-900/20"
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={overdueTasks}
            subtext="Past due date"
            color="text-red-600"
            bgColor="bg-red-100 dark:bg-red-900/20"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Status Distribution */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Status Distribution</h3>
            <div className="space-y-4">
              {statusDistribution.map(item => {
                const percentage = totalTasks > 0 ? (item.count / totalTasks) * 100 : 0
                return (
                  <div key={item.status}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{item.status}</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.count} tasks ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Priority Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">High Priority</span>
                  <span className="text-gray-600 dark:text-gray-400">{highPriority} tasks</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-red-500 transition-all duration-500"
                    style={{ width: `${totalTasks > 0 ? (highPriority / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">Medium Priority</span>
                  <span className="text-gray-600 dark:text-gray-400">{mediumPriority} tasks</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${totalTasks > 0 ? (mediumPriority / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">Low Priority</span>
                  <span className="text-gray-600 dark:text-gray-400">{lowPriority} tasks</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gray-500 transition-all duration-500"
                    style={{ width: `${totalTasks > 0 ? (lowPriority / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Performance
          </h3>
          <div className="space-y-4">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.completed} of {member.total} tasks completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{member.rate}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Completion</p>
                </div>
                <div className="w-32">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${member.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Overall Progress: {completionRate}%</p>
                <p className="text-gray-600 dark:text-gray-400">Team is making good progress on tasks</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{highPriority} High Priority Tasks</p>
                <p className="text-gray-600 dark:text-gray-400">Focus on critical items first</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{tasks.filter(t => t.status === 'in-progress').length} Active Tasks</p>
                <p className="text-gray-600 dark:text-gray-400">Currently being worked on</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{teamMembers.length} Team Members</p>
                <p className="text-gray-600 dark:text-gray-400">Contributing to the project</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Reports
