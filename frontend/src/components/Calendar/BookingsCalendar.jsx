import { useMemo, useState } from 'react'

function toYMD(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function getMonthMatrix(year, month) {
  // month: 0-11
  const first = new Date(year, month, 1)
  const start = new Date(first)
  // back up to sunday (0) of the week
  start.setDate(first.getDate() - first.getDay())

  const weeks = []
  let cur = new Date(start)
  for (let w = 0; w < 6; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur))
      cur = addDays(cur, 1)
    }
    weeks.push(week)
  }
  return weeks
}

export default function BookingsCalendar({ bookings = [], onDateSelect }) {
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [hoveredDate, setHoveredDate] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Build a map of date -> { PENDING: n, APPROVED: n }
  const statusesByDate = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      if (!b || !b.status) return
      if (!(b.status === 'PENDING' || b.status === 'APPROVED')) return
      const start = new Date(b.startTime)
      const end = new Date(b.endTime)
      for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
        const key = toYMD(d)
        if (!map[key]) map[key] = { PENDING: 0, APPROVED: 0 }
        map[key][b.status] = (map[key][b.status] || 0) + 1
      }
    })
    return map
  }, [bookings])

  const weeks = getMonthMatrix(view.year, view.month)

  const monthLabel = new Date(view.year, view.month, 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-28">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setView(v => {
          const m = v.month - 1
          return m < 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: m }
        })} className="text-sm px-2 py-1 rounded hover:bg-gray-50">◀</button>
        <div className="text-sm font-medium">{monthLabel}</div>
        <button onClick={() => setView(v => {
          const m = v.month + 1
          return m > 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: m }
        })} className="text-sm px-2 py-1 rounded hover:bg-gray-50">▶</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
      {weeks.flat().map(day => {
        const key = toYMD(day)
        const isCurrentMonth = day.getMonth() === view.month
        const statusCounts = statusesByDate[key] || { PENDING: 0, APPROVED: 0 }
        const hasPending = statusCounts.PENDING > 0
        const hasApproved = statusCounts.APPROVED > 0
        return (
          <button
            key={key}
            onClick={() => onDateSelect && onDateSelect(key)}
            onMouseEnter={(e) => { setHoveredDate(key); setTooltipPos({ x: e.clientX, y: e.clientY }) }}
            onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setHoveredDate(null)}
            className={`flex flex-col items-center justify-start p-2 h-14 rounded group transition-colors ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-300'}`}
          >
            <div className="w-full flex items-center justify-between">
              <span className={`text-sm ${isCurrentMonth ? 'text-gray-700' : 'text-gray-300'}`}>{day.getDate()}</span>
              {/* Removed numeric badge; show colored dots for statuses */}
              <div className="ml-1 flex items-center gap-1">
                {hasPending && (
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#B45309' }} />
                )}
                {hasApproved && (
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#16A34A' }} />
                )}
              </div>
            </div>
            <div className="w-full mt-1">
              {(hasPending || hasApproved) && (
                <div className="h-1 rounded-full bg-transparent" />
              )}
            </div>
          </button>
        )
      })}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <div className="font-medium text-sm mb-1">Legend</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#B45309' }} />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#16A34A' }} />
            <span>Approved</span>
          </div>
        </div>
      </div>
      <CalendarTooltip dateKey={hoveredDate} bookings={bookings} pos={tooltipPos} />
    </div>
  )
}

// Tooltip rendered separately to avoid overflow clipping
function CalendarTooltip({ dateKey, bookings, pos }) {
  if (!dateKey) return null
  const list = bookings.filter(b => (b.status === 'PENDING' || b.status === 'APPROVED') && (() => {
    const start = new Date(b.startTime)
    const end = new Date(b.endTime)
    const d = new Date(dateKey + 'T00:00:00')
    return start <= new Date(dateKey + 'T23:59:59') && end >= d
  })())

  if (list.length === 0) return null

  const items = list.slice(0, 5)

  return (
    <div style={{ position: 'fixed', left: pos.x + 12, top: pos.y + 12, zIndex: 9999 }}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 text-xs">
        <div className="font-medium mb-1">Bookings on {dateKey}</div>
        <div className="divide-y divide-gray-100 max-h-44 overflow-auto">
          {items.map(b => (
            <div key={b.id} className="py-1">
              <div className="text-gray-800 font-medium">{b.purpose || `Resource #${b.resourceId}`}</div>
              <div className="text-gray-500">{new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} — {new Date(b.endTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} • {b.status}</div>
            </div>
          ))}
        </div>
        {list.length > items.length && (
          <div className="text-center text-gray-400 mt-2">and {list.length - items.length} more…</div>
        )}
      </div>
    </div>
  )
}
