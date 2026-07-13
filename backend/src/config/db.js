const mongoose = require('mongoose')
const User = require('../models/User')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    
    // Seed super admin user
    const adminEmail = 'it.zcoer@zealeducation.com'
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (!existingAdmin) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin'
      })
      console.log(`✅ Super Admin created: ${adminEmail}`)
    } else {
      console.log(`✅ Super Admin already exists.`)
    }

  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
