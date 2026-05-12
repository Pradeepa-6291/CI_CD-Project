require('dotenv').config();

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ✅ Connect MongoDB
connectDB();

const app = express();


// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);


// ✅ CORS Configuration
app.use(cors({
  origin: (origin, callback) => {

    // Allow requests with no origin
    // (Postman, mobile apps, curl)
    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost + CLIENT_URL
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Amplify domains
    if (origin.endsWith('.amplifyapp.com')) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],
}));


// ✅ Handle preflight requests
app.options('*', cors());


// ✅ Middleware
app.use(express.json());


// ✅ Health Check Route
app.get('/', (req, res) => {
  res.json({
    message: '🌿 Ecothix API Running on AWS Lambda',
  });
});


// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);


// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.path} not found`,
  });
});


// ✅ Global Error Handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars

  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
  });
});


// ✅ Local Development
if (require.main === module) {

  const PORT = process.env.PORT || 5001;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}


// ✅ AWS Lambda Export
module.exports.handler = serverless(app);