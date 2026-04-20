import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import StatusBadge from '../../components/StatusBadge'

export default function MyTicketsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(location.state?.success || '')

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const data = await ticketApi.getMyTickets()
      setTickets(data)
    } catch (err) {
      setError('Failed to load tickets.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>My Tickets</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Track all your maintenance and incident reports.
          </p>
        </div>
        <button
          onClick={() => navigate('/tickets/create')}
          className="px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors hover:opacity-90"
          style={{ background: '#395886' }}
        >
          + New Ticket
        </button>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex justify-between">
          {success}
          <button onClick={() => setSuccess('')}>✕</button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#638ECB' }} />
        </div>
      )}

      {/* Empty state */}
      {!loading && tickets.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl" style={{ border: '1.5px solid #D5DEEF' }}>
          <div className="text-5xl mb-4">🎫</div>
          <h3 className="font-bold text-lg mb-2" style={{ color: '#0F172A' }}>No tickets yet</h3>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>
            Report an issue and we'll get it resolved quickly.
          </p>
          <button
            onClick={() => navigate('/tickets/create')}
            className="px-5 py-2 text-sm font-bold text-white rounded-lg"
            style={{ background: '#395886' }}
          >
            Report an Issue
          </button>
        </div>
      )}

      {/* Tickets list */}
      {!loading && tickets.length > 0 && (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="bg-white rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              style={{ border: '1.5px solid #D5DEEF' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-base truncate" style={{ color: '#0F172A' }}>
                      {ticket.title}
                    </h3>
                    <StatusBadge status={ticket.status} />
                    <StatusBadge status={ticket.priority} />
                  </div>
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: '#64748B' }}>
                    {ticket.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: '#94A3B8' }}>
                    <span>📍 {ticket.location}</span>
                    <span>🏷️ {ticket.category.replace(/_/g, ' ')}</span>
                    <span>📅 {formatDate(ticket.createdAt)}</span>
                    {ticket.attachments?.length > 0 && (
                      <span>📎 {ticket.attachments.length} attachment(s)</span>
                    )}
                    {ticket.comments?.length > 0 && (
                      <span>💬 {ticket.comments.length} comment(s)</span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: '#F0F3FA', color: '#638ECB' }}>
                    #{ticket.id}
                  </span>
                  {ticket.assignedToName && (
                    <p className="text-xs mt-2" style={{ color: '#638ECB' }}>
                      👷 {ticket.assignedToName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}