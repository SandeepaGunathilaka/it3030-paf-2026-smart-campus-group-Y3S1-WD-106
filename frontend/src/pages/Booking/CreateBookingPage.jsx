import { useState } from 'react'
import { bookingApi } from '../../api/bookingApi'

export default function CreateBookingPage({ onClose, onSuccess, prefillResourceId }) {

  const [form, setForm] = useState({
    resourceId:        prefillResourceId != null ? String(prefillResourceId) : '',
    startTime:         '',
    endTime:           '',
    purpose:           '',
    expectedAttendees: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  // Send the local time string directly to the backend (no UTC conversion).
  // The backend uses LocalDateTime which has no timezone — converting to UTC
  // via toISOString() causes a timezone shift that makes the stored time wrong.
  // datetime-local gives "YYYY-MM-DDTHH:mm" — we just pad seconds and send as-is.
  const toLocalISO = (localDateTimeStr) => {
    if (!localDateTimeStr) return null
    return localDateTimeStr.length === 16 ? localDateTimeStr + ':00' : localDateTimeStr
  }

  // Live duration label
  const duration = (() => {
    if (!form.startTime || !form.endTime) return null
    const diff = new Date(form.endTime) - new Date(form.startTime)
    if (diff <= 0) return null
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return `${h > 0 ? h + 'h ' : ''}${m}min duration`
  })()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

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
        resourceId:        Number(form.resourceId),
        startTime:         toLocalISO(form.startTime),
        endTime:           toLocalISO(form.endTime),
        purpose:           form.purpose,
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

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

        {/* Gradient header — desktop */}
        <div
          className="px-6 py-5 sticky top-0 z-10 hidden sm:block"
          style={{
            background: 'linear-gradient(135deg, #4A6FA5 0%, #395886 100%)',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">New Booking Request</h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Fill in the details below. Your request will be reviewed by an admin.
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">

          {/* Mobile header */}
          <div className="sm:hidden mb-5">
            <h2 className="text-xl font-bold" style={{ color: '#0F172A' }}>New Booking Request</h2>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>
              Fill in the details below. Your request will be reviewed by an admin.
            </p>
          </div>

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

            {/* Resource ID */}
            <div>
              <label className="label">
                Resource ID <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="number"
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                placeholder="Enter the resource ID"
                className="input"
                required
                readOnly={prefillResourceId != null}
                style={prefillResourceId != null ? { background: '#F0F3FA', cursor: 'default' } : {}}
              />
              {prefillResourceId != null ? (
                <p className="text-xs mt-1 font-semibold" style={{ color: '#638ECB' }}>
                  ✓ Resource pre-selected from the catalogue
                </p>
              ) : (
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                  You can find the resource ID in the Facilities Catalogue.
                </p>
              )}
            </div>

            {/* Start & End time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Start Time <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">
                  End Time <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Duration calculator */}
            {duration && (
              <p
                className="text-xs font-semibold text-center py-1.5 rounded-lg"
                style={{ background: '#F0F3FA', color: '#638ECB' }}
              >
                ⏱ {duration}
              </p>
            )}

            {/* Purpose */}
            <div>
              <label className="label">
                Purpose <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                placeholder="Describe the purpose of this booking…"
                className="input resize-none"
                required
              />
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                {form.purpose.length}/500 characters
              </p>
            </div>

            {/* Expected Attendees */}
            <div>
              <label className="label">Expected Attendees</label>
              <input
                type="number"
                name="expectedAttendees"
                value={form.expectedAttendees}
                onChange={handleChange}
                min={1}
                max={9999}
                placeholder="Optional"
                className="input"
              />
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-end gap-3 pt-4 mt-2"
              style={{ borderTop: '1px solid #F0F3FA' }}
            >
              <button
                type="button"
                onClick={onClose}
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
                {loading ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}