const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// ✅ UPDATED CORS FOR VERCEL DEPLOYMENT

// ✅ UPDATED CORS FOR VERCEL & LOCALHOST
const allowedOrigins = [
  'https://minicrm-frontend-two.vercel.app',
  'http://localhost:3000'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight OPTIONS requests for all routes
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ UPDATED: Set up mongoose connection event listeners FIRST
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from DB');
});

// ✅ UPDATED MONGODB CONNECTION WITH TIMEOUT SETTINGS
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/minicrm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'unknown'}`);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('\n📌 Troubleshooting tips:');
  console.log('1. Check MongoDB Atlas credentials');
  console.log('2. Whitelist your IP in MongoDB Atlas (0.0.0.0/0)');
  console.log('3. Verify cluster is running');
  console.log('4. Connection string exists:', !!process.env.MONGODB_URI);
  console.log('Full error:', err);
});

// Handle app termination (for local development)
if (!process.env.VERCEL) {
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
}

// Import routes
const leadRoutes = require('./routes/leads');
const authMiddleware = require('./middleware/auth');

// Routes
app.use('/api/leads', authMiddleware, leadRoutes);

// Auth Routes (simple login for demo)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // For demo, using environment variables
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET || 'fallback_jwt_secret_for_vercel',
      { expiresIn: '24h' }
    );
    return res.json({ 
      success: true, 
      token, 
      user: { email, role: 'admin' } 
    });
  }
  
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Contact form endpoint (no auth required)
app.post('/api/contact', async (req, res) => {
  try {
    const Lead = require('./models/Lead');
    const lead = new Lead({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      source: req.body.source || 'Website',
      status: 'New',
      notes: []
    });
    
    await lead.save();
    res.status(201).json({ success: true, message: 'Lead created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DEBUG: Check MongoDB connection details
app.get('/api/debug-db', async (req, res) => {
  try {
    // Mask the password in connection string for security
    const connStr = process.env.MONGODB_URI || 'not set';
    const maskedStr = connStr.replace(/\/\/[^@]+@/, '//***:***@');
    
    const status = {
      mongooseState: mongoose.connection.readyState,
      mongooseStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
      hasMongoURI: !!process.env.MONGODB_URI,
      mongoURILength: connStr.length,
      maskedConnectionString: maskedStr,
      nodeEnv: process.env.NODE_ENV,
      inVercel: !!process.env.VERCEL,
      timestamp: new Date().toISOString(),
      // Additional debug info
      mongodbUriFirst50: process.env.MONGODB_URI?.substring(0, 50) + '...',
      mongodbUriLast50: '...' + process.env.MONGODB_URI?.slice(-50)
    };
    
    res.json(status);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 
                   mongoose.connection.readyState === 2 ? 'Connecting' : 'Disconnected';
  res.json({ 
    status: 'OK', 
    message: 'MiniCRM API is running',
    database: dbStatus,
    databaseCode: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// ✅ ADDED FOR VERCEL: Export for serverless function
const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  // Export for Vercel serverless
  module.exports = app;
} else {
  // Local development
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🐛 Debug: http://localhost:${PORT}/api/debug-db`);
  });
}