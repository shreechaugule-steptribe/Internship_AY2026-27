import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:'', location:'', description:'', stipend:'', tags:'' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    api.get('/companies').then(r => setCompanies(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/companies', { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })
      toast.success('Company added!')
      setShowForm(false)
      setForm({ name:'', location:'', description:'', stipend:'', tags:'' })
      load()
    } catch { toast.error('Failed to add company.') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this company?')) return
    try {
      await api.delete(`/companies/${id}`)
      setCompanies(c => c.filter(x => x._id !== id))
      toast.success('Company deleted.')
    } catch { toast.error('Delete failed.') }
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="section-title mb-1">Companies</h1>
          <p className="text-secondary mb-0">Manage internship listings</p>
        </div>
        <button className="btn-primary-custom px-4 py-2" onClick={() => setShowForm(v => !v)}>
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`} />{showForm ? 'Cancel' : 'Add Company'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card-glass p-4 mb-4 animate-in">
          <h6 className="fw-semibold mb-3" style={{ color:'var(--text-secondary)' }}>New Company</h6>
          <form onSubmit={handleAdd}>
            <div className="row g-3">
              <div className="col-md-6">
                <input name="name" value={form.name} onChange={handleChange} className="form-control form-control-dark" placeholder="Company Name" required />
              </div>
              <div className="col-md-6">
                <input name="location" value={form.location} onChange={handleChange} className="form-control form-control-dark" placeholder="Location (e.g., Pune)" />
              </div>
              <div className="col-md-6">
                <input name="stipend" value={form.stipend} onChange={handleChange} className="form-control form-control-dark" placeholder="Stipend (₹/month)" type="number" />
              </div>
              <div className="col-md-6">
                <input name="tags" value={form.tags} onChange={handleChange} className="form-control form-control-dark" placeholder="Tags (comma-separated, e.g. React, Node)" />
              </div>
              <div className="col-12">
                <textarea name="description" value={form.description} onChange={handleChange} className="form-control form-control-dark" rows={3} placeholder="Company description…" />
              </div>
            </div>
            <button type="submit" className="btn-primary-custom px-4 py-2 mt-3" disabled={saving}>
              {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : 'Add Company'}
            </button>
          </form>
        </div>
      )}

      <div className="card-glass p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark-custom">
              <thead>
                <tr><th>#</th><th>Name</th><th>Location</th><th>Stipend</th><th>Tags</th><th>Action</th></tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr key={c._id}>
                    <td className="text-secondary">{i+1}</td>
                    <td className="fw-semibold">{c.name}</td>
                    <td className="text-secondary">{c.location || '—'}</td>
                    <td className="text-secondary">{c.stipend ? `₹${c.stipend}/mo` : '—'}</td>
                    <td>
                      {(c.tags || []).map(t => (
                        <span key={t} className="badge-status me-1" style={{ background:'rgba(99,102,241,0.12)', color:'var(--primary)' }}>{t}</span>
                      ))}
                    </td>
                    <td>
                      <button className="btn btn-sm" style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', borderRadius:'0.4rem' }}
                        onClick={() => handleDelete(c._id)}>
                        <i className="bi bi-trash3" />
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
