import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { adminApi } from '../../api/adminApi'
import StatusBadge from '../../components/StatusBadge'

const STATUSES = ['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']
const PRIORITIES = ['', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const CATEGORIES = ['', 'ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'FURNITURE', 'HVAC', 'OTHER']

export default function AdminTicketsPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' })
  const [assigningTicketId, setAssigningTicketId] = useState(null)
  const [selectedTechnician, setSelectedTechnician] = useState('')
  const [assignLoading, setAssignLoading] = useState(false)

  useEffect(() => {
    fetchTickets()
    fetchTechnicians()
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [filters])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.status) params.status = filters.status
      if (filters.priority) params.priority = filters.priority
      if (filters.category) params.category = filters.category
      const data = await ticketApi.getAllTickets(params)
      setTickets(data)
    } catch (err) {
      setError('Failed to load tickets.')
    } finally {
      setLoading(false)
    }
  }

  const fetchTechnicians = async () => {
    try {
      const data = await adminApi.getUsers()
      setTechnicians(data.filter(u => u.role === 'TECHNICIAN'))
    } catch (err) {
      console.error('Failed to load technicians')
    }
  }

  const handleAssign = async (ticketId) => {
    if (!selectedTechnician) return
    setAssignLoading(true)
    try {
      await ticketApi.assignTechnician(ticketId, Number(selectedTechnician))
      setAssigningTicketId(null)
      setSelectedTechnician('')
      fetchTickets()
    } catch (err) {
      setError('Failed to assign technician.')
    } finally {
      setAssignLoading(false)
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>All Tickets</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          Manage and assign all maintenance and incident tickets.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Summary stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: tickets.length, color: '#395886', bg: '#D5DEEF' },
            { label: 'Open', value: tickets.filter(t => t.status === 'OPEN').length, color: '#638ECB', bg: '#F0F3FA' },
            { label: 'In Progress', value: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: '#D97706', bg: '#FEF3C7' },
            { label: 'Resolved', value: tickets.filter(t => t.status === 'RESOLVED').length, color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Closed / Rejected', value: tickets.filter(t => t.status === 'CLOSED' || t.status === 'REJECTED').length, color: '#64748B', bg: '#F1F5F9' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center"
              style={{ border: '1.5px solid #D5DEEF' }}>
              <p className="text-2xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs font-medium mt-1" style={{ color: '#64748B' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-4"
        style={{ border: '1.5px solid #D5DEEF' }}>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Status</label>
          <select
            value={filters.status}
            onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ borderColor: '#D5DEEF' }}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s ? s.replace(/_/g, ' ') : 'All Statuses'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Priority</label>
          <select
            value={filters.priority}
            onChange={e => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ borderColor: '#D5DEEF' }}
          >
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p || 'All Priorities'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Category</label>
          <select
            value={filters.category}
            onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ borderColor: '#D5DEEF' }}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c ? c.replace(/_/g, ' ') : 'All Categories'}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => setFilters({ status: '', priority: '', category: '' })}
            className="px-4 py-2 text-sm font-bold rounded-lg border"
            style={{ borderColor: '#D5DEEF', color: '#374151' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

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
          <h3 className="font-bold text-lg mb-2" style={{ color: '#0F172A' }}>No tickets found</h3>
          <p className="text-sm" style={{ color: '#64748B' }}>Try adjusting your filters.</p>
        </div>
      )}

      {/* Tickets table */}
      {!loading && tickets.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1.5px solid #D5DEEF' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #4A6FA5 0%, #395886 100%)' }}>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>ID</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>Title</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>Priority</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>Reporter</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>Assigned To</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>Date</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  style={{ borderBottom: '1px solid #F0F3FA', background: index % 2 === 0 ? 'white' : '#FAFBFD' }}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: '#F0F3FA', color: '#638ECB' }}>
                      #{ticket.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[180px]" style={{ color: '#0F172A' }}>{ticket.title}</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>📍 {ticket.location}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.priority} />
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#374151' }}>
                    {ticket.reporterName}
                  </td>
                  <td className="px-4 py-3">
                    {assigningTicketId === ticket.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedTechnician}
                          onChange={e => setSelectedTechnician(e.target.value)}
                          className="border rounded px-2 py-1 text-xs focus:outline-none"
                          style={{ borderColor: '#D5DEEF' }}
                        >
                          <option value="">Select technician</option>
                          {technicians.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(ticket.id)}
                          disabled={assignLoading || !selectedTechnician}
                          className="text-xs font-bold text-white px-2 py-1 rounded disabled:opacity-50"
                          style={{ background: '#395886' }}
                        >
                          {assignLoading ? '...' : 'Assign'}
                        </button>
                        <button
                          onClick={() => setAssigningTicketId(null)}
                          className="text-xs"
                          style={{ color: '#94A3B8' }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: ticket.assignedToName ? '#395886' : '#94A3B8' }}>
                          {ticket.assignedToName || 'Unassigned'}
                        </span>
                        <button
                          onClick={() => { setAssigningTicketId(ticket.id); setSelectedTechnician('') }}
                          className="text-xs hover:underline"
                          style={{ color: '#638ECB' }}
                        >
                          {ticket.assignedToName ? 'Change' : 'Assign'}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94A3B8' }}>
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className="text-xs font-bold hover:underline"
                      style={{ color: '#638ECB' }}
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}