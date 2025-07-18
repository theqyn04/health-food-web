const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// OTP Routes only
router.post('/send-otp', otpController.sendOtp);
router.post('/verify-otp', otpController.verifyOtp);

module.exports = router;