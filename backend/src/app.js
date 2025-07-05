require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Kết nối database (MySQL Pool)
const db = require('./config/db'); // Đường dẫn tùy chỉnh theo cấu trúc của bạn

// Khởi tạo app
const app = express();

// Middleware
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

// Example route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Health Food API 🚀' });
});


// Định nghĩa route API (có thể tách file)
const foodRoutes = require('./routes/food.routes');

app.use('/api/foods', foodRoutes);

// Xử lý route 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Xử lý lỗi tổng quát
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚦 Server is running on port ${PORT}`);
});

module.exports = app;