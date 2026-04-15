export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="mx-auto h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Pending Approval</h1>
          <p className="mt-2 text-gray-500 text-sm leading-relaxed">
            Your account request has been received. An administrator will review and approve your access shortly.
            You will be notified once your account is approved.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          Please log in again after you receive approval to access Smart Campus Hub.
        </div>
        <a href="/login" className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          Back to Login
        </a>
      </div>
    </div>
  )
}
