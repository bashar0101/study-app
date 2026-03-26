const asyncHandler = require('../../utils/asyncHandler');
const analyticsService = require('./analytics.service');

const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverview(req.user.id);
  res.json(data);
});

const getSubjects = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSubjectBreakdown(req.user.id);
  res.json(data);
});

const getProgress = asyncHandler(async (req, res) => {
  const data = await analyticsService.getProgress(req.user.id);
  res.json(data);
});

const getWeakAreas = asyncHandler(async (req, res) => {
  const data = await analyticsService.getWeakAreas(req.user.id);
  res.json(data);
});

const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const data = await analyticsService.getHistory(req.user.id, page, limit);
  res.json(data);
});

const getDaily = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDaily(req.user.id);
  res.json(data);
});

module.exports = { getOverview, getSubjects, getProgress, getWeakAreas, getHistory, getDaily };
