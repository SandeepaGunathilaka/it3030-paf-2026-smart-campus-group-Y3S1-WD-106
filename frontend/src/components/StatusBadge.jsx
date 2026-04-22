const STATUS_STYLES = {
  // Booking statuses
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  // Ticket statuses
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  // Account statuses
  ACTIVE: 'bg-green-100 text-green-800',
  OUT_OF_SERVICE: 'bg-red-100 text-red-800',
  UNDER_MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  // Roles
  SUPER_ADMIN: 'bg-indigo-100 text-indigo-800',
  ADMIN: 'bg-purple-100 text-purple-800',
  TECHNICIAN: 'bg-orange-100 text-orange-800',
  USER: 'bg-blue-100 text-blue-800',
  // Priority
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`badge ${style} ${className}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}
