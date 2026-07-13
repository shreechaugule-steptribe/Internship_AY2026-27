import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', studentId: '', branch: '', year: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await register(form)
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="mb-3">
      <label className="form-label fw-semibold" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{label}</label>
      <input type={type} name={name} value={form[name]} onChange={handleChange}
        className="form-control form-control-dark" placeholder={placeholder} required />
    </div>
  )

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ background:'var(--dark)', minHeight:'100vh' }}>
      <div style={{ position:'fixed', top:'-20%', right:'-10%', width:500, height:500,
        background:'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div className="card-glass p-5 animate-in" style={{ width:'100%', maxWidth:520, zIndex:1 }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
            style={{ width:56, height:56, background:'var(--gradient-main)' }}>
            <i className="bi bi-person-plus-fill text-white fs-4" />
          </div>
          <h1 className="section-title mb-1" style={{ fontSize:'1.4rem' }}>Create Account</h1>
          <p className="text-secondary" style={{ fontSize:'0.875rem' }}>Join ZCOER Internship Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">{field('name', 'Full Name', 'text', 'Ravi Sharma')}</div>
            <div className="col-md-6">{field('email', 'College Email', 'email', 'student@zcoer.ac.in')}</div>
            <div className="col-md-6">{field('studentId', 'Student ID', 'text', 'ZC2021001')}</div>
            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Branch</label>
              <select name="branch" value={form.branch} onChange={handleChange} className="form-select form-control-dark" required>
                <option value="">Select Branch</option>
                <option>Computer Engineering</option>
                <option>IT</option>
                <option>Mechanical</option>
                <option>Civil</option>
                <option>Electronics</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Year</label>
              <select name="year" value={form.year} onChange={handleChange} className="form-select form-control-dark" required>
                <option value="">Select Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
            <div className="col-md-6">{field('password', 'Password', 'password', '••••••••')}</div>
            <div className="col-md-6">{field('confirmPassword', 'Confirm Password', 'password', '••••••••')}</div>
          </div>

          <button type="submit" className="btn-primary-custom w-100 py-2 mt-3 mb-3" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating Account…</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mb-0" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none fw-semibold" style={{ color:'var(--primary)' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
