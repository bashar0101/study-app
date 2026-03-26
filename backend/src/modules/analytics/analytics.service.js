const prisma = require('../../config/prisma');

const getOverview = async (userId) => {
  const [sessions, questionAgg] = await Promise.all([
    prisma.studySession.aggregate({
      where: { userId, status: 'COMPLETED' },
      _count: true,
      _avg: { score: true },
    }),
    prisma.question.aggregate({
      where: { session: { userId } },
      _count: true,
    }),
  ]);

  // Calculate streak
  const recentSessions = await prisma.studySession.findMany({
    where: { userId, status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true },
    take: 365,
  });

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];

    const hasSession = recentSessions.some((s) => {
      const d = new Date(s.completedAt);
      return d.toISOString().split('T')[0] === dateStr;
    });

    if (hasSession) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return {
    totalSessions: sessions._count,
    totalQuestions: questionAgg._count,
    avgScore: Math.round((sessions._avg.score || 0) * 100) / 100,
    streak,
  };
};

const getSubjectBreakdown = async (userId) => {
  const sessions = await prisma.studySession.groupBy({
    by: ['subjectName'],
    where: { userId, status: 'COMPLETED' },
    _avg: { score: true },
    _count: true,
  });

  return {
    subjects: sessions.map((s) => ({
      subject: s.subjectName,
      avgScore: Math.round((s._avg.score || 0) * 100) / 100,
      sessionsCount: s._count,
    })),
  };
};

const getProgress = async (userId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sessions = await prisma.studySession.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      completedAt: { gte: thirtyDaysAgo },
    },
    select: {
      mode: true,
      score: true,
      completedAt: true,
    },
    orderBy: { completedAt: 'asc' },
  });

  // Group by date
  const dateMap = {};
  sessions.forEach((s) => {
    const date = new Date(s.completedAt).toISOString().split('T')[0];
    if (!dateMap[date]) dateMap[date] = { date, study: null, quiz: null, exam: null };
    const mode = s.mode.toLowerCase();
    const existing = dateMap[date][mode];
    dateMap[date][mode] = existing ? (existing + s.score) / 2 : s.score;
  });

  return { progress: Object.values(dateMap) };
};

const getWeakAreas = async (userId) => {
  const questions = await prisma.question.findMany({
    where: {
      session: { userId, status: 'COMPLETED' },
      isCorrect: false,
    },
    include: {
      session: { select: { subjectName: true } },
      topic: { select: { name: true } },
    },
  });

  // Aggregate by topic
  const topicMap = {};
  questions.forEach((q) => {
    const key = q.topic?.name || 'General';
    if (!topicMap[key]) {
      topicMap[key] = { topic: key, subjectName: q.session.subjectName, total: 0, correct: 0 };
    }
    topicMap[key].total++;
  });

  // Also count correct ones
  const correctQuestions = await prisma.question.findMany({
    where: {
      session: { userId, status: 'COMPLETED' },
      isCorrect: true,
    },
    include: { topic: { select: { name: true } } },
  });
  correctQuestions.forEach((q) => {
    const key = q.topic?.name || 'General';
    if (topicMap[key]) topicMap[key].correct++;
  });

  const weakAreas = Object.values(topicMap)
    .map((t) => ({
      ...t,
      score: t.total > 0 ? Math.round((t.correct / (t.correct + t.total)) * 100) : 0,
    }))
    .filter((t) => t.score < 60)
    .sort((a, b) => a.score - b.score)
    .slice(0, 10);

  return { weakAreas };
};

const getHistory = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    prisma.studySession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        mode: true,
        status: true,
        subjectName: true,
        topicName: true,
        difficulty: true,
        totalQuestions: true,
        correctAnswers: true,
        score: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
      },
    }),
    prisma.studySession.count({ where: { userId } }),
  ]);

  return { sessions, total, page, limit };
};

const getDaily = async (userId) => {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const sessions = await prisma.studySession.findMany({
    where: {
      userId,
      createdAt: { gte: ninetyDaysAgo },
    },
    select: { createdAt: true },
  });

  const dayMap = {};
  sessions.forEach((s) => {
    const date = new Date(s.createdAt).toISOString().split('T')[0];
    dayMap[date] = (dayMap[date] || 0) + 1;
  });

  return {
    daily: Object.entries(dayMap).map(([date, count]) => ({ date, count })),
  };
};

module.exports = { getOverview, getSubjectBreakdown, getProgress, getWeakAreas, getHistory, getDaily };
