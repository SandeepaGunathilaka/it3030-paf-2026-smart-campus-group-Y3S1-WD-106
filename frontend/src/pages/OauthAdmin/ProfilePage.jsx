import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { notificationApi } from '../../api/notificationApi'
import toast from 'react-hot-toast'

const CATEGORY_META = {
  BOOKING:  { label: 'Booking Notifications',  desc: 'Approval, rejection and cancellation of your bookings', icon: '🗓️' },
  TICKET:   { label: 'Ticket Notifications',   desc: 'Status changes, assignments and new comments on your tickets', icon: '🎫' },
  ACCOUNT:  { label: 'Account Notifications',  desc: 'Account approval or rejection updates', icon: '👤' },
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [prefs, setPrefs] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationApi.getPreferences()
      .then(data => {
        const map = {}
        data.forEach(p => { map[p.category] = p.enabled })
        setPrefs(map)
      })
      .catch(() => toast.error('Failed to load preferences'))
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (category, enabled) => {
    setPrefs(prev => ({ ...prev, [category]: enabled }))
    try {
      await notificationApi.updatePreference(category, enabled)
      toast.success(`${CATEGORY_META[category].label} ${enabled ? 'enabled' : 'disabled'}`)
    } catch {
      setPrefs(prev => ({ ...prev, [category]: !enabled }))
      toast.error('Failed to update preference')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-20" style={{ background: 'linear-gradient(135deg, #4A6FA5 0%, #395886 100%)' }} />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            {user?.pictureUrl ? (
              <img src={user.pictureUrl} alt="" className="h-20 w-20 rounded-2xl ring-4 ring-white object-cover shadow" />
            ) : (
              <div className="h-20 w-20 rounded-2xl ring-4 ring-white bg-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="mb-1">
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#D5DEEF', color: '#395886' }}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mb-5">Choose which notifications you want to receive.</p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(CATEGORY_META).map(([cat, meta]) => (
              <div key={cat} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meta.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{meta.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{meta.desc}</p>
                  </div>
                </div>
                <Toggle
                  enabled={prefs[cat] !== false}
                  onChange={(val) => handleToggle(cat, val)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
