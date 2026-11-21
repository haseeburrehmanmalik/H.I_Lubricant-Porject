const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');
const seedData = require('./utils/seeder');
const Product = require('./models/Product');
const User = require('./models/User');

// Routes imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const converterRoutes = require('./routes/converterRoutes');
const OilConverter = require('./models/OilConverter');

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev origins
      }
    },
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Rate limiting on sensitive auth login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 login requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount Routes
app.use('/api/admin', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/admin/inventory', inventoryRoutes);
app.use('/api/admin/customers', customerRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', converterRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    business: 'H.I Lubricant',
    location: 'Hyderabad, Sindh, Pakistan',
    tagline: 'POWER YOUR JOURNEY.',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();

    // Ensure all 10 Oil Converter slots exist
    await OilConverter.ensureTenSlots();

    // Check if database needs seeding
    const productCount = await Product.countDocuments();
    const adminUser = await User.findOne({ role: 'admin' });

    if (productCount === 0 || !adminUser) {
      console.log('[Auto-Init] Database is empty or missing admin. Running initial seed...');
      await seedData();
      console.log('[Auto-Init] Initial seed completed successfully.');
    }

    app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`  H.I LUBRICANT BACKEND API RUNNING ON PORT ${PORT}  `);
      console.log(`  URL: http://localhost:${PORT}                      `);
      console.log('  Health check: http://localhost:' + PORT + '/api/health');
      console.log('====================================================');
    });
  } catch (error) {
    console.error('[Server Start Error]:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
