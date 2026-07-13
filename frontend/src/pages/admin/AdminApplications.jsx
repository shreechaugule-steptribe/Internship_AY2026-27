import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toast } from 'react-toastify'

const statusMap = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' }

export default function AdminApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/admin/applications').then(r => setApps(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/applications/${id}/status`, { status })
      setApps(a => a.map(x => x._id === id ? { ...x, status } : x))
      toast.success(`Application ${status}`)
    } catch { toast.error('Update failed.') }
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="section-title mb-1">Applications</h1>
          <p className="text-secondary mb-0">Review and manage student applications</p>
        </div>
        <div className="d-flex gap-2">
          {['all','pending','approved','rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="btn btn-sm"
              style={{
                background: filter === s ? 'var(--gradient-main)' : 'rgba(255,255,255,0.05)',
                color:'#fff', border:'none', borderRadius:'0.5rem',
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
        ) : (
          <div className="table-responsive">
            <table className="table table-dark-custom">
              <thead>
                <tr><th>#</th><th>Student</th><th>Company</th><th>Role</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a._id}>
                    <td className="text-secondary">{i+1}</td>
                    <td>
                      <div className="fw-semibold">{a.student?.name}</div>
                      <div className="text-secondary" style={{ fontSize:'0.8rem' }}>{a.student?.studentId}</div>
                    </td>
                    <td className="fw-semibold">{a.company?.name}</td>
                    <td className="text-secondary">{a.role}</td>
                    <td className="text-secondary">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge-status ${statusMap[a.status] || ''}`}>{a.status}</span></td>
                    <td>
                      {a.status === 'pending' && (
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm" style={{ background:'rgba(16,185,129,0.1)', color:'#10b981', border:'none', borderRadius:'0.4rem' }}
                            onClick={() => updateStatus(a._id, 'approved')}>
                            <i className="bi bi-check-lg" />
                          </button>
                          <button className="btn btn-sm" style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', borderRadius:'0.4rem' }}
                            onClick={() => updateStatus(a._id, 'rejected')}>
                            <i className="bi bi-x-lg" />
                          </button>
                        </div>
                      )}
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
