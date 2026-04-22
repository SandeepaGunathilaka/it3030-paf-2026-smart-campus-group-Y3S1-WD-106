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
    const { name, value } = e.target
    if (name === 'resourceId') {
      if (value !== '' && (!/^\d+$/.test(value) || value.length > 4)) return
    }
    setForm(prev => ({ ...prev, [name]: value }))
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
    if (form.resourceId && (!/^\d+$/.test(form.resourceId) || form.resourceId.length < 3 || form.resourceId.length > 4)) {
      setError('Resource ID must be a 3–4 digit number.')
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

      {/* Gradient header */}
      <div
        className="px-6 py-5 rounded-t-2xl hidden sm:block"
        style={{ background: 'linear-gradient(135deg, #4A6FA5 0%, #395886 100%)' }}
      >
        <h1 className="text-xl font-bold text-white">Report an Incident</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Fill in the details below. Your ticket will be reviewed and assigned to a technician.
        </p>
      </div>

      {/* Mobile header */}
      <div className="sm:hidden mb-5">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Report an Incident</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          Fill in the details below. Your ticket will be reviewed and assigned to a technician.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-b-2xl sm:rounded-t-none rounded-2xl shadow-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Error banner */}
          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}
            >
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="label">
              Title <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Broken projector in Lab 304"
              className="input"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">
              Description <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the issue in detail..."
              className="input resize-none"
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Category <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">
                Priority <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input"
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
            <label className="label">
              Location <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Lab 304, Block A"
              className="input"
              required
            />
          </div>

          {/* Contact Details */}
          <div>
            <label className="label">Contact Details</label>
            <input
              type="text"
              name="contactDetails"
              value={form.contactDetails}
              onChange={handleChange}
              placeholder="Email or phone number"
              className="input"
            />
          </div>

          {/* Resource ID */}
          <div>
            <label className="label">Resource ID</label>
            <input
              type="text"
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              placeholder="Enter resource ID (optional)"
              maxLength={4}
              className="input"
            />
            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Must be a 3–4 digit number</p>
          </div>

          {/* Image Attachments */}
          <div>
            <label className="label">Attachments (max 3 images)</label>
            <div className="border-2 border-dashed rounded-xl p-4 text-center" style={{ borderColor: '#D5DEEF' }}>
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
          <div
            className="flex items-center justify-end gap-3 pt-4 mt-2"
            style={{ borderTop: '1px solid #F0F3FA' }}
          >
            <button
              type="button"
              onClick={() => navigate('/tickets/my')}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #4A6FA5, #395886)' }}
            >
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}