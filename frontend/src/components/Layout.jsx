import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen" style={{ background: '#F0F3FA' }}>
      <Navbar />
      <main className="overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
