import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';

async function createAdminUser() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists:', existingAdmin.email);
      console.log('To create a new admin, delete the existing one from MongoDB first.');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed by the User model
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
