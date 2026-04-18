import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']

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
  const [statusUpdate, setStatusUpdate] = useState({ status: '', resolutionNotes: '', rejectionReason: '' })
  const [statusLoading, setStatusLoading] = useState(false)
  const [showStatusForm, setShowStatusForm] = useState(false)

  useEffect(() => { fetchTicket() }, [id])

  const fetchTicket = async () => {
    try {
      const data = await ticketApi.getTicketById(id)
      setTicket(data)
      setStatusUpdate(prev => ({ ...prev, status: data.status }))
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

  const handleStatusUpdate = async () => {
    setStatusLoading(true)
    try {
      await ticketApi.updateTicketStatus(id, {
        status: statusUpdate.status,
        resolutionNotes: statusUpdate.resolutionNotes || null,
        rejectionReason: statusUpdate.rejectionReason || null,
      })
      setShowStatusForm(false)
      fetchTicket()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setStatusLoading(false)
    }
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

  const canUpdateStatus = isAdmin || (isTechnician && ticket?.assignedToId === user?.id)

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
          {canUpdateStatus && (
            <button
              onClick={() => setShowStatusForm(!showStatusForm)}
              className="px-3 py-1.5 text-xs font-bold text-white rounded-lg flex-shrink-0"
              style={{ background: '#638ECB' }}
            >
              Update Status
            </button>
          )}
        </div>

        {/* Status update form */}
        {showStatusForm && canUpdateStatus && (
          <div className="mb-4 p-4 rounded-lg space-y-3" style={{ background: '#F0F3FA', border: '1.5px solid #D5DEEF' }}>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>New Status</label>
              <select
                value={statusUpdate.status}
                onChange={e => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: '#D5DEEF' }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            {statusUpdate.status === 'RESOLVED' && (
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Resolution Notes</label>
                <textarea
                  value={statusUpdate.resolutionNotes}
                  onChange={e => setStatusUpdate(prev => ({ ...prev, resolutionNotes: e.target.value }))}
                  rows={3}
                  placeholder="Describe how the issue was resolved..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ borderColor: '#D5DEEF' }}
                />
              </div>
            )}
            {statusUpdate.status === 'REJECTED' && (
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Rejection Reason</label>
                <textarea
                  value={statusUpdate.rejectionReason}
                  onChange={e => setStatusUpdate(prev => ({ ...prev, rejectionReason: e.target.value }))}
                  rows={3}
                  placeholder="Explain why this ticket is being rejected..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ borderColor: '#D5DEEF' }}
                />
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleStatusUpdate}
                disabled={statusLoading}
                className="px-4 py-2 text-xs font-bold text-white rounded-lg disabled:opacity-50"
                style={{ background: '#395886' }}
              >
                {statusLoading ? 'Saving...' : 'Save Status'}
              </button>
              <button
                onClick={() => setShowStatusForm(false)}
                className="px-4 py-2 text-xs font-bold rounded-lg border"
                style={{ borderColor: '#D5DEEF', color: '#374151' }}
              >
                Cancel
              </button>
            </div>
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