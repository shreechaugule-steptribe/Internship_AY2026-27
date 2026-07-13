const express = require('express')
const router = express.Router()
const Application = require('../models/Application')
const { protect } = require('../middleware/authMiddleware')

// POST /api/applications — student applies
router.post('/', protect, async (req, res) => {
  try {
    const { companyId, role } = req.body
    const existing = await Application.findOne({ student: req.user.id, company: companyId })
    if (existing) return res.status(400).json({ message: 'Already applied to this company' })

    const app = await Application.create({ student: req.user.id, company: companyId, role })
    await app.populate(['student', 'company'])
    res.status(201).json(app)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/applications/my — student's own applications
router.get('/my', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const applications = await Application
      .find({ student: req.user.id })
      .populate('company', 'name location logo')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
    const total = await Application.countDocuments({ student: req.user.id })
    res.json({ applications, total, page: +page })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/applications/my-stats — student's stats
router.get('/my-stats', protect, async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Application.countDocuments({ student: req.user.id }),
      Application.countDocuments({ student: req.user.id, status: 'pending' }),
      Application.countDocuments({ student: req.user.id, status: 'approved' }),
      Application.countDocuments({ student: req.user.id, status: 'rejected' })
    ])
    res.json({ total, pending, approved, rejected })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
