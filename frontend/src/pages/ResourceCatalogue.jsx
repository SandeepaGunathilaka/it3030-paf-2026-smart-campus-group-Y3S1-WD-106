import { useEffect, useMemo, useState } from 'react'
import CreateBookingPage from './Booking/CreateBookingPage'
import { getAllResources } from '../services/resourceService'

// ─── Design-system constants (matches project palette) ────────────────────────
const BRAND = {
  primary:   '#395886',
  accent:    '#638ECB',
  light:     '#B1C9EF',
  bg:        '#F0F3FA',
  border:    '#D5DEEF',
  text:      '#0F172A',
  muted:     '#64748B',
}

// ─── Type metadata ────────────────────────────────────────────────────────────
const TYPE_META = {
  LECTURE_HALL: { label: 'Lecture Hall',   icon: '🏛️', bg: '#EFF6FF', dot: '#3B82F6' },
  LAB:          { label: 'Lab',            icon: '🔬', bg: '#F0FDF4', dot: '#22C55E' },
  MEETING_ROOM: { label: 'Meeting Room',   icon: '🤝', bg: '#FFFBEB', dot: '#F59E0B' },
  EQUIPMENT:    { label: 'Equipment',      icon: '📽️', bg: '#F5F3FF', dot: '#8B5CF6' },
}
const DEFAULT_TYPE = { label: 'Resource', icon: '📦', bg: BRAND.bg, dot: BRAND.accent }

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white overflow-hidden animate-pulse" style={{ border: `1px solid ${BRAND.border}` }}>
      <div className="h-[88px]" style={{ background: BRAND.bg }} />
      <div className="p-4 space-y-3">
        <div className="h-2.5 rounded w-1/3" style={{ background: BRAND.border }} />
        <div className="h-3.5 rounded w-3/4" style={{ background: BRAND.border }} />
        <div className="h-3 rounded w-1/2"   style={{ background: BRAND.border }} />
        <div className="h-3 rounded w-2/5"   style={{ background: BRAND.border }} />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 rounded-full w-16" style={{ background: BRAND.border }} />
          <div className="h-7 rounded-xl w-16"   style={{ background: BRAND.border }} />
        </div>
      </div>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isActive = status === 'ACTIVE'
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{
        background: isActive ? '#F0FDF4' : '#FEF2F2',
        border:     `1px solid ${isActive ? '#BBF7D0' : '#FECACA'}`,
        color:      isActive ? '#15803D' : '#DC2626',
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: isActive ? '#22C55E' : '#F87171' }}
      />
      {isActive ? 'Active' : 'Out of Service'}
    </span>
  )
}

// ─── Type chip (filter button) ────────────────────────────────────────────────
function TypeChip({ value, label, icon, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150"
      style={
        active
          ? { background: BRAND.primary, color: '#fff', border: `1.5px solid ${BRAND.primary}` }
          : { background: '#fff', color: BRAND.primary, border: `1.5px solid ${BRAND.border}` }
      }
      onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = BRAND.accent }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = BRAND.border }}
    >
      {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
      {label}
      <span
        className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
        style={
          active
            ? { background: 'rgba(255,255,255,0.2)', color: '#fff' }
            : { background: BRAND.bg, color: BRAND.accent }
        }
      >
        {count}
      </span>
    </button>
  )
}

// ─── Resource card ────────────────────────────────────────────────────────────
function ResourceCard({ resource, onBook }) {
  const meta      = TYPE_META[resource.type] || DEFAULT_TYPE
  const isActive  = resource.status === 'ACTIVE'
  const unitLabel = resource.type === 'EQUIPMENT' ? 'units' : 'seats'

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden transition-all duration-200"
      style={{ border: `1px solid ${BRAND.border}`, boxShadow: '0 1px 3px rgba(57,88,134,0.06)' }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(57,88,134,0.13)'
        e.currentTarget.style.transform  = 'translateY(-2px)'
        e.currentTarget.style.borderColor = BRAND.light
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow  = '0 1px 3px rgba(57,88,134,0.06)'
        e.currentTarget.style.transform  = 'translateY(0)'
        e.currentTarget.style.borderColor = BRAND.border
      }}
    >
      {/* Thumbnail */}
      <div
        className="h-[88px] flex items-center justify-center text-4xl relative"
        style={{ background: meta.bg }}
      >
        {meta.icon}
        {/* Type dot accent */}
        <span
          className="absolute top-3 right-3 h-2 w-2 rounded-full"
          style={{ background: meta.dot }}
        />
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Type label */}
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: BRAND.accent }}
        >
          {meta.label}
        </span>

        {/* Name */}
        <h3
          className="mt-0.5 text-sm font-bold leading-snug truncate"
          style={{ color: BRAND.text }}
          title={resource.name}
        >
          {resource.name}
        </h3>

        {/* Meta rows */}
        <div className="mt-2 space-y-1">
          {resource.location && (
            <p className="flex items-center gap-1.5 text-xs" style={{ color: BRAND.muted }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{resource.location}</span>
            </p>
          )}
          {resource.capacity != null && (
            <p className="flex items-center gap-1.5 text-xs" style={{ color: BRAND.muted }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
              </svg>
              <span>{resource.capacity} {unitLabel}</span>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <StatusBadge status={resource.status} />
          {isActive && (
            <button
              type="button"
              onClick={() => onBook(resource.id)}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-all duration-150"
              style={{ background: `linear-gradient(135deg, #4A6FA5, ${BRAND.primary})` }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(57,88,134,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.boxShadow = 'none' }}
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ value, label, bg, textColor, borderColor }) {
  return (
    <span
      className="rounded-full px-3.5 py-1.5 text-xs font-semibold"
      style={{ background: bg, border: `1px solid ${borderColor}`, color: textColor }}
    >
      <strong>{value}</strong> {label}
    </span>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ hasFilters, onClear }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
      style={{ background: '#fff', border: `1.5px solid ${BRAND.border}` }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
        style={{ background: BRAND.bg }}
      >
        {hasFilters ? '🔍' : '📭'}
      </div>
      <p className="text-base font-bold" style={{ color: BRAND.text }}>
        {hasFilters ? 'No matching resources' : 'No active resources'}
      </p>
      <p className="mt-1 text-sm" style={{ color: BRAND.muted }}>
        {hasFilters
          ? 'Try adjusting your search or clearing the filters.'
          : 'There are currently no active resources available.'}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-sm font-semibold underline underline-offset-2"
          style={{ color: BRAND.accent }}
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ResourceCatalogue() {
  const [resources,          setResources]          = useState([])
  const [loading,            setLoading]            = useState(true)
  const [error,              setError]              = useState('')
  const [searchTerm,         setSearchTerm]         = useState('')
  const [typeFilter,         setTypeFilter]         = useState('All')
  const [bookingResourceId,  setBookingResourceId]  = useState(null)
  const [successMsg,         setSuccessMsg]         = useState('')

  // ── Fetch ──
  useEffect(() => {
    const fetch = async () => {
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
    fetch()
  }, [])

  // ── Auto-clear success banner ──
  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(''), 4500)
    return () => clearTimeout(t)
  }, [successMsg])

  // ── Derived data ──
  const activeResources = useMemo(
    () => resources.filter((r) => r.status === 'ACTIVE'),
    [resources]
  )

  const types = useMemo(
    () => Array.from(new Set(activeResources.map((r) => r.type).filter(Boolean))).sort(),
    [activeResources]
  )

  const typeCounts = useMemo(() => {
    const counts = { All: activeResources.length }
    types.forEach((t) => { counts[t] = activeResources.filter((r) => r.type === t).length })
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
  const clearFilters = () => { setSearchTerm(''); setTypeFilter('All') }

  const stats = useMemo(() => ({
    total:        resources.length,
    active:       activeResources.length,
    outOfService: resources.filter((r) => r.status === 'OUT_OF_SERVICE').length,
  }), [resources, activeResources])

  return (
    <div className="min-h-screen py-10" style={{ background: BRAND.bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] mb-2"
            style={{ color: BRAND.accent }}
          >
            <span style={{ width: 20, height: 2, background: BRAND.accent, display: 'inline-block', borderRadius: 2 }} />
            Facilities
          </p>
          <h1 className="text-3xl font-extrabold" style={{ color: BRAND.text }}>
            Resource Catalogue
          </h1>
          <p className="mt-1 text-sm" style={{ color: BRAND.muted }}>
            Browse active campus facilities and equipment available for booking.
          </p>

          {/* ── Summary stat pills ── */}
          {!loading && !error && (
            <div className="mt-4 flex flex-wrap gap-2">
              <StatPill value={stats.total}        label="total"        bg="#fff"    textColor={BRAND.primary} borderColor={BRAND.border} />
              <StatPill value={stats.active}       label="active"       bg="#F0FDF4" textColor="#15803D"       borderColor="#BBF7D0" />
              {stats.outOfService > 0 && (
                <StatPill value={stats.outOfService} label="out of service" bg="#FEF2F2" textColor="#DC2626" borderColor="#FECACA" />
              )}
            </div>
          )}
        </div>

        {/* ── Success banner ── */}
        {successMsg && (
          <div
            className="mb-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold fade-up"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D' }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMsg}
          </div>
        )}

        {/* ── Search bar ── */}
        <div className="relative mb-4">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: BRAND.accent }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or location…"
            className="w-full rounded-2xl bg-white py-3 pl-11 pr-10 text-sm shadow-sm outline-none transition-colors"
            style={{ border: `1.5px solid ${BRAND.border}`, color: BRAND.text }}
            onFocus={e => e.target.style.borderColor = BRAND.accent}
            onBlur={e  => e.target.style.borderColor = BRAND.border}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors"
              style={{ color: BRAND.muted }}
              onMouseEnter={e => e.currentTarget.style.color = BRAND.primary}
              onMouseLeave={e => e.currentTarget.style.color = BRAND.muted}
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Type filter chips ── */}
        {!loading && types.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            <TypeChip
              value="All" label="All types" icon={null}
              count={typeCounts['All']}
              active={typeFilter === 'All'}
              onClick={() => setTypeFilter('All')}
            />
            {types.map((type) => {
              const m = TYPE_META[type] || DEFAULT_TYPE
              return (
                <TypeChip
                  key={type}
                  value={type} label={m.label} icon={m.icon}
                  count={typeCounts[type] || 0}
                  active={typeFilter === type}
                  onClick={() => setTypeFilter(type)}
                />
              )
            })}
          </div>
        )}

        {/* ── Result count + clear ── */}
        {!loading && !error && filteredResources.length > 0 && (
          <p className="mb-4 text-xs font-semibold" style={{ color: BRAND.muted }}>
            Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
            {hasFilters && (
              <>
                {' · '}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="underline underline-offset-2"
                  style={{ color: BRAND.accent }}
                >
                  Clear filters
                </button>
              </>
            )}
          </p>
        )}

        {/* ── Content area ── */}
        {error ? (
          <div
            className="rounded-2xl px-6 py-5 text-sm font-medium"
            style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}
          >
            ⚠️ {error}
          </div>
        ) : loading ? (
          /* Skeleton grid */
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredResources.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
        ) : (
          /* Card grid */
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onBook={(id) => setBookingResourceId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Booking modal ── */}
      {bookingResourceId !== null && (
        <CreateBookingPage
          prefillResourceId={bookingResourceId}
          onClose={() => setBookingResourceId(null)}
          onSuccess={(msg) => {
            setBookingResourceId(null)
            setSuccessMsg(msg || 'Booking request submitted successfully!')
          }}
        />
      )}
    </div>
  )
}