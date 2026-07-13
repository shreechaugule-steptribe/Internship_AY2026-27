import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'
import Applications from './pages/Applications'
import Profile from './pages/Profile'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminCompanies from './pages/admin/AdminCompanies'
import AdminApplications from './pages/admin/AdminApplications'

// Components
import Layout from './components/Layout'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status" />
  </div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/companies" element={<PrivateRoute><Layout><Companies /></Layout></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute><Layout><Applications /></Layout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><Layout><AdminDashboard /></Layout></PrivateRoute>} />
          <Route path="/admin/students" element={<PrivateRoute adminOnly><Layout><AdminStudents /></Layout></PrivateRoute>} />
          <Route path="/admin/companies" element={<PrivateRoute adminOnly><Layout><AdminCompanies /></Layout></PrivateRoute>} />
          <Route path="/admin/applications" element={<PrivateRoute adminOnly><Layout><AdminApplications /></Layout></PrivateRoute>} />
        </Routes>
      </Router>
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
    </AuthProvider>
  )
}
