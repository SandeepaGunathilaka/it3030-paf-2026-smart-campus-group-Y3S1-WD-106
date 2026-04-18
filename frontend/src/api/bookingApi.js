import api from './axiosConfig'

export const bookingApi = {

  // POST /api/bookings — create a new booking request
  createBooking: (data) =>
    api.post('/bookings', data).then(r => r.data),

  // GET /api/bookings/my — logged-in user's own bookings
  getMyBookings: () =>
    api.get('/bookings/my').then(r => r.data),

  // GET /api/bookings/:id — single booking detail
  getBookingById: (id) =>
    api.get(`/bookings/${id}`).then(r => r.data),

  // GET /api/bookings — admin: all bookings, optional filters
  getAllBookings: (params = {}) =>
    api.get('/bookings', { params }).then(r => r.data),

  // PATCH /api/bookings/:id/approve — admin approves
  approveBooking: (id, adminNote = '') =>
    api.patch(`/bookings/${id}/approve`, { adminNote }).then(r => r.data),

  // PATCH /api/bookings/:id/reject — admin rejects with reason
  rejectBooking: (id, adminNote = '') =>
    api.patch(`/bookings/${id}/reject`, { adminNote }).then(r => r.data),

  // PATCH /api/bookings/:id/cancel — owner or admin cancels
  cancelBooking: (id) =>
    api.patch(`/bookings/${id}/cancel`).then(r => r.data),
}