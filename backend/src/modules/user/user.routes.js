const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('./user.controller');
const validate = require('../../middleware/validate');
const userValidation = require('./user.validation');

const router = express.Router();

router.get('/me', auth, userController.getMe);
router.patch('/me', auth, validate(userValidation.updateProfile), userController.updateMe);
router.patch('/me/password', auth, validate(userValidation.changePassword), userController.changePassword);

module.exports = router;
