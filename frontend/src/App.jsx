import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/OauthAdmin/LoginPage'
import OAuthRedirectPage from './pages/OauthAdmin/OAuthRedirectPage'
import AdminPage from './pages/OauthAdmin/AdminPage'
import NotFoundPage from './pages/OauthAdmin/NotFoundPage'
import DashboardPage from './pages/OauthAdmin/DashboardPage'
import CreateBookingPage from './pages/Booking/CreateBookingPage'
import MyBookingsPage from './pages/Booking/MyBookingsPage'
import AdminBookingsPage from './pages/Booking/AdminBookingsPage'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/oauth2/redirect" element={<OAuthRedirectPage />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* ── Booking routes ── */}
        <Route path="bookings/new"   element={<CreateBookingPage />} />
        <Route path="bookings/my"    element={<MyBookingsPage />} />
        <Route path="bookings/admin" element={
          <ProtectedRoute adminOnly><AdminBookingsPage /></ProtectedRoute>
        } />

        {/* ── Admin ── */}
        <Route path="admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}