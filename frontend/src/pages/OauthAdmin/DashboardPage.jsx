import { useAuth } from '../../context/AuthContext'

export default function DashboardPage() {
  const { user, isAdmin, isTechnician } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          You are logged in as <span className="font-medium text-blue-600">{user?.role}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Cards available to all users */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-1">My Bookings</h2>
          <p className="text-sm text-gray-500">View and manage your facility bookings</p>
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-1">My Tickets</h2>
          <p className="text-sm text-gray-500">Track your maintenance requests</p>
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-1">Resources</h2>
          <p className="text-sm text-gray-500">Browse available campus resources</p>
        </div>

        {/* Technician-only card */}
        {(isTechnician || isAdmin) && (
          <div className="card border-orange-200 bg-orange-50">
            <h2 className="font-semibold text-gray-900 mb-1">Assigned Tickets</h2>
            <p className="text-sm text-gray-500">Manage tickets assigned to you</p>
          </div>
        )}

        {/* Admin-only card */}
        {isAdmin && (
          <div className="card border-purple-200 bg-purple-50">
            <h2 className="font-semibold text-gray-900 mb-1">Admin Panel</h2>
            <p className="text-sm text-gray-500">Manage users, bookings, and system settings</p>
          </div>
        )}
      </div>
    </div>
  )
}