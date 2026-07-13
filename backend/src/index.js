require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')

const app = express()

// Connect DB
connectDB()

// Security & Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 })
app.use('/api', limiter)

// ── Routes ────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'))
app.use('/api/companies',    require('./routes/companies'))
app.use('/api/applications', require('./routes/applications'))
app.use('/api/upload',       require('./routes/upload'))
app.use('/api/admin',        require('./routes/admin'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date() }))

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
