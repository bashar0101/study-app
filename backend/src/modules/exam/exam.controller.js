const asyncHandler = require('../../utils/asyncHandler');
const examService = require('./exam.service');

const startExam = asyncHandler(async (req, res) => {
  const data = await examService.startExam(req.user.id, req.body);
  res.status(201).json(data);
});

const getExam = asyncHandler(async (req, res) => {
  const data = await examService.getExamState(req.user.id, req.params.sessionId);
  res.json(data);
});

const submitAnswer = asyncHandler(async (req, res) => {
  const data = await examService.submitAnswer(req.user.id, req.params.sessionId, req.body);
  res.json(data);
});

const submitExam = asyncHandler(async (req, res) => {
  const data = await examService.submitExam(req.user.id, req.params.sessionId, req.body.answers);
  res.json(data);
});

const getResults = asyncHandler(async (req, res) => {
  const data = await examService.getResults(req.user.id, req.params.sessionId);
  res.json(data);
});

module.exports = { startExam, getExam, submitAnswer, submitExam, getResults };
