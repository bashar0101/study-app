const asyncHandler = require('../../utils/asyncHandler');
const quizService = require('./quiz.service');

const startQuiz = asyncHandler(async (req, res) => {
  const data = await quizService.startQuiz(req.user.id, req.body);
  res.status(201).json(data);
});

const submitAnswer = asyncHandler(async (req, res) => {
  const data = await quizService.submitAnswer(req.user.id, req.params.sessionId, req.body);
  res.json(data);
});

const submitQuiz = asyncHandler(async (req, res) => {
  const data = await quizService.submitQuiz(req.user.id, req.params.sessionId, req.body.answers);
  res.json(data);
});

const getResults = asyncHandler(async (req, res) => {
  const data = await quizService.getResults(req.user.id, req.params.sessionId);
  res.json(data);
});

module.exports = { startQuiz, submitAnswer, submitQuiz, getResults };
