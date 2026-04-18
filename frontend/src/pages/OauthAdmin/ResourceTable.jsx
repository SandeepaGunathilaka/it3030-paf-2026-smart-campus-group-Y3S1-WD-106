export default function ResourceTable({ resources, loading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-xl bg-white text-left">
        <thead className="bg-gray-50">
          <tr>
            {['Resource ID', 'Resource Name', 'Type', 'Capacity', 'Location', 'Status', 'Options'].map((heading) => (
              <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {loading ? (
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-500">
                <div className="inline-flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600" />
                  Loading resources...
                </div>
              </td>
            </tr>
          ) : resources.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-500">
                No resources found.
              </td>
            </tr>
          ) : (
            resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-700">{resource.id}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{resource.name}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{resource.type}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{resource.capacity ?? '—'}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{resource.location || '—'}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{resource.status}</td>
                <td className="px-4 py-4 text-sm text-gray-600 space-x-2">
                  <button
                    type="button"
                    onClick={() => onEdit(resource)}
                    className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(resource.id)}
                    className="rounded-lg border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
