import { useEffect, useMemo, useState } from 'react'
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
        setError(err.response?.data?.message || err.message || 'Failed to load resources.')
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [])

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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Resource Catalogue</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse and book campus facilities and equipment available for reservation.
          </p>

          {/* Summary pills */}
          {!loading && !error && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs text-slate-600">
                <strong className="text-slate-900">{stats.total}</strong> total resources
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs text-emerald-700">
                <strong>{stats.active}</strong> active
              </span>
              {stats.outOfService > 0 && (
                <span className="rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs text-red-600">
                  <strong>{stats.outOfService}</strong> out of service
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-4">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or location…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Type filter chips ── */}
        {!loading && types.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <TypeChip
              value="All"
              active={typeFilter === 'All'}
              count={typeCounts['All']}
              onClick={() => setTypeFilter('All')}
            />
            {types.map((type) => (
              <TypeChip
                key={type}
                value={type}
                active={typeFilter === type}
                count={typeCounts[type] || 0}
                onClick={() => setTypeFilter(type)}
              />
            ))}
          </div>
        )}

        {/* ── Results count ── */}
        {!loading && !error && filteredResources.length > 0 && (
          <p className="mb-4 text-xs text-slate-400 font-medium">
            Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
            {hasFilters && ' · '}
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="text-blue-500 hover:underline">
                Clear filters
              </button>
            )}
          </p>
        )}

        {/* ── Content ── */}
        {error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-sm text-red-700">
            ⚠️ {error}
          </div>
        ) : loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white">
            <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
