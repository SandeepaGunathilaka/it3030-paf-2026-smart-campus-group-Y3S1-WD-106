export default function RejectedPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #F0F3FA 0%, #D5DEEF 100%)' }}
    >
      {/* Decorative backdrop */}
      <div style={{ position: 'fixed', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'rgba(220,38,38,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(57,88,134,0.05)', pointerEvents: 'none' }} />

      <div className="relative w-full max-w-md fade-up">
        <div
          className="bg-white rounded-3xl p-10 text-center"
          style={{ boxShadow: '0 20px 60px rgba(220,38,38,0.10)', border: '1.5px solid #FEE2E2' }}
        >
          {/* Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FEF2F2, #FFE4E6)' }}>
            <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Brand mark */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#395886' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 3L3 9.5V20C3 20.6 3.4 21 4 21H8.5V15.5H15.5V21H20C20.6 21 21 20.6 21 20V9.5L12 3Z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#395886] tracking-widest uppercase">Smart Campus Hub</span>
          </div>

          <h1 className="text-2xl font-extrabold text-[#0F172A] mb-3 tracking-tight">
            Access Request Rejected
          </h1>
          <p className="text-[#64748B] text-sm leading-relaxed mb-6">
            Unfortunately, your account request was not approved at this time.
            If you believe this is an error, please reach out to your campus administrator for assistance.
          </p>

          {/* Info box */}
          <div
            className="rounded-2xl p-4 mb-6 text-left"
            style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-red-800">Request not approved</p>
                <p className="text-xs text-red-700 mt-0.5">
                  Contact your campus IT department or administration office for next steps.
                </p>
              </div>
            </div>
          </div>

          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200"
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

        <p className="text-center text-xs text-[#94A3B8] mt-5">
          Smart Campus Hub · University Operations Platform
        </p>
      </div>
    </div>
  )
}
