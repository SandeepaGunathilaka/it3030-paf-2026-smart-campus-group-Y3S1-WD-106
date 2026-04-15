import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/OauthAdmin/LoginPage'
import OAuthRedirectPage from './pages/OauthAdmin/OAuthRedirectPage'
import AdminPage from './pages/OauthAdmin/AdminPage'
import TechnicianPage from './pages/OauthAdmin/TechnicianPage'
import DashboardPage from './pages/OauthAdmin/DashboardPage'
import PendingPage from './pages/OauthAdmin/PendingPage'
import RejectedPage from './pages/OauthAdmin/RejectedPage'
import NotFoundPage from './pages/OauthAdmin/NotFoundPage'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/oauth2/redirect" element={<OAuthRedirectPage />} />
      <Route path="/pending"  element={<PendingPage />} />
      <Route path="/rejected" element={<RejectedPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="admin" element={
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
