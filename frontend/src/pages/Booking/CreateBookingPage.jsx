import { useState } from 'react'
import { bookingApi } from '../../api/bookingApi'

export default function CreateBookingPage({ onClose, onSuccess }) {

  const [form, setForm] = useState({
    resourceId: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const toISO = (localDateTimeStr) => {
    // Convert datetime-local input value to ISO string for the backend
    return localDateTimeStr ? new Date(localDateTimeStr).toISOString() : null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!form.resourceId || !form.startTime || !form.endTime || !form.purpose) {
      setError('Please fill in all required fields.')
      return
    }
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError('End time must be after start time.')
      return
    }
    if (new Date(form.startTime) <= new Date()) {
      setError('Start time must be in the future.')
      return
    }

    setLoading(true)
    try {
      await bookingApi.createBooking({
        resourceId: Number(form.resourceId),
        startTime: toISO(form.startTime),
        endTime: toISO(form.endTime),
        purpose: form.purpose,
        expectedAttendees: form.expectedAttendees ? Number(form.expectedAttendees) : null,
      })
      if (onSuccess) onSuccess('Booking request submitted successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Blurred background */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto w-[calc(100vw-2rem)] sm:w-auto">
        <div 
          className="px-6 py-5 border-b border-gray-100 sticky top-0 z-10 hidden sm:block"
          style={{
            background: 'linear-gradient(135deg, #4A6FA5 0%, #395886 100%)',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <h2 className="text-xl font-bold text-white">New Booking Request</h2>
          <p className="text-sm text-gray-200 mt-1">
            Fill in the details below. Your request will be reviewed by an admin.
          </p>
        </div>
        <div className="p-6">
          <div className="sm:hidden mb-5">
            <h2 className="text-xl font-bold text-gray-900">New Booking Request</h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details below. Your request will be reviewed by an admin.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Resource ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              placeholder="Enter the resource ID"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">You can find the resource ID in the Facilities Catalogue.</p>
          </div>

          {/* Start & End time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Duration Calculator */}
          {(() => {
            const duration = form.startTime && form.endTime
              ? (() => {
                  const diff = new Date(form.endTime) - new Date(form.startTime)
                  if (diff <= 0) return null
                  const h = Math.floor(diff / 3600000)
                  const m = Math.floor((diff % 3600000) / 60000)
                  return `${h > 0 ? h + 'h ' : ''}${m}min duration`
                })()
              : null
            
            return duration ? (
              <p className="text-xs font-medium text-center" style={{ color: '#638ECB' }}>
                ⏱ {duration}
              </p>
            ) : null
          })()}

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose <span className="text-red-500">*</span>
            </label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              placeholder="Describe the purpose of this booking..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
            <p className="text-xs text-gray-400 mt-1">{form.purpose.length}/500 characters</p>
          </div>

          {/* Expected Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Attendees
            </label>
            <input
              type="number"
              name="expectedAttendees"
              value={form.expectedAttendees}
              onChange={handleChange}
              min={1}
              max={9999}
              placeholder="Optional"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>

        </form>
        </div>
      </div>
    </div>
  )
}