const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// ✅ UPDATED CORS FOR VERCEL DEPLOYMENT (ONLY THIS SECTION CHANGED)
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://minicrm-frontend.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// ✅ UPDATED MONGODB CONNECTION FOR VERCEL (MINIMAL CHANGE)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/minicrm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n📌 Troubleshooting tips:');
    console.log('1. Check MongoDB Atlas credentials');
    console.log('2. Whitelist your IP in MongoDB Atlas');
    console.log('3. Verify cluster is running');
    console.log('4. Connection string:', process.env.MONGODB_URI?.substring(0, 50) + '...');
});

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

// Health check
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({ 
        status: 'OK', 
        message: 'MiniCRM API is running',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Database connection status
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from DB');
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
  });
}