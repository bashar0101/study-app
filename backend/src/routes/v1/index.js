const express = require('express');
const authRoutes = require('../../modules/auth/auth.routes');
const userRoutes = require('../../modules/user/user.routes');
const studyRoutes = require('../../modules/study/study.routes');
const quizRoutes = require('../../modules/quiz/quiz.routes');
const examRoutes = require('../../modules/exam/exam.routes');
const analyticsRoutes = require('../../modules/analytics/analytics.routes');
const subjectsRouter = require('./subjects.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/subjects', subjectsRouter);
router.use('/study', studyRoutes);
router.use('/quiz', quizRoutes);
router.use('/exam', examRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
