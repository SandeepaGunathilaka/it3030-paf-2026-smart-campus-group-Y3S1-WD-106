import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: 'linear-gradient(160deg, #F0F3FA 0%, #D5DEEF 100%)' }}
    >
      {/* Decorative */}
      <div style={{ position: 'fixed', top: -100, right: -100, width: 360, height: 360, borderRadius: '50%', background: 'rgba(57,88,134,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -80, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(57,88,134,0.05)', pointerEvents: 'none' }} />

      <div className="relative text-center max-w-md fade-up">
        {/* Giant 404 */}
        <div className="relative mb-4">
          <span
            className="block text-[130px] font-black leading-none select-none"
            style={{ color: 'transparent', WebkitTextStroke: '2px #B1C9EF', letterSpacing: '-6px' }}
          >
            404
          </span>
          <div
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4A6FA5, #2D4A73)', boxShadow: '0 12px 36px rgba(57,88,134,0.38)' }}
            >
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-[#0F172A] mb-3 tracking-tight">Page Not Found</h2>
        <p className="text-[#64748B] text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #4A6FA5, #395886)',
              boxShadow: '0 4px 14px rgba(57,88,134,0.35)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[#395886] transition-all duration-200"
            style={{ background: 'white', border: '2px solid #D5DEEF' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
