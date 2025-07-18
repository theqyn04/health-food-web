const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');
const authenticate = require('../middlewares/auth');

router.post('/register', signupController.register);
// Cập nhật thông tin profile
router.put('/profile', authenticate, signupController.updateProfile);

module.exports = router;