import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContextNew'
import { FileText, Plus, Copy, Trash2, Eye } from 'lucide-react'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import EmptyState from '../components/EmptyState'
import { formsAPI } from '../services/api'

const Forms = () => {
  const { user } = useAuth()
  const [forms, setForms] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isFillFormModalOpen, setIsFillFormModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedForm, setSelectedForm] = useState(null)
  const [formResponses, setFormResponses] = useState({})
  const [newForm, setNewForm] = useState({
    name: '',
    description: '',
    category: 'Task',
    fields: ['']
  })

  const canEdit = user?.role === 'teacher' || user?.role === 'admin'

  // Fetch forms from API
  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      setLoading(true)
      const response = await formsAPI.getAll()
      setForms(response.data)
    } catch (error) {
      console.error('Error fetching forms:', error)
      setToast({ type: 'error', message: 'Failed to load forms' })
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'issue': return 'danger'
      case 'enhancement': return 'primary'
      case 'task': return 'success'
      case 'feedback': return 'warning'
      default: return 'default'
    }
  }

  const handleDuplicate = async (form) => {
    try {
      const duplicateData = {
        name: `${form.name} (Copy)`,
        description: form.description,
        fields: form.fields,
        category: form.category
      }
      const response = await formsAPI.create(duplicateData)
      setForms([response.data, ...forms])
      setToast({ type: 'success', message: 'Form duplicated successfully!' })
    } catch (error) {
      console.error('Error duplicating form:', error)
      setToast({ type: 'error', message: 'Failed to duplicate form' })
    }
  }

  const handleDelete = async (formId) => {
    try {
      await formsAPI.delete(formId)
      setForms(forms.filter(f => f.id !== formId))
      setToast({ type: 'success', message: 'Form deleted successfully!' })
    } catch (error) {
      console.error('Error deleting form:', error)
      setToast({ type: 'error', message: 'Failed to delete form' })
    }
  }

  const handleView = (form) => {
    setSelectedForm(form)
    setIsModalOpen(true)
  }

  const handleFillForm = (form) => {
    setSelectedForm(form)
    const initialResponses = {}
    form.fields.forEach(field => {
      initialResponses[field] = ''
    })
    setFormResponses(initialResponses)
    setIsFillFormModalOpen(true)
  }

  const handleResponseChange = (field, value) => {
    setFormResponses(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmitResponse = (e) => {
    e.preventDefault()
    
    // Update form responses count
    setForms(forms.map(form => 
      form.id === selectedForm.id 
        ? { ...form, responses: form.responses + 1, lastUsed: new Date().toISOString().split('T')[0] }
        : form
    ))
    
    setToast({ type: 'success', message: 'Form response submitted successfully!' })
    setIsFillFormModalOpen(false)
    setFormResponses({})
    setSelectedForm(null)
  }

  const handleCreateForm = () => {
    setIsCreateModalOpen(true)
  }

  const handleAddField = () => {
    setNewForm({ ...newForm, fields: [...newForm.fields, ''] })
  }

  const handleRemoveField = (index) => {
    const updatedFields = newForm.fields.filter((_, i) => i !== index)
    setNewForm({ ...newForm, fields: updatedFields })
  }

  const handleFieldChange = (index, value) => {
    const updatedFields = [...newForm.fields]
    updatedFields[index] = value
    setNewForm({ ...newForm, fields: updatedFields })
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    
    if (!newForm.name.trim()) {
      setToast({ type: 'error', message: 'Form name is required!' })
      return
    }

    const validFields = newForm.fields.filter(f => f.trim())
    if (validFields.length === 0) {
      setToast({ type: 'error', message: 'At least one field is required!' })
      return
    }

    try {
      const formToCreate = {
        name: newForm.name,
        description: newForm.description,
        fields: validFields,
        category: newForm.category
      }

      const response = await formsAPI.create(formToCreate)
      setForms([response.data, ...forms])
      setToast({ type: 'success', message: 'Form created successfully!' })
      setIsCreateModalOpen(false)
      setNewForm({
        name: '',
        description: '',
        category: 'Task',
        fields: ['']
      })
    } catch (error) {
      console.error('Error creating form:', error)
      setToast({ type: 'error', message: 'Failed to create form' })
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forms</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage custom forms for data collection
            </p>
          </div>
          {canEdit && (
            <button 
              onClick={handleCreateForm}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Form
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Forms</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{forms.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Responses</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {forms.reduce((sum, f) => sum + f.responses, 0)}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Forms</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{forms.length}</p>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forms.map(form => (
            <div key={form.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{form.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{form.description}</p>
                  </div>
                </div>
                <Badge variant={getCategoryColor(form.category)}>{form.category}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Fields:</span> {form.fields.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Responses:</span> {form.responses}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Last Used:</span> {form.lastUsed}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleView(form)}
                  className="flex-1 btn-secondary text-sm inline-flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                {canEdit && (
                  <>
                    <button
                      onClick={() => handleDuplicate(form)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(form.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create Form Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false)
            setNewForm({
              name: '',
              description: '',
              category: 'Task',
              fields: ['']
            })
          }}
          title="Create New Form"
        >
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Form Name *
              </label>
              <input
                type="text"
                value={newForm.name}
                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                className="input w-full"
                placeholder="e.g., Bug Report, Feature Request"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                className="input w-full"
                rows={3}
                placeholder="Describe the purpose of this form"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={newForm.category}
                onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                className="input w-full"
              >
                <option value="Task">Task</option>
                <option value="Issue">Issue</option>
                <option value="Enhancement">Enhancement</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Form Fields *
              </label>
              <div className="space-y-2">
                {newForm.fields.map((field, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={field}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      className="input flex-1"
                      placeholder={`Field ${index + 1} name`}
                    />
                    {newForm.fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddField}
                  className="btn-secondary text-sm inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setNewForm({
                    name: '',
                    description: '',
                    category: 'Task',
                    fields: ['']
                  })
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Create Form
              </button>
            </div>
          </form>
        </Modal>

        {/* Form Preview Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedForm(null)
          }}
          title={selectedForm?.name || 'Form Preview'}
        >
          {selectedForm && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">{selectedForm.description}</p>
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Badge variant={getCategoryColor(selectedForm.category)}>{selectedForm.category}</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">Last used: {selectedForm.lastUsed}</span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Form Fields:</h4>
                <div className="space-y-2">
                  {selectedForm.fields.map((field, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{field}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Field {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Responses:</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedForm.responses}</span>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    handleFillForm(selectedForm)
                  }}
                  className="btn-primary w-full"
                >
                  Fill Out This Form
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Fill Form Modal */}
        <Modal
          isOpen={isFillFormModalOpen}
          onClose={() => {
            setIsFillFormModalOpen(false)
            setFormResponses({})
            setSelectedForm(null)
          }}
          title={`Fill Form: ${selectedForm?.name || ''}`}
        >
          {selectedForm && (
            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedForm.description}</p>
              </div>

              {selectedForm.fields.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field} *
                  </label>
                  {field.toLowerCase().includes('description') || field.toLowerCase().includes('feedback') || field.toLowerCase().includes('suggestions') ? (
                    <textarea
                      value={formResponses[field] || ''}
                      onChange={(e) => handleResponseChange(field, e.target.value)}
                      className="input w-full"
                      rows={3}
                      placeholder={`Enter ${field.toLowerCase()}`}
                      required
                    />
                  ) : field.toLowerCase().includes('rating') ? (
                    <select
                      value={formResponses[field] || ''}
                      onChange={(e) => handleResponseChange(field, e.target.value)}
                      className="input w-full"
                      required
                    >
                      <option value="">Select rating</option>
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Good</option>
                      <option value="3">⭐⭐⭐ Average</option>
                      <option value="2">⭐⭐ Below Average</option>
                      <option value="1">⭐ Poor</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formResponses[field] || ''}
                      onChange={(e) => handleResponseChange(field, e.target.value)}
                      className="input w-full"
                      placeholder={`Enter ${field.toLowerCase()}`}
                      required
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFillFormModalOpen(false)
                    setFormResponses({})
                    setSelectedForm(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Submit Response
                </button>
              </div>
            </form>
          )}
        </Modal>

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

export default Forms
