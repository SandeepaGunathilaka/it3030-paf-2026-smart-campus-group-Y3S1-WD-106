// src/pages/OauthAdmin/ResourceForm.jsx
// Drop-in replacement — same props: { mode, resource, onSubmit, onClose, loading }

import { useEffect, useState } from 'react'

const RESOURCE_TYPES = [
  { value: 'LECTURE_HALL', label: 'Lecture Hall', icon: '🏛️', description: 'Large teaching venue' },
  { value: 'LAB', label: 'Lab', icon: '🔬', description: 'Science or computer lab' },
  { value: 'MEETING_ROOM', label: 'Meeting Room', icon: '🤝', description: 'Small group meetings' },
  { value: 'EQUIPMENT', label: 'Equipment', icon: '📽️', description: 'Portable items & devices' },
]

const RESOURCE_STATUS = [
  { value: 'ACTIVE', label: 'Active', color: 'text-emerald-700', dot: 'bg-emerald-500' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service', color: 'text-red-600', dot: 'bg-red-400' },
]

const DEFAULT_FORM = {
  name: '',
  type: 'LECTURE_HALL',
  capacity: '',
  location: '',
  status: 'ACTIVE',
}

export default function ResourceForm({ mode = 'add', resource, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (resource) {
      setForm({
        name: resource.name || '',
        type: resource.type || 'LECTURE_HALL',
        capacity: resource.capacity?.toString() || '',
        location: resource.location || '',
        status: resource.status || 'ACTIVE',
      })
    } else {
      setForm(DEFAULT_FORM)
    }
    setErrors({})
  }, [resource])

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Resource name is required.'
    if (!form.location.trim()) next.location = 'Location is required.'
    const cap = Number(form.capacity)
    if (!form.capacity.toString().trim()) next.capacity = 'Capacity is required.'
    else if (Number.isNaN(cap) || cap < 1) next.capacity = 'Must be a positive number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, capacity: Number(form.capacity) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === 'add' ? '➕ Add New Resource' : '✏️ Update Resource'}
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">
              {mode === 'add'
                ? 'Fill in the details to add a new campus resource.'
                : `Editing: ${resource?.name}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

          {/* ── Type selector (visual) ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RESOURCE_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: t.value }))}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all ${
                    form.type === t.value
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <span className={`text-xs font-semibold ${form.type === t.value ? 'text-blue-700' : 'text-gray-700'}`}>
                    {t.label}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-tight">{t.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Name & Capacity ── */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Resource Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Lecture Hall A"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
                  errors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                Capacity <span className="text-red-400">*</span>
              </label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👥</span>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 40"
                  className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
                    errors.capacity ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.capacity && <p className="mt-1 text-xs text-red-500">{errors.capacity}</p>}
            </div>
          </div>

          {/* ── Location ── */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location <span className="text-red-400">*</span>
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Block C, Level 2"
                className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
                  errors.location ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
          </div>

          {/* ── Status ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-3">
              {RESOURCE_STATUS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: s.value }))}
                  className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                    form.status === s.value
                      ? s.value === 'ACTIVE'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-red-400 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <span className={form.status === s.value ? s.color : 'text-gray-600'}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading
                ? '⏳ Saving…'
                : mode === 'add'
                ? '✓ Add Resource'
                : '✓ Update Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
