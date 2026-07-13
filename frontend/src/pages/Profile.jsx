import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [avatar, setAvatar] = useState(user?.avatar || null)
  const fileRef = useRef()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAvatarUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setAvatar(data.url)
      toast.success('Avatar uploaded!')
    } catch {
      toast.error('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/profile', { ...form, avatar })
      toast.success('Profile updated!')
    } catch {
      toast.error('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="section-title mb-1">My Profile</h1>
        <p className="text-secondary">Manage your personal information</p>
      </div>

      <div className="row g-4">
        {/* Avatar */}
        <div className="col-lg-4">
          <div className="card-glass p-4 text-center">
            <div className="position-relative d-inline-block mb-3">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="rounded-circle"
                  style={{ width:100, height:100, objectFit:'cover', border:'3px solid rgba(99,102,241,0.5)' }} />
              ) : (
                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                  style={{ width:100, height:100, background:'var(--gradient-main)', fontSize:'2.5rem', fontWeight:700, color:'#fff' }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <button className="position-absolute bottom-0 end-0 btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width:30, height:30, background:'var(--primary)', color:'#fff', border:'none' }}
                onClick={() => fileRef.current.click()} disabled={uploading}>
                {uploading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-camera-fill" style={{ fontSize:'0.75rem' }} />}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="d-none" onChange={handleAvatarUpload} />
            <div className="fw-bold fs-5">{user?.name}</div>
            <div className="text-secondary" style={{ fontSize:'0.85rem' }}>{user?.email}</div>
            <div className="mt-2">
              <span className="badge-status" style={{ background:'rgba(99,102,241,0.15)', color:'var(--primary)' }}>
                {user?.role === 'admin' ? 'Admin' : 'Student'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="col-lg-8">
          <div className="card-glass p-4">
            <h6 className="fw-semibold mb-4" style={{ color:'var(--text-secondary)' }}>Personal Information</h6>
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-control form-control-dark" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="form-control form-control-dark" placeholder="+91 9876543210" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Email</label>
                  <input value={user?.email || ''} className="form-control form-control-dark" disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Student ID</label>
                  <input value={user?.studentId || '—'} className="form-control form-control-dark" disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Branch</label>
                  <input value={user?.branch || '—'} className="form-control form-control-dark" disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Year</label>
                  <input value={user?.year || '—'} className="form-control form-control-dark" disabled />
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="btn-primary-custom px-4 py-2" disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
