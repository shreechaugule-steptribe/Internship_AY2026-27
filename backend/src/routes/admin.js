const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Company = require('../models/Company')
const Application = require('../models/Application')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Apply admin guard to all routes
router.use(protect, adminOnly)

// GET /api/admin/stats — Overall system stats
router.get('/stats', async (req, res) => {
  try {
    const [students, companies, applications, approved] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Company.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: 'approved' })
    ])
    res.json({ students, companies, applications, approved })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/admin/students — List all students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort('-createdAt')
    res.json(students)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/admin/students/:id/toggle — Activate/Deactivate student
router.patch('/students/:id/toggle', async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
    if (!student || student.role !== 'student')
      return res.status(404).json({ message: 'Student not found' })

    student.isActive = !student.isActive
    await student.save()
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/admin/applications — List all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email studentId branch year')
      .populate('company', 'name location')
      .sort('-createdAt')
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/admin/applications/:id/status
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status' })

    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('student', 'name')
      .populate('company', 'name')
    if (!app) return res.status(404).json({ message: 'Application not found' })

    res.json(app)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
