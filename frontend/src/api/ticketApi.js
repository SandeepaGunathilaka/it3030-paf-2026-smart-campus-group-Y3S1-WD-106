import api from './axiosConfig'

export const ticketApi = {

  // POST /api/tickets — create ticket (JSON, no files)
  createTicket: (data) =>
    api.post('/tickets', data).then(r => r.data),

  // POST /api/tickets — create ticket with attachments
  createTicketWithFiles: (formData) =>
    api.post('/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  // GET /api/tickets/my — my tickets
  getMyTickets: () =>
    api.get('/tickets/my').then(r => r.data),

  // GET /api/tickets/assigned — technician assigned tickets
  getAssignedTickets: () =>
    api.get('/tickets/assigned').then(r => r.data),

  // GET /api/tickets/:id — single ticket
  getTicketById: (id) =>
    api.get(`/tickets/${id}`).then(r => r.data),

  // GET /api/tickets — admin/technician all tickets with filters
  getAllTickets: (params = {}) =>
    api.get('/tickets', { params }).then(r => r.data),

  // PATCH /api/tickets/:id/status — update status
  updateTicketStatus: (id, data) =>
    api.patch(`/tickets/${id}/status`, data).then(r => r.data),

  // PATCH /api/tickets/:id/assign — assign technician
  assignTechnician: (id, technicianId) =>
    api.patch(`/tickets/${id}/assign`, { technicianId }).then(r => r.data),

  // POST /api/tickets/:id/comments — add comment
  addComment: (id, content) =>
    api.post(`/tickets/${id}/comments`, { content }).then(r => r.data),

  // PATCH /api/tickets/:id/comments/:commentId — edit comment
  editComment: (ticketId, commentId, content) =>
    api.patch(`/tickets/${ticketId}/comments/${commentId}`, { content }).then(r => r.data),

  // DELETE /api/tickets/:id/comments/:commentId — delete comment
  deleteComment: (ticketId, commentId) =>
    api.delete(`/tickets/${ticketId}/comments/${commentId}`).then(r => r.data),

  // DELETE /api/tickets/:id — delete ticket
  deleteTicket: (id) =>
    api.delete(`/tickets/${id}`).then(r => r.data),
}