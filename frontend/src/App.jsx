import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/OauthAdmin/LoginPage'
import OAuthRedirectPage from './pages/OauthAdmin/OAuthRedirectPage'
import AdminPage from './pages/OauthAdmin/AdminPage'
import TechnicianPage from './pages/OauthAdmin/TechnicianPage'
import DashboardPage from './pages/OauthAdmin/DashboardPage'
import ResourceCatalogue from './pages/ResourceCatalogue'
import PendingPage from './pages/OauthAdmin/PendingPage'
import RejectedPage from './pages/OauthAdmin/RejectedPage'
import NotFoundPage from './pages/OauthAdmin/NotFoundPage'
import CreateBookingPage from './pages/Booking/CreateBookingPage'
import MyBookingsPage from './pages/Booking/MyBookingsPage'
import AdminBookingsPage from './pages/Booking/AdminBookingsPage'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F3FA' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4A6FA5, #395886)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 3L3 9.5V20C3 20.6 3.4 21 4 21H8.5V15.5H15.5V21H20C20.6 21 21 20.6 21 20V9.5L12 3Z" /></svg>
        </div>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: '#638ECB' }} />
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F3FA' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4A6FA5, #395886)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 3L3 9.5V20C3 20.6 3.4 21 4 21H8.5V15.5H15.5V21H20C20.6 21 21 20.6 21 20V9.5L12 3Z" /></svg>
        </div>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: '#638ECB' }} />
      </div>
    </div>
  )

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/oauth2/redirect" element={<OAuthRedirectPage />} />
      <Route path="/pending"  element={<PendingPage />} />
      <Route path="/rejected" element={<RejectedPage />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="resource-catalogue" element={<ResourceCatalogue />} />
        <Route path="admin/*" element={
          <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="technician" element={
          <ProtectedRoute roles={['TECHNICIAN', 'ADMIN', 'SUPER_ADMIN']}>
            <TechnicianPage />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}