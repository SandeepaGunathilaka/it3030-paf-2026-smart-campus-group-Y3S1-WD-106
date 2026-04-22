import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { adminApi } from '../../api/adminApi'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'

const PROGRESS_STEPS = [
  { key: 'OPEN', label: 'Submitted' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'CLOSED', label: 'Closed' },
]

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin, isTechnician } = useAuth()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comment, setComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [actionNote, setActionNote] = useState('')
  const [statusLoading, setStatusLoading] = useState(false)
  const [technicians, setTechnicians] = useState([])
  const [selectedTech, setSelectedTech] = useState('')
  const [showAssign, setShowAssign] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)

  useEffect(() => { fetchTicket() }, [id])

  useEffect(() => {
    if (isAdmin) {
      adminApi.getUsers()
        .then(users => setTechnicians(users.filter(u => u.role === 'TECHNICIAN')))
        .catch(() => {})
    }
  }, [isAdmin])

  const fetchTicket = async () => {
    try {
      const data = await ticketApi.getTicketById(id)
      setTicket(data)
    } catch (err) {
      setError('Failed to load ticket.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

  const handleAddComment = async () => {
    if (!comment.trim()) return
    setCommentLoading(true)
    try {
      await ticketApi.addComment(id, comment)
      setComment('')
      fetchTicket()
    } catch (err) {
      setError('Failed to add comment.')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleEditComment = async (commentId) => {
    try {
      await ticketApi.editComment(id, commentId, editContent)
      setEditingCommentId(null)
      fetchTicket()
    } catch (err) {
      setError('Failed to edit comment.')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await ticketApi.deleteComment(id, commentId)
      fetchTicket()
    } catch (err) {
      setError('Failed to delete comment.')
    }
  }

  const handleStatusUpdate = async (targetStatus) => {
    setStatusLoading(true)
    try {
      await ticketApi.updateTicketStatus(id, {
        status: targetStatus,
        resolutionNotes: targetStatus === 'RESOLVED' ? actionNote || null : null,
        rejectionReason: targetStatus === 'REJECTED' ? actionNote || null : null,
      })
      setPendingAction(null)
      setActionNote('')
      fetchTicket()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setStatusLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedTech) return
    setAssignLoading(true)
    try {
      await ticketApi.assignTechnician(id, Number(selectedTech))
      setShowAssign(false)
      setSelectedTech('')
      fetchTicket()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign technician.')
    } finally {
      setAssignLoading(false)
    }
  }

  const getAdminActions = (status) => {
    if (status === 'OPEN') return [
      { to: 'IN_PROGRESS', label: 'Accept Ticket', style: { background: 'linear-gradient(135deg,#16A34A,#15803D)', color: '#fff' }, noteLabel: null },
      { to: 'REJECTED',    label: 'Reject Ticket', style: { background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff' }, noteLabel: 'Rejection reason (optional)' },
    ]
    if (status === 'RESOLVED') return [
      { to: 'CLOSED', label: 'Close Ticket', style: { background: 'linear-gradient(135deg,#4A6FA5,#395886)', color: '#fff' }, noteLabel: null },
    ]
    return []
  }

  const getTechnicianActions = (status) => {
    if (status === 'IN_PROGRESS') return [
      { to: 'RESOLVED', label: 'Mark as Resolved', style: { background: 'linear-gradient(135deg,#16A34A,#15803D)', color: '#fff' }, noteLabel: 'Resolution notes (optional)' },
    ]
    return []
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#638ECB' }} />
    </div>
  )

  if (error && !ticket) return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
    </div>
  )

  const isAssignedTech = isTechnician && ticket?.assignedToId === user?.id
  const adminActions = isAdmin ? getAdminActions(ticket?.status) : []
  const techActions = isAssignedTech ? getTechnicianActions(ticket?.status) : []
  const allActions = [...adminActions, ...techActions]

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm flex items-center gap-1 hover:underline"
        style={{ color: '#638ECB' }}
      >
        ← Back
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Ticket Header */}
      <div className="bg-white rounded-xl p-6" style={{ border: '1.5px solid #D5DEEF' }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: '#F0F3FA', color: '#638ECB' }}>
                #{ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
              <StatusBadge status={ticket.priority} />
            </div>
            <h1 className="text-xl font-bold" style={{ color: '#0F172A' }}>{ticket.title}</h1>
          </div>
        </div>

        {/* Progress tracker — regular users only */}
        {!isAdmin && !isTechnician && ticket.status !== 'REJECTED' && (
          <div className="mb-5 px-1">
            <div className="flex items-center">
              {PROGRESS_STEPS.map((step, i) => {
                const stepIdx = PROGRESS_STEPS.findIndex(s => s.key === ticket.status)
                const done = i < stepIdx
                const active = i === stepIdx
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full transition-all"
                        style={{
                          background: active ? '#395886' : done ? '#638ECB' : '#CBD5E1',
                          boxShadow: active ? '0 0 0 3px rgba(57,88,134,0.18)' : 'none',
                        }}
                      />
                      <span className="text-xs whitespace-nowrap" style={{ color: active ? '#395886' : done ? '#638ECB' : '#94A3B8', fontWeight: active ? 600 : 400 }}>
                        {step.label}
                      </span>
                    </div>
                    {i < PROGRESS_STEPS.length - 1 && (
                      <div className="flex-1 h-px mx-2 mb-4" style={{ background: done ? '#638ECB' : '#E2E8F0' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Rejected notice — regular users */}
        {!isAdmin && !isTechnician && ticket.status === 'REJECTED' && (
          <div className="mb-5 rounded-lg px-4 py-3 flex items-center gap-3" style={{ background: '#FFF1F2', border: '1px solid #FECDD3' }}>
            <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: '#E11D48' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#BE123C' }}>Ticket Rejected</p>
              <p className="text-xs mt-0.5" style={{ color: '#9F1239' }}>
                {ticket.rejectionReason || 'This ticket was not accepted.'}
              </p>
            </div>
          </div>
        )}

        {/* Assign technician — admin only */}
        {isAdmin && ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED' && (
          <div className="mb-4">
            {!showAssign ? (
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: '#64748B' }}>
                  {ticket.assignedToName
                    ? <>Assigned to <span className="font-semibold" style={{ color: '#395886' }}>{ticket.assignedToName}</span></>
                    : <span style={{ color: '#94A3B8' }}>No technician assigned</span>
                  }
                </span>
                <button
                  onClick={() => { setShowAssign(true); setSelectedTech('') }}
                  className="px-3 py-1 text-xs font-bold rounded-lg border transition-colors hover:opacity-80"
                  style={{ borderColor: '#D5DEEF', color: '#395886', background: '#F0F3FA' }}
                >
                  {ticket.assignedToName ? 'Reassign' : 'Assign Technician'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedTech}
                  onChange={e => setSelectedTech(e.target.value)}
                  className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                  style={{ borderColor: '#D5DEEF', color: '#374151' }}
                >
                  <option value="">Select technician…</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={assignLoading || !selectedTech}
                  className="px-3 py-1.5 text-xs font-bold text-white rounded-lg disabled:opacity-50 transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#4A6FA5,#395886)' }}
                >
                  {assignLoading ? 'Assigning…' : 'Confirm'}
                </button>
                <button
                  onClick={() => setShowAssign(false)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border"
                  style={{ borderColor: '#D5DEEF', color: '#374151' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action buttons — admin / technician */}
        {allActions.length > 0 && (
          <div className="mb-5 space-y-3">
            <div className="flex flex-wrap gap-3">
              {allActions.map(action => (
                <button
                  key={action.to}
                  onClick={() => { setPendingAction(action.to); setActionNote('') }}
                  className="px-4 py-2 text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:opacity-90 disabled:opacity-50"
                  style={action.style}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {pendingAction && (
              <div className="rounded-xl p-4 space-y-3" style={{ background: '#F8FAFC', border: '1.5px solid #D5DEEF' }}>
                <p className="text-sm font-bold" style={{ color: '#0F172A' }}>
                  Confirm: {allActions.find(a => a.to === pendingAction)?.label}
                </p>
                {allActions.find(a => a.to === pendingAction)?.noteLabel && (
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>
                      {allActions.find(a => a.to === pendingAction).noteLabel}
                    </label>
                    <textarea
                      value={actionNote}
                      onChange={e => setActionNote(e.target.value)}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                      style={{ borderColor: '#D5DEEF' }}
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(pendingAction)}
                    disabled={statusLoading}
                    className="px-4 py-2 text-xs font-bold text-white rounded-lg disabled:opacity-50"
                    style={allActions.find(a => a.to === pendingAction)?.style}
                  >
                    {statusLoading ? 'Saving…' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => { setPendingAction(null); setActionNote('') }}
                    className="px-4 py-2 text-xs font-bold rounded-lg border"
                    style={{ borderColor: '#D5DEEF', color: '#374151' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ticket details grid */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>Category</p>
            <p style={{ color: '#0F172A' }}>{ticket.category.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>Location</p>
            <p style={{ color: '#0F172A' }}>📍 {ticket.location}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>Reported By</p>
            <p style={{ color: '#0F172A' }}>{ticket.reporterName}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>Assigned To</p>
            <p style={{ color: '#0F172A' }}>{ticket.assignedToName || 'Not assigned yet'}</p>
          </div>
          {ticket.contactDetails && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>Contact</p>
              <p style={{ color: '#0F172A' }}>{ticket.contactDetails}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>Created</p>
            <p style={{ color: '#0F172A' }}>{formatDate(ticket.createdAt)}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#94A3B8' }}>Description</p>
          <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{ticket.description}</p>
        </div>

        {/* Resolution notes */}
        {ticket.resolutionNotes && (
          <div className="p-3 rounded-lg mb-4" style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#16A34A' }}>Resolution Notes</p>
            <p className="text-sm" style={{ color: '#374151' }}>{ticket.resolutionNotes}</p>
          </div>
        )}

        {/* Rejection reason */}
        {ticket.rejectionReason && (
          <div className="p-3 rounded-lg mb-4" style={{ background: '#FFF1F2', border: '1.5px solid #FECDD3' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#E11D48' }}>Rejection Reason</p>
            <p className="text-sm" style={{ color: '#374151' }}>{ticket.rejectionReason}</p>
          </div>
        )}

        {/* Attachments */}
        {ticket.attachments?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#94A3B8' }}>
              Attachments ({ticket.attachments.length})
            </p>
            <div className="flex flex-wrap gap-3">
              {ticket.attachments.map(att => (
                <a key={att.id} href={att.fileUrl} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={att.fileUrl}
                    alt={att.fileName}
                    className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                    style={{ border: '1.5px solid #D5DEEF' }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl p-6" style={{ border: '1.5px solid #D5DEEF' }}>
        <h2 className="font-bold text-base mb-4" style={{ color: '#0F172A' }}>
          Comments ({ticket.comments?.length || 0})
        </h2>

        {/* Comments list */}
        <div className="space-y-4 mb-6">
          {ticket.comments?.length === 0 && (
            <p className="text-sm" style={{ color: '#94A3B8' }}>No comments yet. Be the first to comment!</p>
          )}
          {ticket.comments?.map(c => (
            <div key={c.id} className="p-4 rounded-lg" style={{ background: '#F0F3FA', border: '1.5px solid #D5DEEF' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: '#638ECB' }}
                  >
                    {c.authorName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#0F172A' }}>{c.authorName}</span>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>{formatDate(c.createdAt)}</span>
                </div>
                {(c.authorId === user?.id || isAdmin) && (
                  <div className="flex gap-2">
                    {c.authorId === user?.id && (
                      <button
                        onClick={() => { setEditingCommentId(c.id); setEditContent(c.content) }}
                        className="text-xs hover:underline"
                        style={{ color: '#638ECB' }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-xs hover:underline"
                      style={{ color: '#E11D48' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {editingCommentId === c.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                    style={{ borderColor: '#D5DEEF' }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(c.id)}
                      className="px-3 py-1.5 text-xs font-bold text-white rounded-lg"
                      style={{ background: '#395886' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border"
                      style={{ borderColor: '#D5DEEF', color: '#374151' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm" style={{ color: '#374151' }}>{c.content}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add comment */}
        <div className="space-y-3">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="Add a comment..."
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
            style={{ borderColor: '#D5DEEF' }}
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddComment}
              disabled={commentLoading || !comment.trim()}
              className="px-4 py-2 text-sm font-bold text-white rounded-lg disabled:opacity-50"
              style={{ background: '#395886' }}
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}