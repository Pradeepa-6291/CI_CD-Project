require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');

connectDB();

const app = express();

// ✅ CORS — allow Amplify + localhost
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // allow all amplify domains
    if (origin.endsWith('.amplifyapp.com')) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Handle preflight OPTIONS for all routes
app.options('*', cors());

app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ message: '🌿 Ecothix API Running' }));

// ✅ All routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// ✅ Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ✅ AWS Lambda export
module.exports.handler = serverless(app);
