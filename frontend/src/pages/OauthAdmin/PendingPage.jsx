export default function PendingPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #F0F3FA 0%, #D5DEEF 100%)' }}
    >
      {/* Decorative backdrop */}
      <div style={{ position: 'fixed', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'rgba(57,88,134,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(57,88,134,0.05)', pointerEvents: 'none' }} />

      <div className="relative w-full max-w-md fade-up">
        {/* Card */}
        <div
          className="bg-white rounded-3xl p-10 text-center"
          style={{ boxShadow: '0 20px 60px rgba(57,88,134,0.12)', border: '1.5px solid #D5DEEF' }}
        >
          {/* Icon ring */}
          <div className="mx-auto mb-6 relative w-20 h-20">
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: '#F59E0B' }}
            />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FEF9C3, #FEF3C7)' }}
            >
              <svg className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Brand mark */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#395886' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 3L3 9.5V20C3 20.6 3.4 21 4 21H8.5V15.5H15.5V21H20C20.6 21 21 20.6 21 20V9.5L12 3Z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#395886] tracking-widest uppercase">Smart Campus Hub</span>
          </div>

          <h1 className="text-2xl font-extrabold text-[#0F172A] mb-3 tracking-tight">
            Account Pending Approval
          </h1>
          <p className="text-[#64748B] text-sm leading-relaxed mb-6">
            Your account request has been received and is awaiting review.
            An administrator will approve your access shortly.
            You&apos;ll be notified once approved.
          </p>

          {/* Status steps */}
          <div
            className="rounded-2xl p-4 mb-6 text-left"
            style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800">Awaiting administrator review</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Please log in again after receiving your approval notification.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href="/login"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #4A6FA5, #395886)',
                color: 'white',
                boxShadow: '0 4px 14px rgba(57,88,134,0.35)',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-5">
          Need help? Contact your campus administrator.
        </p>
      </div>
    </div>
  )
}
