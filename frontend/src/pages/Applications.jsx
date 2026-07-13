import { useEffect, useState } from 'react'
import api from '../api/axios'

const statusMap = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' }

export default function Applications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/applications/my').then(r => setApps(r.data.applications || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="section-title mb-1">My Applications</h1>
          <p className="text-secondary mb-0">Track all your internship applications</p>
        </div>
        <div className="d-flex gap-2">
          {['all','pending','approved','rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="btn btn-sm"
              style={{
                background: filter === s ? 'var(--gradient-main)' : 'rgba(255,255,255,0.05)',
                color: '#fff', border: 'none', borderRadius:'0.5rem',
                textTransform:'capitalize', fontWeight: filter === s ? 600 : 400
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card-glass p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-secondary">No {filter} applications.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark-custom">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a._id}>
                    <td className="text-secondary">{i + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {a.company?.logo
                          ? <img src={a.company.logo} alt="" style={{ width:28, height:28, objectFit:'contain', background:'#fff', borderRadius:4, padding:2 }} />
                          : <div className="d-flex align-items-center justify-content-center rounded-1"
                              style={{ width:28, height:28, background:'rgba(99,102,241,0.15)', color:'var(--primary)', fontSize:'0.8rem' }}>
                              <i className="bi bi-building" />
                            </div>
                        }
                        <span className="fw-semibold">{a.company?.name}</span>
                      </div>
                    </td>
                    <td className="text-secondary">{a.role}</td>
                    <td className="text-secondary">{a.company?.location || '—'}</td>
                    <td className="text-secondary">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge-status ${statusMap[a.status] || ''}`}>{a.status}</span></td>
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
