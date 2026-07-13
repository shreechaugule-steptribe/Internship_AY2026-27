import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: 'var(--dark)' }}>
      {/* Background orbs */}
      <div style={{ position:'fixed', top:'-20%', left:'-10%', width:500, height:500,
        background:'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-20%', right:'-10%', width:600, height:600,
        background:'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div className="card-glass p-5 animate-in" style={{ width:'100%', maxWidth:440, zIndex:1 }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 pulse-glow"
            style={{ width:60, height:60, background:'var(--gradient-main)' }}>
            <i className="bi bi-mortarboard-fill text-white fs-3" />
          </div>
          <h1 className="section-title mb-1" style={{ fontSize:'1.5rem' }}>Welcome Back</h1>
          <p className="text-secondary" style={{ fontSize:'0.875rem' }}>Sign in to ZCOER Internship Portal</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>
              Email / Student ID
            </label>
            <div className="input-group">
              <span className="input-group-text" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--dark-border)', borderRight:'none', color:'var(--text-secondary)' }}>
                <i className="bi bi-envelope" />
              </span>
              <input type="text" name="email" value={form.email} onChange={handleChange}
                className="form-control form-control-dark" placeholder="student@zcoer.ac.in" required
                style={{ borderLeft:'none' }} />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label fw-semibold mb-0" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Password</label>
              <Link to="/forgot-password" className="text-decoration-none" style={{ fontSize:'0.8rem', color:'var(--primary)' }}>Forgot password?</Link>
            </div>
            <div className="input-group">
              <span className="input-group-text" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--dark-border)', borderRight:'none', color:'var(--text-secondary)' }}>
                <i className="bi bi-lock" />
              </span>
              <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                className="form-control form-control-dark" placeholder="••••••••" required
                style={{ borderLeft:'none', borderRight:'none' }} />
              <button type="button" className="input-group-text"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--dark-border)', borderLeft:'none', cursor:'pointer', color:'var(--text-secondary)' }}
                onClick={() => setShowPw(v => !v)}>
                <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary-custom w-100 py-2 mb-3" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mb-0" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="text-decoration-none fw-semibold" style={{ color:'var(--primary)' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
