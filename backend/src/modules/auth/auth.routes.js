const express = require('express');
const authController = require('./auth.controller');
const validate = require('../../middleware/validate');
const authValidation = require('./auth.validation');
const auth = require('../../middlewares/auth');
const { authLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, validate(authValidation.register), authController.register);
router.post('/login', authLimiter, validate(authValidation.login), authController.login);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/refresh', authController.refresh);
router.post('/logout', auth, authController.logout);
router.post('/forgot-password', authLimiter, validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
