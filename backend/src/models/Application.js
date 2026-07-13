const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  role:    { type: String, required: true },
  status:  { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  resume:  { type: String },
  remarks: { type: String }
}, { timestamps: true })

// Prevent duplicate applications to the same company
applicationSchema.index({ student: 1, company: 1 }, { unique: true })

module.exports = mongoose.model('Application', applicationSchema)
