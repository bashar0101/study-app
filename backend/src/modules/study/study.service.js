const prisma = require('../../config/prisma');
const { aiService } = require('../../services');
const ApiError = require('../../utils/apiError');
const { QUESTION_TYPES } = require('../../utils/constants');

const startStudy = async (userId, { subjectId, topicId, difficulty }) => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: { topics: true },
  });
  if (!subject) throw new ApiError(404, 'Subject not found');

  let topicName = null;
  if (topicId) {
    const topic = subject.topics.find((t) => t.id === topicId);
    if (!topic) throw new ApiError(404, 'Topic not found');
    topicName = topic.name;
  }

  const session = await prisma.studySession.create({
    data: {
      userId,
      mode: 'STUDY',
      subjectId,
      subjectName: subject.name,
      topicName,
      difficulty,
    },
  });

  // Generate first question
  const questionType = randomQuestionType(['MCQ', 'SHORT_ANSWER', 'TRUE_FALSE']);
  const aiQuestions = await aiService.generateQuestions({
    subject: subject.name,
    topic: topicName,
    difficulty,
    questionType,
    count: 1,
  });

  const q = aiQuestions[0];
  const question = await prisma.question.create({
    data: {
      sessionId: session.id,
      questionNumber: 1,
      type: questionType,
      difficulty,
      questionText: q.questionText,
      options: q.options || undefined,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    },
  });

  await prisma.studySession.update({
    where: { id: session.id },
    data: { totalQuestions: 1 },
  });

  return { session, question };
};

const getNextQuestion = async (userId, sessionId) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: { questions: { select: { questionText: true } } },
  });
  if (!session || session.userId !== userId) throw new ApiError(404, 'Session not found');
  if (session.status !== 'IN_PROGRESS') throw new ApiError(400, 'Session is not in progress');

  const questionType = randomQuestionType(['MCQ', 'SHORT_ANSWER', 'TRUE_FALSE']);
  const previousQuestions = session.questions.map((q) => q.questionText);

  const aiQuestions = await aiService.generateQuestions({
    subject: session.subjectName,
    topic: session.topicName,
    difficulty: session.difficulty,
    questionType,
    count: 1,
    previousQuestions,
  });

  const q = aiQuestions[0];
  const nextNumber = session.questions.length + 1;

  const question = await prisma.question.create({
    data: {
      sessionId,
      questionNumber: nextNumber,
      type: questionType,
      difficulty: session.difficulty,
      questionText: q.questionText,
      options: q.options || undefined,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    },
  });

  await prisma.studySession.update({
    where: { id: sessionId },
    data: { totalQuestions: nextNumber },
  });

  return { question };
};

const submitAnswer = async (userId, sessionId, { questionId, answer, timeSpentSec }) => {
  const session = await prisma.studySession.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== userId) throw new ApiError(404, 'Session not found');

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question || question.sessionId !== sessionId) throw new ApiError(404, 'Question not found');

  let isCorrect;
  let evaluation;

  if (question.type === 'MCQ' || question.type === 'TRUE_FALSE') {
    isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    evaluation = {
      score: isCorrect ? 100 : 0,
      isCorrect,
      feedback: isCorrect ? 'Correct!' : `The correct answer is: ${question.correctAnswer}`,
      strengths: isCorrect ? ['Good knowledge of this topic'] : [],
      improvements: isCorrect ? [] : ['Review this concept'],
    };
  } else {
    evaluation = await aiService.evaluateAnswer({
      questionText: question.questionText,
      correctAnswer: question.correctAnswer,
      userAnswer: answer,
      questionType: question.type,
    });
    isCorrect = evaluation.isCorrect || evaluation.score >= 70;
  }

  await prisma.question.update({
    where: { id: questionId },
    data: {
      userAnswer: answer,
      isCorrect,
      aiEvaluation: evaluation,
      answeredAt: new Date(),
      timeSpentSec,
    },
  });

  if (isCorrect) {
    await prisma.studySession.update({
      where: { id: sessionId },
      data: { correctAnswers: { increment: 1 } },
    });
  }

  return { evaluation, isCorrect };
};

const endStudy = async (userId, sessionId) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: { questions: true },
  });
  if (!session || session.userId !== userId) throw new ApiError(404, 'Session not found');

  const totalQuestions = session.questions.length;
  const correctAnswers = session.questions.filter((q) => q.isCorrect).length;
  const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  const updated = await prisma.studySession.update({
    where: { id: sessionId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      totalQuestions,
      correctAnswers,
      score,
    },
  });

  return { session: updated };
};

function randomQuestionType(types) {
  return types[Math.floor(Math.random() * types.length)];
}

module.exports = { startStudy, getNextQuestion, submitAnswer, endStudy };
