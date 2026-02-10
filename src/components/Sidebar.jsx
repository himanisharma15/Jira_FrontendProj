import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  KanbanSquare, 
  List, 
  Calendar, 
  FileText, 
  Users,
  AlertCircle,
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Summary', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Board', path: '/board', icon: KanbanSquare },
    { name: 'List', path: '/list', icon: List },
    { name: 'Timeline', path: '/timeline', icon: Calendar },
    { name: 'Forms', path: '/forms', icon: FileText },
    { name: 'Pages', path: '/pages', icon: FileText },
    { name: 'Issues', path: '/issues', icon: AlertCircle },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ]

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <KanbanSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">Project Board</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Team Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <NavLink
          to="/settings"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <NavContent />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </aside>
    </>
  )
}

export default Sidebar
