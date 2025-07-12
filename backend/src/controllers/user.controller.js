const db = require('../config/db');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // Thêm thư viện validator

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    
    // 1. Validate input cơ bản
    if (!username || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
    }

    // 2. Validate email (nếu có)
    const emailError = validateEmail(email);
    if (emailError) {
        return res.status(400).json({ error: emailError });
    }

    // 3. Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }

    try {
        // 4. Kiểm tra username/email tồn tại
        const [userExists] = await db.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email || null]
        );
        
        if (userExists.length > 0) {
            const error = userExists.some(u => u.username === username) 
                ? 'Tên đăng nhập đã tồn tại' 
                : 'Email đã được đăng ký';
            return res.status(409).json({ error });
        }

        // 5. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // 6. Lưu vào database
        await db.query(
            'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
            [username, hashPassword, email || null]
        );

        return res.status(201).json({ message: 'Đăng ký thành công' });

    } catch (err) {
        console.error('Lỗi đăng ký:', err);
        return res.status(500).json({ 
            error: 'Có lỗi khi đăng ký',
            detail: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
};

// Hàm validate password (nâng cấp)
function validatePassword(password) {
    const rules = [
        { test: p => p.length >= 8, message: 'Ít nhất 8 ký tự' },
        { test: p => /[0-9]/.test(p), message: 'Chứa ít nhất 1 số' },
        { test: p => /[A-Z]/.test(p), message: 'Chứa ít nhất 1 chữ hoa' },
        { test: p => /[!@#$%^&*]/.test(p), message: 'Chứa ít nhất 1 ký tự đặc biệt' },
        { test: p => !p.includes('password'), message: 'Không chứa từ "password"' }
    ];

    const errors = rules
        .filter(rule => !rule.test(password))
        .map(rule => rule.message);

    return errors.length > 0 
        ? `Mật khẩu không hợp lệ: ${errors.join(', ')}`
        : null;
}

// Hàm validate email mới
function validateEmail(email) {
    if (!email) return null; // Email là optional
    
    if (!validator.isEmail(email)) {
        return 'Email không đúng định dạng (ví dụ: user@example.com)';
    }
    
    // Kiểm tra thêm nếu cần
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Email chứa khoảng trắng hoặc ký tự không hợp lệ';
    }
    
    if (email.length > 254) {
        return 'Email quá dài (tối đa 254 ký tự)';
    }
    
    return null;
}