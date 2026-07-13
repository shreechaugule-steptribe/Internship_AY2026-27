import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/admin/students').then(r => setStudents(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const toggleActive = async (id, current) => {
    try {
      await api.patch(`/admin/students/${id}/toggle`)
      setStudents(s => s.map(st => st._id === id ? { ...st, isActive: !current } : st))
      toast.success(`Student ${current ? 'deactivated' : 'activated'}`)
    } catch { toast.error('Action failed.') }
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="section-title mb-1">Students</h1>
          <p className="text-secondary mb-0">{students.length} registered students</p>
        </div>
        <input className="form-control form-control-dark" style={{ maxWidth:260 }}
          placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card-glass p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark-custom">
              <thead>
                <tr><th>#</th><th>Name</th><th>Student ID</th><th>Branch</th><th>Year</th><th>Email</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s._id}>
                    <td className="text-secondary">{i+1}</td>
                    <td className="fw-semibold">{s.name}</td>
                    <td className="text-secondary">{s.studentId}</td>
                    <td className="text-secondary">{s.branch}</td>
                    <td className="text-secondary">{s.year}</td>
                    <td className="text-secondary" style={{ fontSize:'0.85rem' }}>{s.email}</td>
                    <td>
                      <span className={`badge-status ${s.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm"
                        style={{ background: s.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                          color: s.isActive ? '#ef4444' : '#10b981', border:'none', borderRadius:'0.4rem', fontSize:'0.8rem' }}
                        onClick={() => toggleActive(s._id, s.isActive)}>
                        {s.isActive ? 'Deactivate' : 'Activate'}
                      </button>
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
