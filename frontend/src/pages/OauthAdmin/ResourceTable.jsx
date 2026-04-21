// src/pages/OauthAdmin/ResourceTable.jsx
// Drop-in replacement — same props: { resources, loading, onEdit, onDelete }

const TYPE_LABELS = {
  LECTURE_HALL: 'Lecture Hall',
  LAB: 'Lab',
  MEETING_ROOM: 'Meeting Room',
  EQUIPMENT: 'Equipment',
}

const TYPE_COLORS = {
  LECTURE_HALL: 'bg-blue-50 text-blue-700 border-blue-100',
  LAB: 'bg-green-50 text-green-700 border-green-100',
  MEETING_ROOM: 'bg-amber-50 text-amber-700 border-amber-100',
  EQUIPMENT: 'bg-violet-50 text-violet-700 border-violet-100',
}

function TypeBadge({ type }) {
  const colorClass = TYPE_COLORS[type] || 'bg-gray-50 text-gray-600 border-gray-100'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {TYPE_LABELS[type] || type?.replace(/_/g, ' ')}
    </span>
  )
}

function StatusBadge({ status }) {
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-2.5 py-1 text-xs font-medium text-red-600">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400 inline-block" />
      Out of Service
    </span>
  )
}

export default function ResourceTable({ resources, loading, onEdit, onDelete }) {
  const COLS = ['#', 'Name', 'Type', 'Capacity', 'Location', 'Status', 'Actions']

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-100 text-left">
        <thead>
          <tr className="bg-gray-50">
            {COLS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {loading ? (
            // ── Skeleton rows ──
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {COLS.map((col) => (
                  <td key={col} className="px-4 py-4">
                    <div className="h-3 rounded bg-gray-100 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : resources.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">📭</span>
                  <p className="text-sm font-medium text-gray-500">No resources found</p>
                  <p className="text-xs text-gray-400">Try adjusting your filters</p>
                </div>
              </td>
            </tr>
          ) : (
            resources.map((resource) => (
              <tr
                key={resource.id}
                className="group hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-4 text-xs text-gray-400 font-mono">
                  #{resource.id}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {resource.name}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <TypeBadge type={resource.type} />
                </td>
                <td className="px-4 py-4">
                  {resource.capacity != null ? (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                      </svg>
                      {resource.capacity}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 max-w-[160px] truncate">
                  {resource.location || <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={resource.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onEdit(resource)}
                      className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(resource.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
