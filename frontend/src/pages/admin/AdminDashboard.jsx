import { useEffect, useState } from 'react'
import { BarChart, LineChart, DoughnutChart } from '../../components/Charts'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, companies: 0, applications: 0, approved: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const lineData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
    datasets: [{
      label: 'Applications',
      data: [10,25,18,42,35,28,50],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.12)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1'
    }]
  }

  const barData = {
    labels: ['Computer Eng.','IT','Mechanical','Civil','Electronics'],
    datasets: [{
      label: 'Students',
      data: [120,95,80,60,45],
      backgroundColor: [
        'rgba(99,102,241,0.75)','rgba(14,165,233,0.75)',
        'rgba(16,185,129,0.75)','rgba(245,158,11,0.75)','rgba(239,68,68,0.75)'
      ],
      borderRadius: 6
    }]
  }

  const doughnutData = {
    labels: ['Pending','Approved','Rejected'],
    datasets: [{
      data: [40, stats.approved, 15],
      backgroundColor: ['rgba(245,158,11,0.8)','rgba(16,185,129,0.8)','rgba(239,68,68,0.8)'],
      borderWidth: 0
    }]
  }

  const statCards = [
    { label:'Total Students',  value: stats.students,     icon:'bi-people-fill',       cls:'blue' },
    { label:'Companies',       value: stats.companies,    icon:'bi-building-fill',     cls:'cyan' },
    { label:'Applications',   value: stats.applications, icon:'bi-file-earmark-text', cls:'amber' },
    { label:'Approved',        value: stats.approved,     icon:'bi-check-circle-fill', cls:'green' },
  ]

  return (
    <div>
      <div className="mb-4">
        <h1 className="section-title mb-1">Admin Dashboard</h1>
        <p className="text-secondary">Overview of the internship portal activity</p>
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

      {/* Charts Row 1 */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card-glass p-4">
            <h6 className="fw-semibold mb-3" style={{ color:'var(--text-secondary)' }}>Application Trends (Monthly)</h6>
            <LineChart data={lineData} height={230} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card-glass p-4">
            <h6 className="fw-semibold mb-3" style={{ color:'var(--text-secondary)' }}>Application Status</h6>
            <DoughnutChart data={doughnutData} height={230} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="card-glass p-4">
        <h6 className="fw-semibold mb-3" style={{ color:'var(--text-secondary)' }}>Students by Branch</h6>
        <BarChart data={barData} height={220} />
      </div>
    </div>
  )
}
