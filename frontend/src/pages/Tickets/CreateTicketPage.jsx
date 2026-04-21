import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'

const CATEGORIES = ['ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'FURNITURE', 'HVAC', 'OTHER']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export default function CreateTicketPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    location: '',
    contactDetails: '',
    resourceId: '',
  })
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files)
    if (selected.length > 3) {
      setError('Maximum 3 images allowed.')
      return
    }
    setFiles(selected)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title || !form.description || !form.category || !form.priority || !form.location) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      if (files.length > 0) {
        const formData = new FormData()
        const ticketBlob = new Blob([JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          priority: form.priority,
          location: form.location,
          contactDetails: form.contactDetails || null,
          resourceId: form.resourceId ? Number(form.resourceId) : null,
        })], { type: 'application/json' })
        formData.append('ticket', ticketBlob)
        files.forEach(file => formData.append('files', file))
        await ticketApi.createTicketWithFiles(formData)
      } else {
        await ticketApi.createTicket({
          title: form.title,
          description: form.description,
          category: form.category,
          priority: form.priority,
          location: form.location,
          contactDetails: form.contactDetails || null,
          resourceId: form.resourceId ? Number(form.resourceId) : null,
        })
      }
      navigate('/tickets/my', { state: { success: 'Ticket submitted successfully!' } })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ticket. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Report an Incident</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          Fill in the details below. Your ticket will be reviewed and assigned to a technician.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl p-6" style={{ border: '1.5px solid #D5DEEF', boxShadow: '0 4px 24px rgba(57,88,134,0.08)' }}>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Broken projector in Lab 304"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#D5DEEF', focusRingColor: '#638ECB' }}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the issue in detail..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: '#D5DEEF' }}
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#D5DEEF' }}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#D5DEEF' }}
                required
              >
                <option value="">Select priority</option>
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Lab 304, Block A"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#D5DEEF' }}
              required
            />
          </div>

          {/* Contact Details */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
              Contact Details
            </label>
            <input
              type="text"
              name="contactDetails"
              value={form.contactDetails}
              onChange={handleChange}
              placeholder="e.g. Phone number or email (optional)"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#D5DEEF' }}
            />
          </div>

          {/* Resource ID */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
              Resource ID (optional)
            </label>
            <input
              type="number"
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              placeholder="Link to a specific resource (optional)"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#D5DEEF' }}
            />
          </div>

          {/* Image Attachments */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
              Attachments (max 3 images)
            </label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#D5DEEF' }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-sm" style={{ color: '#638ECB' }}>
                  📎 Click to upload images
                </div>
                <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                  PNG, JPG, JPEG up to 10MB each
                </div>
              </label>
              {files.length > 0 && (
                <div className="mt-3 space-y-1">
                  {files.map((f, i) => (
                    <div key={i} className="text-xs flex items-center justify-center gap-2" style={{ color: '#395886' }}>
                      ✅ {f.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/tickets/my')}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
              style={{ borderColor: '#D5DEEF', color: '#374151' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-white rounded-lg transition-colors disabled:opacity-50"
              style={{ background: '#395886' }}
            >
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}