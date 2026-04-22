import { useState, useEffect } from 'react'
import { bookingApi } from '../../api/bookingApi'

const STATUS_STYLES = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  APPROVED:  'bg-green-100  text-green-800',
  REJECTED:  'bg-red-100    text-red-800',
  CANCELLED: 'bg-gray-100   text-gray-600',
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

// Modal for approve/reject with optional note
function ActionModal({ booking, action, onConfirm, onClose }) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const isReject = action === 'reject'

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm(booking.id, note)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          {isReject ? 'Reject Booking' : 'Approve Booking'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Resource #{booking.resourceId} — {booking.userName}
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isReject ? 'Reason (required for rejection)' : 'Admin note (optional)'}
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder={isReject ? 'Provide a reason for rejection...' : 'Add an optional note...'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (isReject && !note.trim())}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-colors ${
              isReject
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Processing...' : isReject ? 'Reject' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminBookingsPage() {
  const [bookings, setBookings]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [successMsg, setSuccessMsg]     = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal]               = useState(null) // { booking, action }

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(''), 4000)
    return () => clearTimeout(t)
  }, [successMsg])

  const fetchBookings = async () => {
    setLoading(true)
    setError('')
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const data = await bookingApi.getAllBookings(params)
      setBookings(data)
    } catch {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id, note) => {
    try {
      await bookingApi.approveBooking(id, note)
      setSuccessMsg('Booking approved successfully.')
      setModal(null)
      fetchBookings()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve booking.')
      setModal(null)
    }
  }

  const handleReject = async (id, note) => {
    try {
      await bookingApi.rejectBooking(id, note)
      setSuccessMsg('Booking rejected.')
      setModal(null)
      fetchBookings()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject booking.')
      setModal(null)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await bookingApi.cancelBooking(id)
      setSuccessMsg('Booking cancelled.')
      fetchBookings()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.')
    }
  }

  // Summary counts
  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-sm text-gray-500 mt-1">Review, approve, or reject booking requests.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
          <div
            key={s}
            className="bg-white rounded-lg border border-gray-200 p-4"
            style={{ borderLeft: `3px solid ${SUMMARY_COLORS[s]}` }}
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide">{s}</p>
            <p className="text-2xl font-semibold mt-1" style={{ color: SUMMARY_COLORS[s] }}>{counts[s] || 0}</p>
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

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-gray-600">Filter by status:</span>
        {['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              statusFilter === s
                ? 'text-white border-transparent'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
            style={statusFilter === s
              ? { background: 'linear-gradient(135deg, #4A6FA5, #395886)', border: 'none' }
              : {}}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* Empty state */}
      {!loading && bookings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 text-sm">No bookings found.</p>
        </div>
      )}

      {/* Table */}
      {!loading && bookings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Resource</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time Slot</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Purpose</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">#{booking.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{booking.userName}</p>
                      <p className="text-xs text-gray-400">{booking.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">#{booking.resourceId}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <p>{formatDateTime(booking.startTime)}</p>
                      <p className="text-xs text-gray-400">→ {formatDateTime(booking.endTime)}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="truncate">{booking.purpose}</p>
                      {booking.adminNote && (
                        <p className="text-xs text-gray-400 italic mt-0.5">Note: {booking.adminNote}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => setModal({ booking, action: 'approve' })}
                              className="px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setModal({ booking, action: 'reject' })}
                              className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status !== 'PENDING' &&
                          booking.status !== 'APPROVED' && (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approve / Reject modal */}
      {modal && (
        <ActionModal
          booking={modal.booking}
          action={modal.action}
          onConfirm={modal.action === 'approve' ? handleApprove : handleReject}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}