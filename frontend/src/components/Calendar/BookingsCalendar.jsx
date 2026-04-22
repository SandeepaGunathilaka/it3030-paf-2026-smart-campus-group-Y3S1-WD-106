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

  const countsByDate = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      const start = new Date(b.startTime)
      const end = new Date(b.endTime)
      // mark each date in the inclusive range
      for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
        const key = toYMD(d)
        map[key] = (map[key] || 0) + 1
      }
    })
    return map
  }, [bookings])

  const weeks = getMonthMatrix(view.year, view.month)

  const monthLabel = new Date(view.year, view.month, 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
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
          const count = countsByDate[key] || 0
          return (
            <button
              key={key}
              onClick={() => onDateSelect && onDateSelect(key)}
              className={`flex flex-col items-center justify-start p-2 h-14 rounded group transition-colors ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-300'}`}
            >
              <div className="w-full flex items-center justify-between">
                <span className={`text-sm ${isCurrentMonth ? 'text-gray-700' : 'text-gray-300'}`}>{day.getDate()}</span>
                {count > 0 && (
                  <span className="ml-1 inline-block bg-blue-600 text-white text-[10px] px-1 py-0.5 rounded">{count}</span>
                )}
              </div>
              <div className="w-full mt-1">
                {count > 0 && (
                  <div className="h-1 rounded-full bg-blue-100 group-hover:bg-blue-200" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <div className="font-medium text-sm mb-1">Legend</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <span>Booked day</span>
        </div>
      </div>
    </div>
  )
}
