const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/afyaquest';

async function resetDemoUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Import User model
    const User = require('./models/User.model');

    // Check if demo user exists
    let demoUser = await User.findOne({ email: 'demo@afyaquest.com' });
    
    if (demoUser) {
      // Update existing demo user
      demoUser.password = 'demo123';
      demoUser.name = 'Demo User';
      await demoUser.save();
      console.log('Demo user password reset successfully');
    } else {
      // Create new demo user
      demoUser = new User({
        name: 'Demo User',
        email: 'demo@afyaquest.com',
        password: 'demo123',
        role: 'cha',
        phone: '+1234567890',
        location: 'Demo City',
        language: 'en'
      });
      await demoUser.save();
      console.log('Demo user created successfully');
    }

    console.log('Demo user credentials:');
    console.log('Email: demo@afyaquest.com');
    console.log('Password: demo123');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetDemoUser();