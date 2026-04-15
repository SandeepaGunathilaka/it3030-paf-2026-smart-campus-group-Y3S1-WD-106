import api from './axiosConfig'

export const adminApi = {
  getUsers:       ()           => api.get('/admin/users').then(r => r.data),
  getPending:     ()           => api.get('/admin/users/pending').then(r => r.data),
  getStats:       ()           => api.get('/admin/stats').then(r => r.data),

  // SUPER_ADMIN only
  createStaff:    (data)       => api.post('/admin/users', data).then(r => r.data),
  updateUserRole: (id, role)   => api.put(`/admin/users/${id}/role`, { role }).then(r => r.data),

  // ADMIN + SUPER_ADMIN
  approveUser:    (id)         => api.patch(`/admin/users/${id}/approve`).then(r => r.data),
  rejectUser:     (id, reason) => api.patch(`/admin/users/${id}/reject`, reason ? { reason } : {}).then(r => r.data),
  deleteUser:     (id)         => api.delete(`/admin/users/${id}`).then(r => r.data),
}
