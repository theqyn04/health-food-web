const db = require('../config/db');

// Lấy tất cả thực phẩm
exports.getAllFoods = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM foods');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy dữ liệu thực phẩm' });
    }
};

// Lấy thông tin thực phẩm theo id
exports.getFoodById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM foods WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy thực phẩm' });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy dữ liệu thực phẩm' });
    }
};