const express = require('express');
const auth = require('../../middlewares/auth');
const analyticsController = require('./analytics.controller');

const router = express.Router();

router.get('/overview', auth, analyticsController.getOverview);
router.get('/subjects', auth, analyticsController.getSubjects);
router.get('/progress', auth, analyticsController.getProgress);
router.get('/weak-areas', auth, analyticsController.getWeakAreas);
router.get('/history', auth, analyticsController.getHistory);
router.get('/daily', auth, analyticsController.getDaily);

module.exports = router;
