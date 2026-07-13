import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { BarChart, DoughnutChart, LineChart } from '../components/Charts'
import api from '../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/applications/my-stats'),
      api.get('/applications/my?limit=5')
    ]).then(([s, r]) => {
      setStats(s.data)
      setRecent(r.data.applications || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const barData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
    datasets: [{
      label: 'Applications',
      data: [2,5,3,8,6,4],
      backgroundColor: 'rgba(99,102,241,0.7)',
      borderRadius: 6
    }]
  }

  const doughnutData = {
    labels: ['Pending','Approved','Rejected'],
    datasets: [{
      data: [stats.pending, stats.approved, stats.rejected],
      backgroundColor: ['rgba(245,158,11,0.8)','rgba(16,185,129,0.8)','rgba(239,68,68,0.8)'],
      borderWidth: 0
    }]
  }

  const statCards = [
    { label:'Total Applied',  value: stats.total,    icon:'bi-send-fill',         cls:'blue' },
    { label:'Pending',        value: stats.pending,  icon:'bi-hourglass-split',   cls:'amber' },
    { label:'Approved',       value: stats.approved, icon:'bi-check-circle-fill', cls:'green' },
    { label:'Rejected',       value: stats.rejected, icon:'bi-x-circle-fill',     cls:'cyan' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="section-title mb-1">Dashboard</h1>
        <p className="text-secondary">Welcome back, <strong className="text-white">{user?.name}</strong> 👋</p>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map(s => (
          <div className="col-6 col-lg-3" key={s.label}>
            <div className="stat-card animate-in">
              <div className={`stat-icon ${s.cls}`}><i className={`bi ${s.icon}`} /></div>
              <div>
                <div className="fw-bold" style={{ fontSize:'1.75rem', lineHeight:1 }}>{loading ? '—' : s.value}</div>
                <div className="text-secondary" style={{ fontSize:'0.8rem' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card-glass p-4">
            <h6 className="fw-semibold mb-3" style={{ color:'var(--text-secondary)' }}>Monthly Applications</h6>
            <BarChart data={barData} height={220} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card-glass p-4">
            <h6 className="fw-semibold mb-3" style={{ color:'var(--text-secondary)' }}>Status Breakdown</h6>
            <DoughnutChart data={doughnutData} height={220} />
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card-glass p-4">
        <h6 className="fw-semibold mb-3" style={{ color:'var(--text-secondary)' }}>Recent Applications</h6>
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
        ) : recent.length === 0 ? (
          <div className="text-center py-4 text-secondary">No applications yet. <a href="/companies" className="text-decoration-none" style={{ color:'var(--primary)' }}>Browse companies →</a></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark-custom">
              <thead>
                <tr>
                  <th>Company</th><th>Role</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(app => (
                  <tr key={app._id}>
                    <td className="fw-semibold">{app.company?.name}</td>
                    <td className="text-secondary">{app.role}</td>
                    <td className="text-secondary">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge-status badge-${app.status}`}>{app.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
