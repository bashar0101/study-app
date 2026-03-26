const asyncHandler = require('../../utils/asyncHandler');
const studyService = require('./study.service');

const startStudy = asyncHandler(async (req, res) => {
  const data = await studyService.startStudy(req.user.id, req.body);
  res.status(201).json(data);
});

const getNextQuestion = asyncHandler(async (req, res) => {
  const data = await studyService.getNextQuestion(req.user.id, req.params.sessionId);
  res.json(data);
});

const submitAnswer = asyncHandler(async (req, res) => {
  const data = await studyService.submitAnswer(req.user.id, req.params.sessionId, req.body);
  res.json(data);
});

const endStudy = asyncHandler(async (req, res) => {
  const data = await studyService.endStudy(req.user.id, req.params.sessionId);
  res.json(data);
});

module.exports = { startStudy, getNextQuestion, submitAnswer, endStudy };
