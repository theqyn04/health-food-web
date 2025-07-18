require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { handleErrors } = require('./utils/errorHandler');

// Kết nối database (MySQL Pool)
const db = require('./config/db');

// Khởi tạo app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Test kết nối DB
db.getConnection()
    .then(conn => {
        console.log('✅ MySQL Pool connected!');
        conn.release();
    })
    .catch(err => {
        console.error('❌ MySQL Connection error:', err.message);
        process.exit(1);
    });

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Health Food API 🚀' });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

// Import routes
const foodRoutes = require('./routes/food.routes');
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/login.routes');
const authRoutes = require('./routes/authRoutes');

// Authentication middleware
const authenticate = require('./middlewares/auth');

// Apply routes
app.use('/api/foods', foodRoutes);
app.use('/api/users', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', signupRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(handleErrors);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚦 Server is running on port ${PORT}`);
});

module.exports = app;