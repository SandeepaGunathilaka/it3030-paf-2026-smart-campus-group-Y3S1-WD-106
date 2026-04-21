export default function ResourceTable({ resources }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Resource Id</th>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Resource Name</th>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Type</th>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Capacity</th>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Location</th>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {resources.map((resource) => (
            <tr key={resource.id} className="hover:bg-slate-50">
              <td className="px-5 py-4 text-sm text-slate-600">{resource.id}</td>
              <td className="px-5 py-4 text-sm text-slate-800 font-medium">{resource.name}</td>
              <td className="px-5 py-4 text-sm text-slate-600">{resource.type || '—'}</td>
              <td className="px-5 py-4 text-sm text-slate-600">{resource.capacity ?? '—'}</td>
              <td className="px-5 py-4 text-sm text-slate-600">{resource.location || '—'}</td>
              <td className="px-5 py-4 text-sm">
                <button
                  type="button"
                  onClick={() => alert(`Booking for ${resource.name} coming soon`)}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700"
                >
                  Book
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
