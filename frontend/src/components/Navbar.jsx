import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationApi } from '../api/notificationApi'
import NotificationPanel from './NotificationPanel'

const CampusLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L3 9.5V20C3 20.6 3.4 21 4 21H8.5V15.5H15.5V21H20C20.6 21 21 20.6 21 20V9.5L12 3Z" fill="white" />
    <rect x="10" y="15.5" width="4" height="5.5" rx="0.5" fill="rgba(255,255,255,0.5)" />
  </svg>
)

export default function Navbar() {
  const { user, logout, isAdmin, isTechnician } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount]           = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
<<<<<<< HEAD
  const [showUserMenu, setShowUserMenu]           = useState(false)
=======
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
>>>>>>> dev
  const notifRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const { count } = await notificationApi.getUnreadCount()
      setUnreadCount(count)
    } catch {}
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSectionLink = (id) => (e) => {
    e.preventDefault()
    if (window.location.pathname !== '/dashboard') {
      navigate('/dashboard')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 350)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-white text-[#395886] shadow-sm'
        : 'text-[#D5DEEF] hover:bg-white/10 hover:text-white'
    }`

  const anchorLinkClass =
    'relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-[#D5DEEF] hover:bg-white/10 hover:text-white cursor-pointer'

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'linear-gradient(135deg, #395886 0%, #2D4A73 100%)'
          : 'linear-gradient(135deg, #4A6FA5 0%, #395886 100%)',
        boxShadow: scrolled ? '0 4px 24px rgba(57,88,134,0.40)' : '0 2px 12px rgba(57,88,134,0.22)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

<<<<<<< HEAD
          {/* Left: logo + nav links */}
=======
          {/* ── Brand ── */}
>>>>>>> dev
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div
                className="flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
                style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
              >
                <CampusLogo />
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-[17px] tracking-tight leading-none">Smart Campus</span>
                <span className="block text-blue-200 text-[10px] font-medium tracking-widest uppercase leading-none mt-0.5">Operations Hub</span>
              </div>
            </Link>

            {/* ── Nav links ── */}
            <div className="hidden md:flex items-center gap-1">
<<<<<<< HEAD
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>

              {/* ── Booking links (visible to all logged-in users) ── */}
              <NavLink to="/bookings/my" className={navLinkClass}>My Bookings</NavLink>
              <NavLink to="/bookings/new" className={navLinkClass}>New Booking</NavLink>

              {/* ── Role-specific links ── */}
=======
              <NavLink to="/dashboard" className={navLinkClass}>Home</NavLink>
              <a onClick={handleSectionLink('about')} className={anchorLinkClass}>About</a>
>>>>>>> dev
              {(isAdmin || isTechnician) && (
                <NavLink to="/technician" className={navLinkClass}>Technician</NavLink>
              )}
              {isAdmin && (
<<<<<<< HEAD
                <>
                  <NavLink to="/bookings/admin" className={navLinkClass}>Booking Mgmt</NavLink>
                  <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                </>
=======
                <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
>>>>>>> dev
              )}
              <a onClick={handleSectionLink('contact')} className={anchorLinkClass}>Contact</a>
            </div>
          </div>

<<<<<<< HEAD
          {/* Right: notifications + user menu */}
          <div className="flex items-center gap-4">
=======
          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
>>>>>>> dev

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 focus:outline-none"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full ring-2 ring-[#395886]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationPanel
                  onClose={() => { setShowNotifications(false); fetchUnreadCount() }}
                />
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-200 focus:outline-none"
              >
<<<<<<< HEAD
                {user?.pictureUrl
                  ? <img src={user.pictureUrl} alt="" className="h-8 w-8 rounded-full" />
                  : <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.[0]}
                    </div>
                }
                <span className="hidden md:block text-sm font-medium">{user?.name}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
=======
                {user?.pictureUrl ? (
                  <img src={user.pictureUrl} alt="" className="h-8 w-8 rounded-full ring-2 ring-white/30 object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/30">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <span className="block text-sm font-semibold text-white leading-tight">{user?.name?.split(' ')[0]}</span>
                  <span
                    className="block text-[10px] font-medium leading-tight px-1.5 py-0.5 rounded-full mt-0.5 w-fit"
                    style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.9)' }}
                  >
                    {user?.role}
                  </span>
                </div>
                <svg className="hidden md:block h-3.5 w-3.5 text-blue-200 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl z-50 overflow-hidden"
                  style={{ background: 'white', border: '1.5px solid #D5DEEF' }}
                >
                  <div className="px-4 py-3.5" style={{ background: 'linear-gradient(135deg, #F0F3FA, #F8FAFF)', borderBottom: '1px solid #D5DEEF' }}>
                    <div className="flex items-center gap-3">
                      {user?.pictureUrl ? (
                        <img src={user.pictureUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-[#395886] flex items-center justify-center text-white font-bold text-sm">
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#0F172A] truncate">{user?.name}</p>
                        <p className="text-xs text-[#64748B] truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#D5DEEF', color: '#395886' }}>
                          {user?.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
>>>>>>> dev
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  )
}