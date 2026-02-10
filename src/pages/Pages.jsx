import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContextNew'
import { FileText, Plus, Star, Clock, Edit, Trash2, Share2 } from 'lucide-react'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import { pagesAPI } from '../services/api'

const Pages = () => {
  const { user } = useAuth()
  const [pages, setPages] = useState([])
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPage, setEditingPage] = useState(null)
  const [newPage, setNewPage] = useState({
    title: '',
    content: '',
    tags: ''
  })

  const canEdit = user?.role === 'teacher' || user?.role === 'admin'

  // Fetch pages from API
  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const response = await pagesAPI.getAll()
      setPages(response.data)
    } catch (error) {
      console.error('Error fetching pages:', error)
      setToast({ type: 'error', message: 'Failed to load pages' })
    } finally {
      setLoading(false)
    }
  }

  const filteredPages = pages.filter(page => {
    if (filter === 'starred') return page.starred
    return true
  })

  const toggleStar = async (pageId) => {
    try {
      const page = pages.find(p => p.id === pageId)
      const updates = { starred: !page.starred }
      await pagesAPI.update(pageId, updates)
      setPages(pages.map(p => 
        p.id === pageId ? { ...p, starred: !p.starred } : p
      ))
    } catch (error) {
      console.error('Error updating page:', error)
      setToast({ type: 'error', message: 'Failed to update page' })
    }
  }

  const deletePage = async (pageId) => {
    try {
      await pagesAPI.delete(pageId)
      setPages(pages.filter(page => page.id !== pageId))
      setToast({ type: 'success', message: 'Page deleted successfully!' })
    } catch (error) {
      console.error('Error deleting page:', error)
      setToast({ type: 'error', message: 'Failed to delete page' })
    }
  }

  const handleCreatePage = () => {
    setIsCreateModalOpen(true)
  }

  const handleSubmitPage = async (e) => {
    e.preventDefault()
    
    if (!newPage.title.trim()) {
      setToast({ type: 'error', message: 'Page title is required!' })
      return
    }

    if (!newPage.content.trim()) {
      setToast({ type: 'error', message: 'Page content is required!' })
      return
    }

    try {
      const tagsArray = newPage.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)

      const pageToCreate = {
        title: newPage.title,
        content: newPage.content,
        tags: tagsArray.length > 0 ? tagsArray : ['documentation']
      }

      const response = await pagesAPI.create(pageToCreate)
      setPages([response.data, ...pages])
      setToast({ type: 'success', message: 'Page created successfully!' })
      setIsCreateModalOpen(false)
      setNewPage({
        title: '',
        content: '',
        tags: ''
      })
    } catch (error) {
      console.error('Error creating page:', error)
      setToast({ type: 'error', message: 'Failed to create page' })
    }
  }

  const handleEditPage = (page) => {
    setEditingPage({
      ...page,
      tags: page.tags.join(', ')
    })
    setIsEditModalOpen(true)
  }

  const handleUpdatePage = async (e) => {
    e.preventDefault()
    
    if (!editingPage.title.trim()) {
      setToast({ type: 'error', message: 'Page title is required!' })
      return
    }

    if (!editingPage.content.trim()) {
      setToast({ type: 'error', message: 'Page content is required!' })
      return
    }

    try {
      const tagsArray = editingPage.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)

      const updates = {
        title: editingPage.title,
        content: editingPage.content,
        tags: tagsArray.length > 0 ? tagsArray : ['documentation']
      }

      const response = await pagesAPI.update(editingPage.id, updates)
      setPages(pages.map(page => page.id === editingPage.id ? response.data : page))
      setToast({ type: 'success', message: 'Page updated successfully!' })
      setIsEditModalOpen(false)
      setEditingPage(null)
    } catch (error) {
      console.error('Error updating page:', error)
      setToast({ type: 'error', message: 'Failed to update page' })
    }
  }

  const handleSharePage = (page) => {
    const url = `${window.location.origin}/pages/${page.id}`
    navigator.clipboard.writeText(url)
      .then(() => {
        setToast({ type: 'success', message: 'Page link copied to clipboard!' })
      })
      .catch(() => {
        setToast({ type: 'error', message: 'Failed to copy link' })
      })
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pages</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Project documentation and knowledge base
            </p>
          </div>
          {canEdit && (
            <button 
              onClick={handleCreatePage}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Page
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All Pages ({pages.length})
          </button>
          <button
            onClick={() => setFilter('starred')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${
              filter === 'starred'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Star className="w-4 h-4" />
            Starred ({pages.filter(p => p.starred).length})
          </button>
        </div>

        {/* Pages List */}
        {filteredPages.length > 0 ? (
          <div className="space-y-4">
            {filteredPages.map(page => (
              <div key={page.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {page.title}
                      </h3>
                      <button
                        onClick={() => toggleStar(page.id)}
                        className={`p-1 rounded transition-colors ${
                          page.starred
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${page.starred ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {page.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>By {page.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Updated {page.lastUpdated}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {page.tags.map(tag => (
                          <Badge key={tag} variant="default">{tag}</Badge>
                        ))}
                      </div>

                      {canEdit && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSharePage(page)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Share page"
                          >
                            <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button 
                            onClick={() => handleEditPage(page)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit page"
                          >
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => deletePage(page.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete page"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No pages found"
            description="Create your first page to start documenting your project"
            action={
              canEdit && (
                <button 
                  onClick={handleCreatePage}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Page
                </button>
              )
            }
          />
        )}

        {/* Create Page Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false)
            setNewPage({
              title: '',
              content: '',
              tags: ''
            })
          }}
          title="Create New Page"
        >
          <form onSubmit={handleSubmitPage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page Title *
              </label>
              <input
                type="text"
                value={newPage.title}
                onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                className="input w-full"
                placeholder="e.g., Project Documentation, API Reference"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content *
              </label>
              <textarea
                value={newPage.content}
                onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                className="input w-full"
                rows={8}
                placeholder="Write your page content here...\n\nYou can include:\n- Project documentation\n- Meeting notes\n- Technical guides\n- Design specifications"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={newPage.tags}
                onChange={(e) => setNewPage({ ...newPage, tags: e.target.value })}
                className="input w-full"
                placeholder="e.g., documentation, guide, api"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setNewPage({
                    title: '',
                    content: '',
                    tags: ''
                  })
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Create Page
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Page Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingPage(null)
          }}
          title="Edit Page"
        >
          {editingPage && (
            <form onSubmit={handleUpdatePage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Project Documentation, API Reference"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content *
                </label>
                <textarea
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  className="input w-full"
                  rows={8}
                  placeholder="Write your page content here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingPage.tags}
                  onChange={(e) => setEditingPage({ ...editingPage, tags: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., documentation, guide, api"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate multiple tags with commas
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingPage(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Update Page
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

export default Pages
