import api from './axiosConfig'
// API for fetching notifications, unread count, marking as read, and marking all as read.
export const notificationApi = {
  getAll: () => api.get('/notifications').then(r => r.data),
  getUnreadCount: () => api.get('/notifications/unread-count').then(r => r.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllAsRead: () => api.patch('/notifications/read-all').then(r => r.data),
}
