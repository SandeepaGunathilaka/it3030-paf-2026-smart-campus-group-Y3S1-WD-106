import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

/*
  Palette (from brand image):
  #F0F3FA  lightest bg
  #D5DEEF  soft blue / borders
  #B1C9EF  medium light
  #8AAEE0  medium blue
  #638ECB  strong blue (primary accent)
  #395886  dark navy (primary dark)
*/

/* ─── Icon ─────────────────────────────────────────────────────────────────── */
function Icon({ d, d2, className = 'w-6 h-6', sw = 1.8 }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
      {d  && <path strokeLinecap="round" strokeLinejoin="round" d={d} />}
      {d2 && <path strokeLinecap="round" strokeLinejoin="round" d={d2} />}
    </svg>
  )
}

/* ─── Paths ────────────────────────────────────────────────────────────────── */
const P = {
  calendar : 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  ticket   : 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  stack    : 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  cog1     : 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  cog2     : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  users1   : 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  bell     : 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  mail     : 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  phone    : 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z',
  pin      : 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  arrow    : 'M13 7l5 5m0 0l-5 5m5-5H6',
  info     : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  shield   : 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  spark    : 'M13 10V3L4 14h7v7l9-11h-7z',
}

/* ─── Hero illustration ────────────────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: '100%', height: 340 }}>
      {/* Rings */}
      <div className="absolute rounded-full" style={{ width: 300, height: 300, border: '2px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }} />
      <div className="absolute rounded-full" style={{ width: 210, height: 210, border: '1.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.05)' }} />

      {/* Centre campus card */}
      <div className="absolute flex items-center justify-center" style={{
        width: 100, height: 100, borderRadius: 26,
        background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(255,255,255,0.32)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
      }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
          <path d="M12 3L3 9.5V20C3 20.6 3.4 21 4 21H8.5V15.5H15.5V21H20C20.6 21 21 20.6 21 20V9.5L12 3Z" />
          <rect x="10" y="15.5" width="4" height="5.5" rx="0.5" fill="rgba(255,255,255,0.4)" />
        </svg>
      </div>

      {/* Floating: facilities */}
      <div className="absolute float-a" style={{ top: 22, right: 8 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '10px 18px', boxShadow: '0 14px 36px rgba(0,0,0,0.15)', minWidth: 126 }}>
          <p style={{ fontSize: 10, color: '#8AAEE0', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>Facilities</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#395886', lineHeight: 1 }}>50+</p>
        </div>
      </div>

      {/* Floating: requests */}
      <div className="absolute float-b" style={{ bottom: 30, left: 4 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '10px 18px', boxShadow: '0 14px 36px rgba(0,0,0,0.15)', minWidth: 132 }}>
          <p style={{ fontSize: 10, color: '#8AAEE0', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>Requests / Day</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#638ECB', lineHeight: 1 }}>1,000+</p>
        </div>
      </div>

      {/* Status pill */}
      <div className="absolute float-c" style={{ top: 106, left: 0 }}>
        <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 30, padding: '7px 14px', border: '1px solid rgba(255,255,255,0.30)', backdropFilter: 'blur(8px)' }}>
          <span style={{ fontSize: 12, color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
            All Systems Online
          </span>
        </div>
      </div>

      {/* Uptime pill */}
      <div className="absolute float-a" style={{ bottom: 98, right: 2, animationDelay: '1.6s' }}>
        <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 30, padding: '7px 14px', border: '1px solid rgba(255,255,255,0.30)', backdropFilter: 'blur(8px)' }}>
          <span style={{ fontSize: 12, color: 'white', fontWeight: 700 }}>99.9% Uptime</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Feature card ─────────────────────────────────────────────────────────── */
function FeatureCard({ d, d2, title, desc, iconBg, iconColor, link }) {
  const inner = (
    <div className="group relative bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden h-full"
      style={{ border: '1.5px solid #D5DEEF' }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${iconBg}90 0%, transparent 55%)` }} />
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-transform duration-200 group-hover:scale-110"
          style={{ background: iconBg, color: iconColor }}>
          <Icon d={d} d2={d2} className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-[#0F172A] text-base mb-1.5">{title}</h3>
        <p className="text-sm text-[#64748B] leading-relaxed">{desc}</p>
        <div className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold transition-all duration-200 group-hover:gap-2.5"
          style={{ color: iconColor }}>
          Open <Icon d={P.arrow} className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  )
  return link ? <Link to={link} className="block h-full">{inner}</Link> : inner
}

/* ─── Section eyebrow ──────────────────────────────────────────────────────── */
function Eyebrow({ text, center = false }) {
  return (
    <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] mb-3 ${center ? 'justify-center' : ''}`}
      style={{ color: '#638ECB' }}>
      <span style={{ width: 22, height: 2, background: '#638ECB', display: 'inline-block', borderRadius: 2 }} />
      {text}
    </p>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user, isAdmin, isTechnician } = useAuth()

  const roleLabel = {
    SUPER_ADMIN: 'Super Administrator',
    ADMIN: 'Administrator',
    TECHNICIAN: 'Technician',
    USER: 'Campus Member',
  }[user?.role] || user?.role

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section id="home" className="relative overflow-hidden"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80")',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          minHeight: '76vh',
        }}
      >
        {/* Palette overlay: #395886 → #638ECB */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(57,88,134,0.78) 0%, rgba(74,111,165,0.68) 50%, rgba(99,142,203,0.72) 100%)' }} />
        {/* Fine dot texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center" style={{ minHeight: '73vh' }}>
          <div className="w-full flex items-center justify-between gap-10 py-16">

            {/* Left content */}
            <div className="flex-1 max-w-xl fade-up">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] mb-5"
                style={{ color: '#B1C9EF' }}>
                <span style={{ width: 30, height: 2, background: '#8AAEE0', display: 'inline-block', borderRadius: 2 }} />
                Welcome to Smart Campus
              </p>
              <h1 className="font-extrabold leading-[1.08] tracking-tight mb-2 text-white"
                style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}>
                Good {greeting},
              </h1>
              <h2 className="font-extrabold leading-[1.08] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#D5DEEF' }}>
                {user?.name?.split(' ')[0] || 'Student'}
              </h2>
              <p className="leading-relaxed mb-8" style={{ fontSize: '1.08rem', maxWidth: 460, color: '#B1C9EF' }}>
                Your complete platform for facility bookings, maintenance requests, and campus resource management — all in one place.
              </p>
              <div className="mb-10">
                <span className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.13)', color: 'white', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                  {roleLabel} · Active
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="#quick-access" onClick={scrollTo('quick-access')}
                  className="inline-flex items-center gap-2 font-bold text-sm rounded-xl transition-all duration-200 hover:shadow-xl hover:gap-3"
                  style={{ background: 'white', color: '#395886', padding: '14px 28px' }}>
                  Get Started <Icon d={P.arrow} className="w-4 h-4" />
                </a>
                <a href="#contact" onClick={scrollTo('contact')}
                  className="inline-flex items-center gap-2 font-bold text-sm rounded-xl transition-all duration-200"
                  style={{ border: '2px solid rgba(255,255,255,0.38)', color: 'white', padding: '14px 28px' }}>
                  Contact Us
                </a>
              </div>
            </div>

            {/* Right illustration */}
            <div className="hidden lg:block flex-1 fade-up-delay-2">
              <HeroIllustration />
            </div>
          </div>
        </div>

        {/* Wave → white about section */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
            <path d="M0,42 C240,60 480,18 720,38 C960,58 1200,14 1440,34 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════ */}
      <section id="about" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-14 xl:gap-20 items-start">

            {/* Left */}
            <div style={{ maxWidth: 380 }} className="flex-shrink-0">
              <Eyebrow text="About Us" />
              <h2 className="text-3xl font-extrabold leading-tight mb-5" style={{ color: '#0F172A' }}>
                Welcome to{' '}
                <span style={{ color: '#395886' }}>Smart Campus</span>,<br />
                a modern operations platform
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>
                We believe every campus member deserves a seamless experience. Our platform connects students, staff, and administrators to manage facilities, resolve issues, and book resources with ease.
              </p>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#64748B' }}>
                Built for modern universities, Smart Campus streamlines day-to-day operations and empowers every role — from students to super admins.
              </p>
              <a href="#quick-access" onClick={scrollTo('quick-access')}
                className="inline-flex items-center gap-2 font-bold text-sm rounded-xl text-white transition-all duration-200 hover:shadow-lg hover:gap-3"
                style={{ background: '#395886', padding: '12px 24px' }}>
                Learn More <Icon d={P.arrow} className="w-4 h-4" />
              </a>
            </div>

            {/* Right 2×3 grid — shades of palette */}
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { d: P.calendar, title: 'Facility Booking',  desc: 'Reserve rooms, labs, and lecture halls.',         color: '#395886', bg: '#D5DEEF' },
                  { d: P.ticket,   title: 'Support Tickets',   desc: 'Submit and track maintenance requests.',           color: '#638ECB', bg: '#F0F3FA' },
                  { d: P.stack,    title: 'Campus Resources',  desc: 'Browse all campus facilities and equipment.',     color: '#395886', bg: '#B1C9EF' },
                  { d: P.cog1, d2: P.cog2, title: 'Maintenance', desc: 'Fast resolution by expert technicians.',       color: '#638ECB', bg: '#D5DEEF' },
                  { d: P.users1,   title: 'Administration',    desc: 'Manage users, roles, and permissions.',            color: '#395886', bg: '#F0F3FA' },
                  { d: P.bell,     title: 'Notifications',     desc: 'Stay updated with real-time alerts.',              color: '#638ECB', bg: '#B1C9EF' },
                ].map(item => (
                  <div key={item.title}
                    className="flex flex-col items-center text-center p-5 rounded-2xl bg-white group hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                    style={{ border: '1.5px solid #D5DEEF' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200"
                      style={{ background: item.bg, color: item.color, border: `2px solid ${item.bg}` }}>
                      <Icon d={item.d} d2={item.d2} className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#0F172A' }}>{item.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          STATS — #F0F3FA background, palette cards
      ══════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ background: '#F0F3FA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow text="By the Numbers" center />
            <h2 className="text-3xl font-extrabold" style={{ color: '#0F172A' }}>
              Campus at a <span style={{ color: '#395886' }}>Glance</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '50+',    label: 'Campus Facilities',  d: P.stack,  color: '#395886', bg: '#D5DEEF', border: '#B1C9EF' },
              { num: '200+',   label: 'Active Staff',        d: P.users1, color: '#638ECB', bg: '#F0F3FA', border: '#D5DEEF' },
              { num: '1,000+', label: 'Daily Requests',      d: P.spark,  color: '#395886', bg: '#B1C9EF', border: '#8AAEE0' },
              { num: '99.9%',  label: 'Platform Uptime',     d: P.shield, color: '#638ECB', bg: '#D5DEEF', border: '#B1C9EF' },
            ].map(s => (
              <div key={s.label}
                className="flex flex-col items-center text-center p-7 rounded-2xl bg-white transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                style={{ border: `1.5px solid ${s.border}` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: s.bg, color: s.color }}>
                  <Icon d={s.d} className="w-6 h-6" />
                </div>
                <p className="font-extrabold leading-none mb-1.5" style={{ fontSize: '2.4rem', color: s.color }}>{s.num}</p>
                <p className="text-sm font-semibold" style={{ color: '#64748B' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          QUICK ACCESS
      ══════════════════════════════════════════════════════ */}
      <section id="quick-access" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Eyebrow text="Your Workspace" center />
            <h2 className="text-3xl font-extrabold" style={{ color: '#0F172A' }}>
              Our Featured <span style={{ color: '#395886' }}>Services</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-sm" style={{ color: '#64748B' }}>
              Everything you need to manage your campus experience, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard d={P.calendar} title="My Bookings"
              desc="View and manage your facility reservations — rooms, labs, lecture halls, and more."
              iconBg="#D5DEEF" iconColor="#395886" link="/bookings/my" />
            <FeatureCard d={P.ticket} title="My Tickets"
              desc="Track all your maintenance and support requests from submission to resolution."
              iconBg="#F0F3FA" iconColor="#638ECB" />
            <FeatureCard d={P.stack} title="Resources"
              desc="Browse all available campus facilities, equipment, and shared resources."
              iconBg="#B1C9EF" iconColor="#395886" link="/resource-catalogue" />
            {(isTechnician || isAdmin) && (
              <FeatureCard d={P.cog1} d2={P.cog2} title="Assigned Tickets"
                desc="Manage and resolve maintenance tickets assigned to your team."
                iconBg="#D5DEEF" iconColor="#638ECB" link="/technician" />
            )}
            {isAdmin && (
              <FeatureCard d={P.users1} title="Admin Panel"
                desc="Manage users, approve requests, assign roles, and monitor platform activity."
                iconBg="#F0F3FA" iconColor="#395886" link="/admin" />
            )}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          BANNER — campus photo, cinematic overlay
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-32"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&auto=format&fit=crop&q=80")',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark base */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,18,40,0.75)' }} />
        {/* Palette left-side wash */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(57,88,134,0.35) 0%, transparent 65%)' }} />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="mx-auto mb-8 flex items-center justify-center"
            style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.42)', boxShadow: '0 0 0 14px rgba(255,255,255,0.06)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 4 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h2 className="font-extrabold text-white leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}>
            Today a student. Tomorrow a campus{' '}
            <em style={{ color: '#8AAEE0', fontStyle: 'italic', fontWeight: 800 }}>leader</em>.
          </h2>
          <p className="mt-5 text-lg" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Smart Campus powers the operations behind your academic journey.
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════ */}
      <section id="contact" style={{ background: '#F0F3FA' }} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Eyebrow text="Contact" center />
            <h2 className="text-3xl font-extrabold" style={{ color: '#0F172A' }}>
              Get in <span style={{ color: '#395886' }}>Touch</span>
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#64748B' }}>Have questions? Our team is ready to help.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold mb-6" style={{ color: '#0F172A' }}>Contact Information</h3>
              {[
                { d: P.mail,  label: 'Email',   value: 'support@smartcampus.edu', color: '#395886', bg: '#D5DEEF' },
                { d: P.phone, label: 'Phone',   value: '+94 11 234 5678',          color: '#638ECB', bg: '#F0F3FA' },
                { d: P.pin,   label: 'Address', value: 'No. 40, Campus Road, Colombo 07', color: '#395886', bg: '#B1C9EF' },
              ].map(item => (
                <div key={item.label}
                  className="flex items-start gap-4 p-4 bg-white rounded-2xl hover:shadow-md transition-shadow duration-200"
                  style={{ border: '1.5px solid #D5DEEF' }}>
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: item.bg, color: item.color }}>
                    <Icon d={item.d} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8AAEE0' }}>{item.label}</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: '#0F172A' }}>{item.value}</p>
                  </div>
                </div>
              ))}

              {/* Info strip */}
              <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: '#D5DEEF', border: '1.5px solid #B1C9EF' }}>
                <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#B1C9EF', color: '#395886' }}>
                  <Icon d={P.info} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#395886' }}>Smart Campus Hub</p>
                  <p className="text-sm mt-0.5 leading-relaxed" style={{ color: '#638ECB' }}>
                    Your central platform for facility bookings, maintenance requests, and campus resource management.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-8" style={{ border: '1.5px solid #D5DEEF', boxShadow: '0 4px 24px rgba(57,88,134,0.08)' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#0F172A' }}>Send a Message</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input className="input" placeholder="John"
                      defaultValue={user?.name?.split(' ')[0] || ''} readOnly />
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input className="input" placeholder="Doe"
                      defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} readOnly />
                  </div>
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" placeholder="you@example.com"
                    defaultValue={user?.email || ''} readOnly />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input className="input" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className="input resize-none" rows={4}
                    placeholder="Tell us more about your inquiry…" />
                </div>
                <button className="btn-primary w-full py-3 text-sm font-bold rounded-xl">
                  Send Message →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer style={{ background: 'linear-gradient(160deg, #223860 0%, #395886 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.12)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M12 3L3 9.5V20C3 20.6 3.4 21 4 21H8.5V15.5H15.5V21H20C20.6 21 21 20.6 21 20V9.5L12 3Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-extrabold text-base leading-none">Smart Campus</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] mt-0.5" style={{ color: '#8AAEE0' }}>Operations Hub</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#B1C9EF' }}>
                Empowering campuses with modern tools for seamless day-to-day operations and management.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.16em] mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home',     id: 'home'         },
                  { label: 'About',    id: 'about'        },
                  { label: 'Services', id: 'quick-access' },
                  { label: 'Contact',  id: 'contact'      },
                ].map(l => (
                  <li key={l.label}>
                    <a href={`#${l.id}`}
                      onClick={(e) => { e.preventDefault(); document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' }) }}
                      className="text-sm hover:text-white transition-colors flex items-center gap-2"
                      style={{ color: '#B1C9EF' }}>
                      <span style={{ width: 14, height: 1.5, background: '#8AAEE0', display: 'inline-block', borderRadius: 2 }} />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.16em] mb-5">Services</h4>
              <ul className="space-y-3">
                {['Facility Booking', 'Support Tickets', 'Campus Resources', 'Maintenance', 'Administration'].map(s => (
                  <li key={s} className="flex items-center gap-2 text-sm" style={{ color: '#B1C9EF' }}>
                    <span style={{ width: 14, height: 1.5, background: '#8AAEE0', display: 'inline-block', borderRadius: 2 }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.16em] mb-5">Contact</h4>
              <ul className="space-y-4">
                {[
                  { d: P.mail,  text: 'support@smartcampus.edu' },
                  { d: P.phone, text: '+94 11 234 5678' },
                  { d: P.pin,   text: 'No. 40, Campus Road, Colombo 07' },
                ].map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon d={c.d} className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#8AAEE0' }} />
                    <span className="text-sm leading-relaxed" style={{ color: '#B1C9EF' }}>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: '#8AAEE0' }}>
              © {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Help Center'].map(link => (
                <a key={link} href="#" className="text-xs hover:text-white transition-colors" style={{ color: '#8AAEE0' }}>{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
