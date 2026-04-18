import { useEffect, useState } from 'react'

const RESOURCE_TYPES = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const RESOURCE_STATUS = ['ACTIVE', 'OUT_OF_SERVICE']
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
  }, [resource])

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Resource name is required.'
    if (!form.type) nextErrors.type = 'Type is required.'
    if (!form.location.trim()) nextErrors.location = 'Location is required.'
    if (!form.status) nextErrors.status = 'Status is required.'

    const capacityValue = Number(form.capacity)
    if (!form.capacity.toString().trim()) {
      nextErrors.capacity = 'Capacity is required.'
    } else if (Number.isNaN(capacityValue) || capacityValue < 1) {
      nextErrors.capacity = 'Capacity must be a positive number.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      ...form,
      capacity: Number(form.capacity),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'add' ? 'Add Resource' : 'Update Resource'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === 'add'
                ? 'Create a new resource for campus operations.'
                : 'Update the selected resource details.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Resource Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Lecture Hall A"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              >
                {RESOURCE_TYPES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                name="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                placeholder="25"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.capacity && <p className="mt-1 text-xs text-red-600">{errors.capacity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Building C, Level 2"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
            >
              {RESOURCE_STATUS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'add' ? 'Add Resource' : 'Update Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
