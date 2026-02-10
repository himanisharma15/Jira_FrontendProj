import { useState } from 'react'
import Modal from './Modal'
import Avatar from './Avatar'
import { useAuth } from '../context/AuthContextNew'
import { User, Mail, Briefcase, Camera } from 'lucide-react'

const ProfileSettings = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    avatar: user?.avatar || ''
  })
  const [isSaved, setIsSaved] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    // Update user data in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'))
    const updatedUser = { ...storedUser, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))

    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...formData } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      window.location.reload() // Reload to apply changes
    }, 1500)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profile Settings"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary">
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar src={formData.avatar} alt={formData.name} size="xl" />
            <button className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Click camera icon to change avatar
          </p>
        </div>

        {/* Avatar URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avatar URL
          </label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="input"
            placeholder="https://example.com/avatar.jpg"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Or use: https://api.dicebear.com/7.x/avataaars/svg?seed=YourName
          </p>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="Enter your email"
            disabled
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Email cannot be changed
          </p>
        </div>

        {/* Role Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Role
          </label>
          <input
            type="text"
            value={formData.role}
            className="input capitalize"
            disabled
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Role is assigned by administrator
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default ProfileSettings
