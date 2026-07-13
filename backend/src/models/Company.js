const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String },
  location:    { type: String },
  website:     { type: String },
  logo:        { type: String },
  stipend:     { type: Number },
  roles:       [{ type: String }],
  tags:        [{ type: String }],
  isActive:    { type: Boolean, default: true },
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

module.exports = mongoose.model('Company', companySchema)
