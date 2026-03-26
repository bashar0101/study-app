const express = require('express');
const auth = require('../../middlewares/auth');
const studyController = require('./study.controller');
const validate = require('../../middleware/validate');
const v = require('./study.validation');
const { apiLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/start', auth, apiLimiter, validate(v.startStudy), studyController.startStudy);
router.post('/:sessionId/next', auth, apiLimiter, validate(v.nextQuestion), studyController.getNextQuestion);
router.post('/:sessionId/answer', auth, apiLimiter, validate(v.submitAnswer), studyController.submitAnswer);
router.post('/:sessionId/end', auth, validate(v.endSession), studyController.endStudy);

module.exports = router;
