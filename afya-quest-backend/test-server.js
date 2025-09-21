const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

// Database connection with error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/afyaquest';

console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Import User model
const User = require('./models/User.model');

// Simple test login endpoint
app.post('/api/auth/test-login', async (req, res) => {
  console.log('Test login endpoint hit');
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 5000);
    });
    
    // Find user with timeout
    const userPromise = User.findOne({ email });
    const user = await Promise.race([userPromise, timeoutPromise]);
    
    console.log('User query completed:', user ? 'found' : 'not found');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Simple password check for demo
    if (password !== 'demo123') {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Generate simple token
    const token = 'test-token-' + Date.now();
    
    console.log('Sending response...');
    res.json({
      message: 'Test login successful',
      token,
      user: {
        id: user._id,
        name: user.name || 'Demo User',
        email: user.email,
        role: user.role || 'cha'
      }
    });
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});