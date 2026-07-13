import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const studentLinks = [
  { to: '/dashboard',    icon: 'bi-grid-1x2-fill',     label: 'Dashboard' },
  { to: '/companies',    icon: 'bi-building',           label: 'Companies' },
  { to: '/applications', icon: 'bi-file-earmark-text',  label: 'My Applications' },
  { to: '/profile',      icon: 'bi-person-circle',      label: 'Profile' },
]

const adminLinks = [
  { to: '/admin/dashboard',    icon: 'bi-speedometer2',      label: 'Dashboard' },
  { to: '/admin/students',     icon: 'bi-people-fill',       label: 'Students' },
  { to: '/admin/companies',    icon: 'bi-building-fill',     label: 'Companies' },
  { to: '/admin/applications', icon: 'bi-clipboard2-data',   label: 'Applications' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = user?.role === 'admin' ? adminLinks : studentLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="px-4 py-4 border-bottom" style={{ borderColor: 'var(--dark-border)' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 40, height: 40, background: 'var(--gradient-main)' }}>
            <i className="bi bi-mortarboard-fill text-white fs-5" />
          </div>
          <div>
            <div className="fw-bold" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem' }}>ZCOER Portal</div>
            <div className="text-secondary" style={{ fontSize: '0.72rem' }}>{user?.role === 'admin' ? 'Admin Panel' : 'Student Panel'}</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3">
        {links.map(link => (
          <NavLink key={link.to} to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className={`bi ${link.icon} fs-5`} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-top" style={{ borderColor: 'var(--dark-border)' }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 36, height: 36, background: 'var(--gradient-main)', fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div className="fw-semibold text-truncate" style={{ fontSize: '0.85rem' }}>{user?.name}</div>
            <div className="text-secondary text-truncate" style={{ fontSize: '0.72rem' }}>{user?.email}</div>
          </div>
        </div>
        <button className="btn btn-sm w-100 d-flex align-items-center gap-2 justify-content-center"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem' }}
          onClick={handleLogout}>
          <i className="bi bi-box-arrow-right" />
          Logout
        </button>
      </div>
    </div>
  )
}
