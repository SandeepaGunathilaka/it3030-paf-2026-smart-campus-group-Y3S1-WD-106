import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CreateBookingPage from './CreateBookingPage'
import { bookingApi } from '../../api/bookingApi'
import api from '../../api/axiosConfig'

const STATUS_STYLES = {
  PENDING:   { bg: '#FFF8E7', color: '#B45309', border: '#FDE68A' },
  APPROVED:  { bg: '#F0F3FA', color: '#395886', border: '#B1C9EF' },
  REJECTED:  { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
  CANCELLED: { bg: '#F9FAFB', color: '#6B7280', border: '#E5E7EB' },
}

// #1 — Per-status accent colors for summary cards
const SUMMARY_COLORS = {
  PENDING:   '#B45309',
  APPROVED:  '#395886',
  REJECTED:  '#991B1B',
  CANCELLED: '#6B7280',
}

function formatDateTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// #7 — Status timeline mini-component
const TIMELINE_STEPS = ['PENDING', 'APPROVED', 'IN USE', 'DONE']
function StatusTimeline({ status }) {
  const activeIdx = {
    PENDING:   0,
    APPROVED:  1,
    CANCELLED: 1, // stays at APPROVED step but won't highlight further
    REJECTED:  1,
    IN_USE:    2,
    DONE:      3,
  }[status] ?? 0

  const isFailed = status === 'REJECTED' || status === 'CANCELLED'

  return (
    <div className="flex items-center gap-1 mt-2">
      {TIMELINE_STEPS.map((step, idx) => {
        const isActive  = idx === activeIdx && !isFailed
        const isDone    = idx < activeIdx && !isFailed
        const isFail    = isFailed && idx === activeIdx
        const dotColor  = isDone ? '#395886' : isActive ? STATUS_STYLES[status]?.color || '#395886' : isFail ? STATUS_STYLES[status]?.color || '#991B1B' : '#D1D5DB'
        const lineColor = isDone ? '#395886' : '#E5E7EB'

        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-0.5">
              <div
                style={{
                  width: isActive || isFail ? 10 : 7,
                  height: isActive || isFail ? 10 : 7,
                  borderRadius: '50%',
                  background: dotColor,
                  border: isActive || isFail ? `2px solid ${dotColor}` : 'none',
                  boxShadow: isActive ? `0 0 0 3px ${dotColor}22` : 'none',
                  transition: 'all 0.2s',
                }}
              />
              <span style={{ fontSize: 8, color: isActive ? dotColor : '#9CA3AF', fontWeight: isActive ? 700 : 400, whiteSpace: 'nowrap' }}>
                {step}
              </span>
            </div>
            {idx < TIMELINE_STEPS.length - 1 && (
              <div style={{ width: 20, height: 1.5, background: lineColor, marginBottom: 10, borderRadius: 2 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function MyBookingsPage() {
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [successMsg, setSuccessMsg] = useState(location.state?.success || '')
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmCancelId, setConfirmCancelId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  // #2 — Resource name lookup map
  const [resourceNames, setResourceNames] = useState({})

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

      // #2 — Fetch resource names for all unique resource IDs
      const ids = [...new Set(data.map(b => b.resourceId))]
      const names = {}
      await Promise.allSettled(
        ids.map(id =>
          api.get(`/resources/${id}`)
            .then(r => { names[id] = r.data.name })
            .catch(() => { names[id] = `Resource #${id}` })
        )
      )
      setResourceNames(names)
    } catch {
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    setCancellingId(id)
    try {
      await bookingApi.cancelBooking(id)
      setSuccessMsg('Booking cancelled successfully.')
      setConfirmCancelId(null)
      fetchBookings()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.')
    } finally {
      setCancellingId(null)
    }
  }

  const canCancel = (status) => status === 'PENDING' || status === 'APPROVED'

  // Summary counts
  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Track the status of your booking requests.</p>
        </div>
        {/* #3 — Brand gradient button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #4A6FA5, #395886)' }}
        >
          + New Booking
        </button>
      </div>

      {/* Summary cards — #1 color-coded per status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
          <div
            key={s}
            className="bg-white rounded-lg border border-gray-200 p-4"
            style={{ borderLeft: `3px solid ${SUMMARY_COLORS[s]}` }}
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide">{s}</p>
            <p className="text-2xl font-semibold mt-1" style={{ color: SUMMARY_COLORS[s] }}>
              {counts[s] || 0}
            </p>
          </div>
        ))}
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
        <div className="text-center py-16 bg-white rounded-2xl" style={{ border: '1.5px solid #D5DEEF' }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
               style={{ background: '#F0F3FA' }}>
            <svg className="w-8 h-8" style={{ color: '#638ECB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">No bookings yet</p>
          <p className="text-gray-400 text-xs mb-4">Create your first booking to get started</p>
          <button onClick={() => setShowCreateModal(true)}
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg, #4A6FA5, #395886)' }}>
            + New Booking
          </button>
        </div>
      )}

      {/* Bookings list */}
      {!loading && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map(booking => (
            // #4 — Left-side status stripe
            <div
              key={booking.id}
              className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-hidden"
              style={{
                border: '1px solid #D5DEEF',
                borderLeftWidth: '4px',
                borderLeftColor: STATUS_STYLES[booking.status]?.border || '#D5DEEF',
              }}
            >
              {/* Left: info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {/* #2 — Show resource name instead of ID */}
                    {resourceNames[booking.resourceId] || `Resource #${booking.resourceId}`}
                  </span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: STATUS_STYLES[booking.status]?.bg,
                      color: STATUS_STYLES[booking.status]?.color,
                      border: `1px solid ${STATUS_STYLES[booking.status]?.border}`
                    }}
                  >
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
                {/* #7 — Status timeline */}
                <StatusTimeline status={booking.status} />
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400">
                  {formatDateTime(booking.createdAt).split(',')[0]}
                </span>
                {canCancel(booking.status) && (
                  confirmCancelId === booking.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-medium">Are you sure?</span>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmCancelId(null)}
                        disabled={cancellingId === booking.id}
                        className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmCancelId(booking.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )
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