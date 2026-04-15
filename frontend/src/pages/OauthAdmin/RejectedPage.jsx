export default function RejectedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="mx-auto h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Request Rejected</h1>
          <p className="mt-2 text-gray-500 text-sm leading-relaxed">
            Unfortunately your account request was not approved. If you believe this is a mistake,
            please contact your campus administrator for assistance.
          </p>
        </div>
        <a href="/login" className="inline-block px-5 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors">
          Back to Login
        </a>
      </div>
    </div>
  )
}
