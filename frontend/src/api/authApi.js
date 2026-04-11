import api from './axiosConfig'

export const authApi = {
  getMe: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
}
