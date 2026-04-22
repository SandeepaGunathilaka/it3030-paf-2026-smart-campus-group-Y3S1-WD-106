import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/authApi'

//Creates a global place to store user data
const AuthContext = createContext(null)
//Provides user data and auth functions to the rest of the app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  //Load user from backend
  const loadUser = useCallback(async () => {
    //Get token from browser
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      //Fetch user data from backend using token
      const userData = await authApi.getMe()
      setUser(userData)
    } catch {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }, [])

  //On app start, load user data if token exists
  useEffect(() => {
    loadUser()
  }, [loadUser])

  //Saves token to browser and loads user data
    const login = (token) => {
    localStorage.setItem('token', token)
    loadUser()
  }
  //Removes token and user data
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }
  //Role checks for easy access in components
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const isAdmin = user?.role === 'ADMIN' || isSuperAdmin
  const isTechnician = user?.role === 'TECHNICIAN'

  //Provide user data and auth functions to the rest of the app
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isSuperAdmin, isTechnician }}>
      {children}
    </AuthContext.Provider>
  )
}
//Custom hook to easily access auth context in components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
