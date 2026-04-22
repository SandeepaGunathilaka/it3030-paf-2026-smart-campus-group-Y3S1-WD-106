export default function ResourceTable({ resources, onBook }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left divide-y" style={{ borderColor: '#D5DEEF' }}>
        <thead style={{ background: '#F0F3FA' }}>
          <tr>
            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide" style={{ color: '#395886' }}>ID</th>
            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide" style={{ color: '#395886' }}>Resource Name</th>
            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide" style={{ color: '#395886' }}>Type</th>
            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide" style={{ color: '#395886' }}>Capacity</th>
            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide" style={{ color: '#395886' }}>Location</th>
            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide" style={{ color: '#395886' }}>Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y" style={{ borderColor: '#D5DEEF' }}>
          {resources.map((resource) => (
            <tr
              key={resource.id}
              className="transition-colors duration-150"
              style={{ borderColor: '#D5DEEF' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F0F3FA'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <td className="px-5 py-4 text-sm" style={{ color: '#638ECB' }}>#{resource.id}</td>
              <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#0F172A' }}>{resource.name}</td>
              <td className="px-5 py-4 text-sm">
                {resource.type
                  ? (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: '#F0F3FA', color: '#395886', border: '1px solid #D5DEEF' }}
                    >
                      {resource.type.replace(/_/g, ' ')}
                    </span>
                  )
                  : <span style={{ color: '#94A3B8' }}>—</span>
                }
              </td>
              <td className="px-5 py-4 text-sm" style={{ color: '#64748B' }}>
                {resource.capacity != null ? `${resource.capacity} seats` : '—'}
              </td>
              <td className="px-5 py-4 text-sm" style={{ color: '#64748B' }}>{resource.location || '—'}</td>
              <td className="px-5 py-4 text-sm">
                <button
                  type="button"
                  onClick={() => onBook && onBook(resource.id)}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #4A6FA5, #395886)' }}
                >
                  Book Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}