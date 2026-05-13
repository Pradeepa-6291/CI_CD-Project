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

// ✅ CORS — wildcard for Lambda + API Gateway
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ message: '🌿 Ecothix API Running' }));

// ✅ All routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Local dev
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ✅ Lambda export
module.exports.handler = serverless(app);
