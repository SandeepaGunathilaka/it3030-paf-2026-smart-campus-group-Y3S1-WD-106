export default function ResourceTable({ resources }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Resource Name</th>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Type</th>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Capacity</th>
            <th className="px-5 py-4 text-sm font-semibold text-slate-700">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {resources.map((resource) => (
            <tr key={resource.id} className="hover:bg-slate-50">
              <td className="px-5 py-4 text-sm text-slate-800 font-medium">{resource.name}</td>
              <td className="px-5 py-4 text-sm text-slate-600">{resource.type || '—'}</td>
              <td className="px-5 py-4 text-sm text-slate-600">{resource.capacity ?? '—'}</td>
              <td className="px-5 py-4 text-sm text-slate-600">{resource.location || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
