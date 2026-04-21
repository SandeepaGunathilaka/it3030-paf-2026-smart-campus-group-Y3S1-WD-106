import api from './axiosConfig'
// API for loading user data on app start and after login.
export const authApi = {
  getMe: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
}
