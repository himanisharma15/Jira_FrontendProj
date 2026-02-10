import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContextNew'
import { useTheme } from '../context/ThemeContext'
import { User, Bell, Lock, Globe, Moon, Sun } from 'lucide-react'
import Toast from '../components/Toast'

const Settings = () => {
  const { user, updateUser } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'student'
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    weeklyDigest: false
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'preferences', name: 'Preferences', icon: Globe }
  ]

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // Update user profile
    updateUser(profileData)
    setToast({ type: 'success', message: 'Profile updated successfully!' })
  }

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    setToast({ type: 'success', message: 'Notification settings updated!' })
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Profile Information
                  </h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="input w-full"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input w-full"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={profileData.role}
                        disabled
                        className="input w-full bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Role cannot be changed. Contact an administrator for role changes.
                      </p>
                    </div>

                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive email updates about your tasks
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle('emailNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle('pushNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.pushNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Task Updates</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get notified when tasks are assigned or updated
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle('taskUpdates')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.taskUpdates ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.taskUpdates ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Weekly Digest</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive a weekly summary of your tasks
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle('weeklyDigest')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.weeklyDigest ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Security Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Change Password</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Update your password to keep your account secure
                      </p>
                      <button className="btn-secondary">
                        Change Password
                      </button>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <button className="btn-secondary">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-4 border border-red-200 dark:border-red-900/20 rounded-lg bg-red-50 dark:bg-red-900/10">
                      <h3 className="font-medium text-red-900 dark:text-red-400 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Permanently delete your account and all associated data
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    App Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Toggle between light and dark theme
                        </p>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Language</h3>
                      <select className="input w-full">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Timezone</h3>
                      <select className="input w-full">
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Default View</h3>
                      <select className="input w-full">
                        <option value="dashboard">Dashboard</option>
                        <option value="board">Board</option>
                        <option value="list">List</option>
                        <option value="timeline">Timeline</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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

export default Settings
