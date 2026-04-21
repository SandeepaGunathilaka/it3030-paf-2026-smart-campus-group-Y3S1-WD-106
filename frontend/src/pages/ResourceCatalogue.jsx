import { useEffect, useMemo, useState } from 'react'
import ResourceTable from '../components/ResourceTable'
import { getAllResources } from '../services/resourceService'

export default function ResourceCatalogue() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        const data = await getAllResources()
        setResources(data)
        setError('')
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load resources. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [])

  const activeResources = useMemo(
    () => resources.filter((resource) => resource.status === 'ACTIVE'),
    [resources]
  )

  const types = useMemo(
    () => Array.from(new Set(activeResources.map((resource) => resource.type).filter(Boolean))).sort(),
    [activeResources]
  )

  const filteredResources = useMemo(() => {
    let items = activeResources
    if (searchTerm.trim()) {
      items = items.filter((resource) => resource.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (typeFilter !== 'All') {
      items = items.filter((resource) => resource.type === typeFilter)
    }
    return items
  }, [activeResources, searchTerm, typeFilter])

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Resource Catalogue</h1>
          <p className="mt-2 text-sm text-slate-600">Browse the current active campus resources available for booking.</p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources by name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          >
            <option value="All">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm font-medium text-slate-600">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-sm font-medium text-rose-700">{error}</div>
          ) : activeResources.length === 0 ? (
            <div className="p-8 text-center text-sm font-medium text-slate-600">No active resources available.</div>
          ) : filteredResources.length === 0 ? (
            <div className="p-8 text-center text-sm font-medium text-slate-600">No resources match your search or filter.</div>
          ) : (
            <div className="p-6">
              <ResourceTable resources={filteredResources} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
