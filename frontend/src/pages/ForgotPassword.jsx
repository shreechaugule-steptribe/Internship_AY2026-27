import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Reset link sent! Check your email.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background:'var(--dark)' }}>
      <div className="card-glass p-5 animate-in" style={{ width:'100%', maxWidth:420, zIndex:1 }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
            style={{ width:56, height:56, background:'var(--gradient-main)' }}>
            <i className="bi bi-shield-lock-fill text-white fs-4" />
          </div>
          <h1 className="section-title mb-1" style={{ fontSize:'1.4rem' }}>Forgot Password</h1>
          <p className="text-secondary" style={{ fontSize:'0.875rem' }}>Enter your email and we'll send a reset link</p>
        </div>

        {sent ? (
          <div className="text-center">
            <i className="bi bi-envelope-check-fill fs-1 mb-3" style={{ color:'var(--success)' }} />
            <p className="text-secondary">We sent a password reset link to <strong className="text-primary">{email}</strong>.</p>
            <Link to="/login" className="btn-primary-custom d-inline-block mt-3 px-4 py-2 text-decoration-none">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="form-control form-control-dark" placeholder="student@zcoer.ac.in" required />
            </div>
            <button type="submit" className="btn-primary-custom w-100 py-2 mb-3" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Sending…</> : 'Send Reset Link'}
            </button>
            <p className="text-center mb-0" style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>
              <Link to="/login" className="text-decoration-none" style={{ color:'var(--primary)' }}>← Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
