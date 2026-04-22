import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import StatusBadge from '../../components/StatusBadge'

export default function TechnicianTicketsPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchAssignedTickets()
  }, [])

  const fetchAssignedTickets = async () => {
    try {
      const data = await ticketApi.getAssignedTickets()
      setTickets(data)
    } catch (err) {
      setError('Failed to load assigned tickets.')
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = statusFilter ? tickets.filter(t => t.status === statusFilter) : tickets

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Assigned Tickets</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          Tickets assigned to you for resolution.
        </p>
      </div>

      {/* Error */}
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
          <div className="text-5xl mb-4">🔧</div>
          <h3 className="font-bold text-lg mb-2" style={{ color: '#0F172A' }}>No tickets assigned</h3>
          <p className="text-sm" style={{ color: '#64748B' }}>
            You have no tickets assigned to you yet.
          </p>
        </div>
      )}

      {/* Status filter */}
      {!loading && tickets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { label: 'All', value: '' },
            { label: 'Open', value: 'OPEN' },
            { label: 'In Progress', value: 'IN_PROGRESS' },
            { label: 'Resolved', value: 'RESOLVED' },
            { label: 'Closed', value: 'CLOSED' },
            { label: 'Rejected', value: 'REJECTED' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors"
              style={statusFilter === opt.value
                ? { background: 'linear-gradient(135deg, #4A6FA5, #395886)', color: '#fff', borderColor: 'transparent' }
                : { background: '#fff', color: '#374151', borderColor: '#D5DEEF' }
              }
            >
              {opt.label}
              <span className="ml-1.5 opacity-70">
                ({opt.value ? tickets.filter(t => t.status === opt.value).length : tickets.length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Stats bar */}
      {!loading && tickets.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: tickets.length, color: '#395886', bg: '#D5DEEF' },
            { label: 'Open', value: tickets.filter(t => t.status === 'OPEN').length, color: '#638ECB', bg: '#F0F3FA' },
            { label: 'In Progress', value: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: '#D97706', bg: '#FEF3C7' },
            { label: 'Resolved', value: tickets.filter(t => t.status === 'RESOLVED').length, color: '#16A34A', bg: '#F0FDF4' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center"
              style={{ border: '1.5px solid #D5DEEF' }}>
              <p className="text-2xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs font-medium mt-1" style={{ color: '#64748B' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tickets list */}
      {!loading && tickets.length > 0 && (
        <div className="space-y-4">
          {filteredTickets.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl" style={{ border: '1.5px solid #D5DEEF' }}>
              <p className="text-sm" style={{ color: '#64748B' }}>No tickets match this filter.</p>
            </div>
          )}
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="bg-white rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              style={{ border: '1.5px solid #D5DEEF' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono px-2 py-1 rounded"
                      style={{ background: '#F0F3FA', color: '#638ECB' }}>
                      #{ticket.id}
                    </span>
                    <h3 className="font-bold text-base truncate" style={{ color: '#0F172A' }}>
                      {ticket.title}
                    </h3>
                  </div>
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: '#64748B' }}>
                    {ticket.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: '#94A3B8' }}>
                    <span>📍 {ticket.location}</span>
                    <span>🏷️ {ticket.category.replace(/_/g, ' ')}</span>
                    <span>👤 {ticket.reporterName}</span>
                    <span>📅 {formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <StatusBadge status={ticket.status} />
                  <StatusBadge status={ticket.priority} />
                  <span className="text-xs font-bold" style={{ color: '#638ECB' }}>
                    View →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}