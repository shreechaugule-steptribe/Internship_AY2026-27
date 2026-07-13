import { useEffect, useState } from 'react'
import api from '../api/axios'
import { toast } from 'react-toastify'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [applying, setApplying] = useState(null)

  useEffect(() => {
    api.get('/companies').then(r => setCompanies(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  )

  const apply = async (companyId, role) => {
    setApplying(companyId)
    try {
      await api.post('/applications', { companyId, role })
      toast.success('Application submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply.')
    } finally {
      setApplying(null)
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="section-title mb-1">Companies</h1>
          <p className="text-secondary mb-0">Browse available internship opportunities</p>
        </div>
        <input className="form-control form-control-dark" style={{ maxWidth:260 }}
          placeholder="Search companies…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="card-glass p-5 text-center text-secondary">No companies found.</div>
      ) : (
        <div className="row g-3">
          {filtered.map(c => (
            <div className="col-md-6 col-xl-4" key={c._id}>
              <div className="card-glass p-4 h-100 d-flex flex-column">
                {/* Logo */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  {c.logo ? (
                    <img src={c.logo} alt={c.name} className="rounded-2"
                      style={{ width:48, height:48, objectFit:'contain', background:'#fff', padding:4 }} />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center rounded-2"
                      style={{ width:48, height:48, background:'rgba(99,102,241,0.15)', color:'var(--primary)', fontSize:'1.25rem' }}>
                      <i className="bi bi-building" />
                    </div>
                  )}
                  <div>
                    <div className="fw-bold">{c.name}</div>
                    <div className="text-secondary" style={{ fontSize:'0.8rem' }}>
                      <i className="bi bi-geo-alt me-1" />{c.location || 'Remote'}
                    </div>
                  </div>
                </div>

                <p className="text-secondary flex-grow-1" style={{ fontSize:'0.875rem', lineHeight:1.6 }}>
                  {c.description?.slice(0, 120) || 'No description available.'}…
                </p>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {(c.tags || []).slice(0,3).map(t => (
                    <span key={t} className="badge-status" style={{ background:'rgba(99,102,241,0.12)', color:'var(--primary)' }}>{t}</span>
                  ))}
                  {c.stipend && <span className="badge-status badge-approved">₹{c.stipend}/mo</span>}
                </div>

                <button className="btn-primary-custom w-100 py-2"
                  disabled={applying === c._id}
                  onClick={() => apply(c._id, c.roles?.[0] || 'Intern')}>
                  {applying === c._id ? <><span className="spinner-border spinner-border-sm me-2"/>Applying…</> : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
