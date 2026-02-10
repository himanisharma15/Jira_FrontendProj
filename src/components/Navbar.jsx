import { Search, Bell, Moon, Sun, LogOut, ChevronDown, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContextNew'
import { useTheme } from '../context/ThemeContext'
import { useTask } from '../context/TaskContextNew'
import { useState, useRef, useEffect } from 'react'
import Avatar from './Avatar'
import ProfileSettings from './ProfileSettings'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { searchQuery, setSearchQuery } = useTask()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  // Demo notifications
  const notifications = [
    { id: 1, type: 'task', message: 'New task assigned: Implement authentication', time: '5 min ago', read: false },
    { id: 2, type: 'comment', message: 'John commented on "Fix mobile responsive issues"', time: '1 hour ago', read: false },
    { id: 3, type: 'update', message: 'Task "Design landing page" status changed to Done', time: '2 hours ago', read: true },
    { id: 4, type: 'mention', message: 'Sarah mentioned you in a comment', time: '3 hours ago', read: true },
    { id: 5, type: 'deadline', message: 'Task "Update dependencies" is due tomorrow', time: '5 hours ago', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      {/* Left Section - Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full min-w-[1.25rem] text-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-[32rem] overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="overflow-y-auto flex-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        !notification.read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              size="sm"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>

              <button 
                onClick={() => {
                  setShowProfileSettings(true)
                  setShowProfileMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                <User className="w-4 h-4" />
                Profile Settings
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />

      {/* Profile Settings Modal */}
      <ProfileSettings 
        isOpen={showProfileSettings} 
        onClose={() => setShowProfileSettings(false)} 
      />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
