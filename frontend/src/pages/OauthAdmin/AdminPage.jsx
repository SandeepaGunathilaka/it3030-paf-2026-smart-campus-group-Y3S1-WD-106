import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminApi } from '../../api/adminApi'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'
import ManageResources from './ManageResources'
import toast from 'react-hot-toast'

const STAFF_ROLES = ['ADMIN', 'TECHNICIAN']
const ASSIGNABLE_ROLES = ['USER', 'TECHNICIAN', 'ADMIN']

function Avatar({ user }) {
  return user.pictureUrl
    ? <img src={user.pictureUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
    : <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">{user.name?.[0]}</div>
}

// ── Pending Requests Tab ───────────────────────────────────────────────────────
function PendingTab({ onAction }) {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectState, setRejectState] = useState({})   // { [id]: reason string }
  const [showReject, setShowReject] = useState({})      // { [id]: bool }

  useEffect(() => {
    adminApi.getPending().then(setPending).finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await adminApi.approveUser(id)
      setPending(prev => prev.filter(u => u.id !== id))
      toast.success('User approved successfully')
      onAction()
    } catch { toast.error('Failed to approve user') }
  }

  const handleReject = async (id) => {
    try {
      await adminApi.rejectUser(id, rejectState[id])
      setPending(prev => prev.filter(u => u.id !== id))
      toast.success('User rejected')
      onAction()
    } catch { toast.error('Failed to reject user') }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  if (pending.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <svg className="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <p className="font-medium">No pending requests</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {pending.map(u => (
        <div key={u.id} className="bg-white border border-yellow-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar user={u} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
              <p className="text-xs text-gray-500 truncate">{u.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">Requested {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex gap-2">
              <button onClick={() => handleApprove(u.id)}
                className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors">
                Approve
              </button>
              <button onClick={() => setShowReject(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-md hover:bg-red-200 transition-colors">
                Reject
              </button>
            </div>
            {showReject[u.id] && (
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Reason (optional)"
                  value={rejectState[u.id] || ''}
                  onChange={e => setRejectState(prev => ({ ...prev, [u.id]: e.target.value }))}
                  className="text-xs border border-gray-300 rounded-md px-2 py-1 flex-1 focus:ring-red-400 focus:border-red-400 outline-none"
                />
                <button onClick={() => handleReject(u.id)}
                  className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors whitespace-nowrap">
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab({ isSuperAdmin }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => adminApi.getUsers().then(setUsers).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updated = await adminApi.updateUserRole(userId, newRole)
      setUsers(prev => prev.map(u => u.id === userId ? updated : u))
      toast.success(`Role updated to ${newRole}`)
    } catch { toast.error('Failed to update role') }
  }

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete ${userName}? This cannot be undone.`)) return
    try {
      await adminApi.deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete user')
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">All Users</h2>
          <p className="text-xs text-gray-500 mt-0.5">{users.length} accounts</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => {
              const canDelete = isSuperAdmin ? true : u.role === 'USER'
              const canChangeRole = isSuperAdmin
              return (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar user={u} />
                      <span className="text-sm font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    {canChangeRole ? (
                      <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                        {ASSIGNABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <StatusBadge status={u.role} />
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {canDelete && (
                      <button onClick={() => handleDelete(u.id, u.name)}
                        className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-md hover:bg-red-200 transition-colors">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Create Staff Tab (Super Admin only) ───────────────────────────────────────
function CreateStaffTab() {
  const [form, setForm] = useState({ email: '', name: '', pictureUrl: '', role: 'ADMIN' })
  const [saving, setSaving] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminApi.createStaff(form)
      toast.success(`${form.role} account created for ${form.name}`)
      setForm({ email: '', name: '', pictureUrl: '', role: 'ADMIN' })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create account')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Create Staff Account</h2>
        <p className="text-sm text-gray-500 mb-5">Pre-create an Admin or Technician account. The person must log in with the matching Google account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required
              placeholder="staff@example.com"
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} required
              placeholder="John Doe"
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Profile Picture URL <span className="text-gray-400">(optional)</span></label>
            <input name="pictureUrl" value={form.pictureUrl} onChange={handleChange}
              placeholder="https://..."
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ pendingCount }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    adminApi.getStats().then(setStats).catch(() => {})
  }, [])

  const cards = stats ? [
    { label: 'Regular Users',  value: stats.totalUsers,        color: 'border-blue-200 bg-blue-50',   text: 'text-blue-700' },
    { label: 'Technicians',    value: stats.totalTechnicians,  color: 'border-orange-200 bg-orange-50', text: 'text-orange-700' },
    { label: 'Admins',         value: stats.totalAdmins,       color: 'border-purple-200 bg-purple-50', text: 'text-purple-700' },
    { label: 'Pending Requests', value: stats.pendingApprovals, color: 'border-yellow-200 bg-yellow-50', text: 'text-yellow-700' },
  ] : []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className={`rounded-lg border p-4 ${c.color}`}>
            <p className={`text-2xl font-bold ${c.text}`}>{c.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
          <span><strong>{pendingCount}</strong> user{pendingCount > 1 ? 's' : ''} waiting for approval. Go to the <strong>Pending Requests</strong> tab.</span>
        </div>
      )}
    </div>
  )
}

// ── Main AdminPage ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { isSuperAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [pendingCount, setPendingCount] = useState(0)

  const refreshPendingCount = () => {
    adminApi.getPending().then(list => setPendingCount(list.length)).catch(() => {})
  }

  useEffect(() => {
    if (location.pathname.endsWith('/manage-resources')) {
      setActiveTab('manage-resources')
    } else if (activeTab === 'manage-resources') {
      setActiveTab('overview')
    }
  }, [location.pathname, activeTab])

  const handleTabChange = (tabId) => {
    if (tabId === 'manage-resources') {
      navigate('/admin/manage-resources')
      return
    }
    if (location.pathname.endsWith('/manage-resources')) {
      navigate('/admin')
    }
    setActiveTab(tabId)
  }

  useEffect(() => { refreshPendingCount() }, [])

  const tabs = [
    { id: 'overview',  label: 'Overview' },
    { id: 'pending',   label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { id: 'users',     label: 'Users' },
    { id: 'manage-resources', label: 'Manage Resources' },
    ...(isSuperAdmin ? [{ id: 'create-staff', label: 'Create Staff' }] : []),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isSuperAdmin ? 'Super Admin — full access' : 'Admin — manage users and requests'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview'      && <OverviewTab pendingCount={pendingCount} />}
      {activeTab === 'pending'       && <PendingTab onAction={refreshPendingCount} />}
      {activeTab === 'users'         && <UsersTab isSuperAdmin={isSuperAdmin} />}
      {activeTab === 'create-staff'  && isSuperAdmin && <CreateStaffTab />}
      {activeTab === 'manage-resources' && <ManageResources />}
    </div>
    </div>
  )
}
