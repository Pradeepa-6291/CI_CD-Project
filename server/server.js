require('dotenv').config();

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Connect MongoDB
connectDB();

const app = express();

// ✅ CORS
app.use(cors({
  origin: "*",
}));

// ✅ Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.json({
    message: '🌿 Ecothix API Running on AWS Lambda'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
  });
});


// ✅ LOCAL TESTING
if (process.env.NODE_ENV !== 'production') {

  const PORT = process.env.PORT || 5001;

  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on port ${PORT}`);
  });

}


// ✅ EXPORT FOR AWS LAMBDA
module.exports.handler = serverless(app);