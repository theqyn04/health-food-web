const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'vietnam_secret';

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập đủ username và password' });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? LIMIT 1', [username]
        );

        if (!rows.length) {
            return res.status(401).json({ error: 'Username hoặc mật khẩu không đúng' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Username hoặc mật khẩu không đúng' });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({ message: 'Đăng nhập thành công!', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
    }
};