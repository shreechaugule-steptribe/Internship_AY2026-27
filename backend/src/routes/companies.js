const express = require('express')
const router = express.Router()
const Company = require('../models/Company')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// GET /api/companies — all active companies (public for students)
router.get('/', protect, async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true }).sort('-createdAt')
    res.json(companies)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/companies/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
    if (!company) return res.status(404).json({ message: 'Company not found' })
    res.json(company)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/companies — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, addedBy: req.user.id })
    res.status(201).json(company)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/companies/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(company)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/companies/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id)
    res.json({ message: 'Company deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
