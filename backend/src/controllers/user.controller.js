const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
    }

    try {
        // Kiểm tra user đã tồn tại chưa
        const [existRows] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existRows.length > 0) {
            return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Lưu user mới vào DB
        await db.query(
            'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
            [username, hashPassword, email || null]
        );

        return res.status(201).json({ message: 'Đăng kí thành công' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Có lỗi khi đăng kí' });
    }
};