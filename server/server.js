const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const { connectDB } = require('./config/db');
const { seedData } = require('./config/seed');
const User = require('./models/User');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const portfolioRoutes = require('./routes/portfolio');
const blogRoutes = require('./routes/blogs');
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');
const careerRoutes = require('./routes/careers');
const dashboardRoutes = require('./routes/dashboard');
const testimonialRoutes = require('./routes/testimonials');
const searchRoutes = require('./routes/search');
const paymentRoutes = require('./routes/payments');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local uploads if needed
}));
app.use(cors());
// Parse large payloads for base64 files
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiter to API calls
app.use('/api', rateLimiter(250));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'NovaSphere API Server is running smoothly.' });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Root path fallback
app.get('/', (req, res) => {
  res.send('NovaSphere Tech Server API Hub. Use /api to query.');
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server & Auto-Seed
const startServer = async () => {
  await connectDB();
  
  // Auto-seed database if empty
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database appears empty. Auto-seeding initial data...');
      await seedData();
    }
  } catch (err) {
    console.error('Error during auto-seed check:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  NovaSphere API Server running on port ${PORT}`);
    console.log(`  Health API: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });
};

startServer();
