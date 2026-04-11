import { useEffect, useState } from 'react'
import { adminApi } from '../api/adminApi'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'

const ROLES = ['USER', 'TECHNICIAN', 'ADMIN']

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updated = await adminApi.updateUserRole(userId, newRole)
      setUsers(prev => prev.map(u => u.id === userId ? updated : u))
      toast.success(`Role updated to ${newRole}`)
    } catch {
      toast.error('Failed to update role')
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  const totalUsers = users.length
  const technicians = users.filter(u => u.role === 'TECHNICIAN').length
  const admins = users.filter(u => u.role === 'ADMIN').length

  const statCards = [
    { label: 'Total Users', value: totalUsers, color: 'border-blue-200 bg-blue-50' },
    { label: 'Technicians', value: technicians, color: 'border-orange-200 bg-orange-50' },
    { label: 'Admins', value: admins, color: 'border-purple-200 bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {['overview', 'users'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map(card => (
              <div key={card.label} className={`card border ${card.color}`}>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-600">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Quick Admin Actions</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Use the <strong>Users</strong> tab to manage user roles</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-500">{users.length} registered users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.pictureUrl
                          ? <img src={u.pictureUrl} alt="" className="h-8 w-8 rounded-full" />
                          : <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">{u.name?.[0]}</div>
                        }
                        <span className="text-sm font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4"><StatusBadge status={u.role} /></td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
