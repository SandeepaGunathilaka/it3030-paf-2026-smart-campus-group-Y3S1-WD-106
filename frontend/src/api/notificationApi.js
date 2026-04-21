import api from './axiosConfig'

export const notificationApi = {
  getAll:           ()           => api.get('/notifications').then(r => r.data),
  getUnreadCount:   ()           => api.get('/notifications/unread-count').then(r => r.data),
  markAsRead:       (id)         => api.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllAsRead:    ()           => api.patch('/notifications/read-all').then(r => r.data),
  getPreferences:   ()           => api.get('/notifications/preferences').then(r => r.data),
  updatePreference: (category, enabled) =>
    api.put('/notifications/preferences', { category, enabled }).then(r => r.data),
}
