import api from '../api/axiosConfig'

export const getAllResources = () =>
  api.get('/resources', { params: { page: 0, size: 200, sortBy: 'id', sortDir: 'asc' } }).then((r) => {
    const data = r.data
    return Array.isArray(data) ? data : data?.content ?? []
  })
