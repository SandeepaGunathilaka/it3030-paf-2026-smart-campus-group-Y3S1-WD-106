import { useEffect, useMemo, useState } from 'react'
import ResourceTable from '../components/ResourceTable'
import CreateBookingPage from './Booking/CreateBookingPage'
import { getAllResources } from '../services/resourceService'

// Icon map per resource type
const TYPE_ICONS = {
  LECTURE_HALL: '🏛️',
  LAB: '🔬',
  MEETING_ROOM: '🤝',
  EQUIPMENT: '📽️',
}

const TYPE_LABELS = {
  LECTURE_HALL: 'Lecture Hall',
  LAB: 'Lab',
  MEETING_ROOM: 'Meeting Room',
  EQUIPMENT: 'Equipment',
}

const TYPE_THUMB_CLASS = {
  LECTURE_HALL: 'bg-blue-50',
  LAB: 'bg-green-50',
  MEETING_ROOM: 'bg-amber-50',
  EQUIPMENT: 'bg-violet-50',
}

// ── Skeleton card shown while loading ────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden animate-pulse">
      <div className="h-[88px] bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-3.5 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-2/5" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-slate-100 rounded-full w-16" />
          <div className="h-7 bg-slate-100 rounded-lg w-14" />
        </div>
      </div>
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 border border-red-100">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400 inline-block" />
      Out of Service
    </span>
  )
}

// ── Single resource card ──────────────────────────────────────────────────────
function ResourceCard({ resource }) {
  const icon = TYPE_ICONS[resource.type] || '📦'
  const thumbClass = TYPE_THUMB_CLASS[resource.type] || 'bg-slate-50'
  const isActive = resource.status === 'ACTIVE'

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Thumbnail */}
      <div className={`h-[88px] flex items-center justify-center text-4xl ${thumbClass}`}>
        {icon}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Type label */}
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
          {TYPE_LABELS[resource.type] || resource.type}
        </span>

        {/* Name */}
        <h3 className="mt-0.5 text-sm font-semibold text-slate-900 leading-snug truncate">
          {resource.name}
        </h3>

        {/* Meta */}
        <div className="mt-2 space-y-1">
          {resource.location && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{resource.location}</span>
            </p>
          )}
          {resource.capacity != null && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
              </svg>
              <span>{resource.capacity} {resource.type === 'EQUIPMENT' ? 'kit' : 'seats'}</span>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <StatusBadge status={resource.status} />
          {isActive && (
            <a
              href={`/booking/create?resourceId=${resource.id}`}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              Book
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Type filter chips ─────────────────────────────────────────────────────────
function TypeChip({ value, active, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${
        active
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
      }`}
    >
      {value === 'All' ? 'All types' : TYPE_LABELS[value] || value}
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    </button>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{hasFilters ? '🔍' : '📭'}</div>
      <p className="text-base font-semibold text-slate-700">
        {hasFilters ? 'No matching resources' : 'No active resources'}
      </p>
      <p className="mt-1 text-sm text-slate-400">
        {hasFilters
          ? 'Try adjusting your search or filters.'
          : 'There are currently no active resources available.'}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
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
        setError(err.response?.data?.message || err.message || 'Failed to load resources.')
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
    () => resources.filter((r) => r.status === 'ACTIVE'),
    [resources]
  )

  const types = useMemo(
    () => Array.from(new Set(activeResources.map((r) => r.type).filter(Boolean))).sort(),
    [activeResources]
  )

  // Count per type for chips
  const typeCounts = useMemo(() => {
    const counts = { All: activeResources.length }
    types.forEach((t) => {
      counts[t] = activeResources.filter((r) => r.type === t).length
    })
    return counts
  }, [activeResources, types])

  const filteredResources = useMemo(() => {
    let items = activeResources
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      items = items.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q)
      )
    }
    if (typeFilter !== 'All') {
      items = items.filter((r) => r.type === typeFilter)
    }
    return items
  }, [activeResources, searchTerm, typeFilter])

  const hasFilters = searchTerm.trim() !== '' || typeFilter !== 'All'

  const clearFilters = () => {
    setSearchTerm('')
    setTypeFilter('All')
  }

  // ── Summary stats ───────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: resources.length,
    active: activeResources.length,
    outOfService: resources.filter((r) => r.status === 'OUT_OF_SERVICE').length,
  }), [resources, activeResources])

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
          </div>
        )}

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