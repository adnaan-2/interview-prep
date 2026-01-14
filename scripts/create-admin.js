const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env.local' });

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Define User model directly in script
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    // Check if admin exists
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`✅ Admin already exists: ${existingAdmin.email}, role: ${existingAdmin.role}`);
      
      // Update role if needed
      if (existingAdmin.role !== 'admin') {
        console.log('⚠️ Updating user to admin role');
        await User.updateOne(
          { email: adminEmail },
          { $set: { role: 'admin' } }
        );
        console.log('✅ User updated to admin role');
      }
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash('secureadminpassword123', 10);
      
      const newAdmin = new User({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
      });
      
      await newAdmin.save();
      console.log('✅ New admin created:', newAdmin.email);
    }
    
    console.log('\n👉 Admin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: secureadminpassword123');
    
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdmin();