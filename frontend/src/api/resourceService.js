import api from './axiosConfig'

export const getAllResources = () =>
  api.get('/resources', { params: { page: 0, size: 200, sortBy: 'id', sortDir: 'asc' } }).then((r) => {
    const data = r.data
    return Array.isArray(data)
      ? data
      : data?.content ?? []
  })

export const createResource = (resource) => api.post('/resources', resource).then((r) => r.data)
export const updateResource = (id, resource) => api.put(`/resources/${id}`, resource).then((r) => r.data)
export const deleteResource = (id) => api.delete(`/resources/${id}`).then((r) => r.data)
