const db = require('../config/db');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // Thêm thư viện validator
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Không tìm thấy token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Lỗi xác thực token:', err);
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

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


exports.updateProfile = async (req, res) => {
    // Lấy user_id từ token đã xác thực
    const userId = req.userId;

    const {
        first_name,
        last_name,
        date_of_birth,
        gender,
        height_cm,
        weight_kg,
        activity_level,
        gout_severity,
        medication
    } = req.body;

    // Validate input
    const validationErrors = validateProfileData(req.body);
    if (validationErrors.length > 0) {
        return res.status(400).json({
            error: 'Dữ liệu không hợp lệ',
            details: validationErrors
        });
    }

    try {
        // Cập nhật thông tin người dùng
        await db.query(
            `UPDATE users SET 
                first_name = ?,
                last_name = ?,
                date_of_birth = ?,
                gender = ?,
                height_cm = ?,
                weight_kg = ?,
                activity_level = ?,
                gout_severity = ?,
                medication = ?
            WHERE user_id = ?`,
            [
                first_name,
                last_name,
                date_of_birth,
                gender,
                height_cm,
                weight_kg,
                activity_level,
                gout_severity,
                medication,
                userId
            ]
        );

        // Lấy thông tin người dùng đã cập nhật
        const [updatedUser] = await db.query(
            'SELECT * FROM users WHERE user_id = ?',
            [userId]
        );

        // Trả về thông tin đã cập nhật (loại bỏ password_hash)
        const { password_hash, ...userData } = updatedUser[0];

        return res.status(200).json({
            message: 'Cập nhật thông tin thành công',
            user: userData
        });

    } catch (err) {
        console.error('Lỗi khi cập nhật thông tin:', err);
        return res.status(500).json({
            error: 'Có lỗi khi cập nhật thông tin',
            detail: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
};

// Hàm validate dữ liệu profile
function validateProfileData(data) {
    const errors = [];

    // Validate date_of_birth
    if (data.date_of_birth) {
        const dob = new Date(data.date_of_birth);
        const now = new Date();

        if (dob >= now) {
            errors.push('Ngày sinh phải trong quá khứ');
        }

        // Kiểm tra tuổi tối thiểu 13
        const ageDiff = now - dob;
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < 13) {
            errors.push('Bạn phải từ 13 tuổi trở lên');
        }
    }

    // Validate height
    if (data.height_cm) {
        const height = parseFloat(data.height_cm);
        if (isNaN(height) || height < 100 || height > 250) {
            errors.push('Chiều cao phải từ 100cm đến 250cm');
        }
    }

    // Validate weight
    if (data.weight_kg) {
        const weight = parseFloat(data.weight_kg);
        if (isNaN(weight) || weight < 30 || weight > 300) {
            errors.push('Cân nặng phải từ 30kg đến 300kg');
        }
    }

    // Validate gender
    if (data.gender && !['male', 'female', 'other'].includes(data.gender)) {
        errors.push('Giới tính không hợp lệ');
    }

    // Validate activity level
    if (data.activity_level && ![
        'sedentary',
        'lightly_active',
        'moderately_active',
        'very_active',
        'extremely_active'
    ].includes(data.activity_level)) {
        errors.push('Mức độ hoạt động không hợp lệ');
    }

    // Validate gout severity
    if (data.gout_severity && !['mild', 'moderate', 'severe'].includes(data.gout_severity)) {
        errors.push('Mức độ gút không hợp lệ');
    }

    return errors;
}