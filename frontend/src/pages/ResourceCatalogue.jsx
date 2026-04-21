import { useEffect, useMemo, useState } from 'react'
import ResourceTable from '../components/ResourceTable'
import CreateBookingPage from './Booking/CreateBookingPage'
import { getAllResources } from '../services/resourceService'

export default function ResourceCatalogue() {
  const [resources, setResources]           = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState('')
  const [searchTerm, setSearchTerm]         = useState('')
  const [typeFilter, setTypeFilter]         = useState('All')
  const [bookingResourceId, setBookingResourceId] = useState(null)
  const [successMsg, setSuccessMsg]         = useState('')

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

  // Auto-clear success banner after 4 seconds
  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(''), 4000)
    return () => clearTimeout(t)
  }, [successMsg])

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
    <div className="min-h-screen py-10" style={{ background: '#F0F3FA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: '#638ECB' }}>
            <span style={{ width: 22, height: 2, background: '#638ECB', display: 'inline-block', borderRadius: 2 }} />
            Facilities
          </p>
          <h1 className="text-3xl font-extrabold" style={{ color: '#0F172A' }}>Resource Catalogue</h1>
          <p className="mt-1 text-sm" style={{ color: '#64748B' }}>
            Browse active campus resources and book directly.
          </p>
        </div>

        {/* Success banner */}
        {successMsg && (
          <div className="mb-4 rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D' }}>
            {successMsg}
          </div>
        )}

        {/* Search + Filter */}
        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources by name…"
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm shadow-sm outline-none transition"
            style={{ border: '1.5px solid #D5DEEF', color: '#0F172A' }}
            onFocus={e => e.target.style.borderColor = '#638ECB'}
            onBlur={e => e.target.style.borderColor = '#D5DEEF'}
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm shadow-sm outline-none transition"
            style={{ border: '1.5px solid #D5DEEF', color: '#0F172A' }}
            onFocus={e => e.target.style.borderColor = '#638ECB'}
            onBlur={e => e.target.style.borderColor = '#D5DEEF'}
          >
            <option value="All">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Table card */}
        <div
          className="overflow-hidden bg-white shadow-sm"
          style={{ borderRadius: 28, border: '1.5px solid #D5DEEF' }}
        >
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#395886' }} />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-sm font-medium" style={{ color: '#991B1B' }}>{error}</div>
          ) : activeResources.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F0F3FA' }}>
                <svg className="w-7 h-7" style={{ color: '#638ECB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: '#64748B' }}>No active resources available.</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-8 text-center text-sm font-medium" style={{ color: '#64748B' }}>
              No resources match your search or filter.
            </div>
          ) : (
            <div className="p-6">
              <ResourceTable
                resources={filteredResources}
                onBook={(id) => setBookingResourceId(id)}
              />
            </div>
          )}
        </div>

      </div>

      {/* Booking modal — opens pre-filled when Book Now is clicked */}
      {bookingResourceId !== null && (
        <CreateBookingPage
          prefillResourceId={bookingResourceId}
          onClose={() => setBookingResourceId(null)}
          onSuccess={(msg) => {
            setBookingResourceId(null)
            setSuccessMsg(msg)
          }}
        />
      )}
    </div>
  )
}