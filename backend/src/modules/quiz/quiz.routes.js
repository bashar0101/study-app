const express = require('express');
const auth = require('../../middlewares/auth');
const quizController = require('./quiz.controller');
const validate = require('../../middleware/validate');
const v = require('./quiz.validation');
const { apiLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/start', auth, apiLimiter, validate(v.startQuiz), quizController.startQuiz);
router.post('/:sessionId/answer', auth, apiLimiter, validate(v.submitAnswer), quizController.submitAnswer);
router.post('/:sessionId/submit', auth, validate(v.submitQuiz), quizController.submitQuiz);
router.get('/:sessionId/results', auth, validate(v.getResults), quizController.getResults);

module.exports = router;
