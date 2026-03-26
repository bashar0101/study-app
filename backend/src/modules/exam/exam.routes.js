const express = require('express');
const auth = require('../../middlewares/auth');
const examController = require('./exam.controller');
const validate = require('../../middleware/validate');
const v = require('./exam.validation');
const { apiLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/start', auth, apiLimiter, validate(v.startExam), examController.startExam);
router.get('/:sessionId', auth, validate(v.getExam), examController.getExam);
router.post('/:sessionId/answer', auth, apiLimiter, validate(v.submitAnswer), examController.submitAnswer);
router.post('/:sessionId/submit', auth, validate(v.submitExam), examController.submitExam);
router.get('/:sessionId/results', auth, validate(v.getResults), examController.getResults);

module.exports = router;
