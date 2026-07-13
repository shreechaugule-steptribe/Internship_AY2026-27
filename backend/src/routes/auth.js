const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const { protect } = require('../middleware/authMiddleware')

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, studentId, branch, year } = req.body
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({ name, email, password, studentId, branch, year })
    const token = signToken(user)
    res.status(201).json({ token, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' })

    if (!user.isActive)
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' })

    const token = signToken(user)
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, avatar }, { new: true })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).json({ message: 'No user with that email' })

    const token = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save()

    // In production, send email with reset link. For now, return token.
    res.json({ message: 'Reset link sent (check console in dev)', token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    })
    if (!user) return res.status(400).json({ message: 'Token invalid or expired' })

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    res.json({ message: 'Password reset successful' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
