import { useEffect, useState } from 'react'
import { notificationApi } from '../api/notificationApi'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const typeColors = {
  BOOKING_APPROVED: 'bg-green-100 text-green-800',
  BOOKING_REJECTED: 'bg-red-100 text-red-800',
  BOOKING_CANCELLED: 'bg-yellow-100 text-yellow-800',
  TICKET_STATUS_CHANGED: 'bg-blue-100 text-blue-800',
  TICKET_COMMENT_ADDED: 'bg-purple-100 text-purple-800',
  TICKET_ASSIGNED: 'bg-orange-100 text-orange-800',
}

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationApi.getAll()
      .then(setNotifications)
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false))
  }, [])

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch {}
  }

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      onClose()
    } catch {}
  }

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <div className="flex gap-2">
          <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">
            Mark all read
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-96">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm">No notifications</p>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markAsRead(n.id)}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-xs ${typeColors[n.type] || 'bg-gray-100 text-gray-700'}`}>
                      {n.type.replace(/_/g, ' ')}
                    </span>
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
