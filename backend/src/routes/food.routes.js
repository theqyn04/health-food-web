const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');

// GET /api/foods - lấy toàn bộ thực phẩm
router.get('/', foodController.getAllFoods);

// GET /api/foods/:id - lấy info thực phẩm cụ thể
router.get('/:id', foodController.getFoodById);

module.exports = router;