const express = require('express')
const router = express.Router()
const { upload } = require('../config/cloudinary')
const { protect } = require('../middleware/authMiddleware')

// POST /api/upload — upload a single file to Cloudinary
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file provided' })
  res.json({ url: req.file.path, publicId: req.file.filename })
})

module.exports = router
