import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CreateBookingPage from './CreateBookingPage'
import { bookingApi } from '../../api/bookingApi'

const STATUS_STYLES = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  APPROVED:  'bg-green-100  text-green-800',
  REJECTED:  'bg-red-100    text-red-800',
  CANCELLED: 'bg-gray-100   text-gray-600',
}

function formatDateTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function MyBookingsPage() {
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [successMsg, setSuccessMsg] = useState(location.state?.success || '')
  const [cancellingId, setCancellingId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  // Auto-clear success banner after 4 seconds
  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(''), 4000)
    return () => clearTimeout(t)
  }, [successMsg])

  const fetchBookings = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await bookingApi.getMyBookings()
      setBookings(data)
    } catch {
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(id)
    try {
      await bookingApi.cancelBooking(id)
      setSuccessMsg('Booking cancelled successfully.')
      fetchBookings()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.')
    } finally {
      setCancellingId(null)
    }
  }

  const canCancel = (status) => status === 'PENDING' || status === 'APPROVED'

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Track the status of your booking requests.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Booking
        </button>
      </div>

      {/* Banners */}
      {successMsg && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* Empty state */}
      {!loading && bookings.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 text-sm mb-3">You have no bookings yet.</p>
          <button onClick={() => setShowCreateModal(true)} className="text-blue-600 text-sm font-medium hover:underline">
            Create your first booking →
          </button>
        </div>
      )}

      {/* Bookings list */}
      {!loading && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map(booking => (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              {/* Left: info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">
                    Resource #{booking.resourceId}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{booking.purpose}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
                </p>
                {booking.expectedAttendees && (
                  <p className="text-xs text-gray-400">
                    {booking.expectedAttendees} attendee{booking.expectedAttendees > 1 ? 's' : ''}
                  </p>
                )}
                {booking.adminNote && (
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Admin note: {booking.adminNote}
                  </p>
                )}
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400">
                  {formatDateTime(booking.createdAt).split(',')[0]}
                </span>
                {canCancel(booking.status) && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateBookingPage 
          onClose={() => setShowCreateModal(false)}
          onSuccess={(msg) => {
            setShowCreateModal(false)
            fetchBookings()
            setSuccessMsg(msg)
          }}
        />
      )}
    </div>
  )
}