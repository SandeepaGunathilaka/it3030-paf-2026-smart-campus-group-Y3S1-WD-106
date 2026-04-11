import api from './axiosConfig'

export const adminApi = {
  getUsers: () => api.get('/admin/users').then(r => r.data),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then(r => r.data),
  getStats: () => api.get('/admin/stats').then(r => r.data),
}
