const prisma = require('../../config/prisma');
const { aiService } = require('../../services');
const ApiError = require('../../utils/apiError');

const QUIZ_TYPES = ['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER'];

const startQuiz = async (userId, { subjectId, topicId, difficulty, questionCount }) => {
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
      mode: 'QUIZ',
      subjectId,
      subjectName: subject.name,
      topicName,
      difficulty,
      totalQuestions: questionCount,
    },
  });

  // Generate all questions at once (mix of types)
  const questions = [];
  const batchSize = Math.min(questionCount, 10);
  let generated = 0;

  while (generated < questionCount) {
    const count = Math.min(batchSize, questionCount - generated);
    const type = QUIZ_TYPES[generated % QUIZ_TYPES.length];

    const aiQuestions = await aiService.generateQuestions({
      subject: subject.name,
      topic: topicName,
      difficulty,
      questionType: type,
      count,
      previousQuestions: questions.map((q) => q.questionText),
    });

    for (const q of aiQuestions) {
      generated++;
      const question = await prisma.question.create({
        data: {
          sessionId: session.id,
          questionNumber: generated,
          type,
          difficulty,
          questionText: q.questionText,
          options: q.options || undefined,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        },
      });
      questions.push(question);
      if (generated >= questionCount) break;
    }
  }

  // Return questions without answers
  const sanitized = questions.map(({ correctAnswer, explanation, ...q }) => q);
  return { session, questions: sanitized };
};

const submitAnswer = async (userId, sessionId, { questionId, answer, timeSpentSec }) => {
  const session = await prisma.studySession.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== userId) throw new ApiError(404, 'Session not found');
  if (session.status !== 'IN_PROGRESS') throw new ApiError(400, 'Quiz already submitted');

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question || question.sessionId !== sessionId) throw new ApiError(404, 'Question not found');

  await prisma.question.update({
    where: { id: questionId },
    data: { userAnswer: answer, answeredAt: new Date(), timeSpentSec },
  });

  return { saved: true };
};

const submitQuiz = async (userId, sessionId, answersFromBody) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: { questions: true },
  });
  if (!session || session.userId !== userId) throw new ApiError(404, 'Session not found');
  if (session.status !== 'IN_PROGRESS') throw new ApiError(400, 'Quiz already submitted');

  // Save any bulk-submitted answers
  if (answersFromBody?.length) {
    for (const a of answersFromBody) {
      await prisma.question.update({
        where: { id: a.questionId },
        data: { userAnswer: a.answer, answeredAt: new Date(), timeSpentSec: a.timeSpentSec },
      });
    }
  }

  // Score each question
  const questions = await prisma.question.findMany({
    where: { sessionId },
    orderBy: { questionNumber: 'asc' },
  });

  let correctCount = 0;
  for (const q of questions) {
    if (!q.userAnswer) continue;

    let isCorrect;
    if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
      isCorrect = q.userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      await prisma.question.update({
        where: { id: q.id },
        data: {
          isCorrect,
          aiEvaluation: {
            score: isCorrect ? 100 : 0,
            isCorrect,
            feedback: isCorrect ? 'Correct!' : `The correct answer is: ${q.correctAnswer}`,
          },
        },
      });
    } else {
      const evaluation = await aiService.evaluateAnswer({
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        userAnswer: q.userAnswer,
        questionType: q.type,
      });
      isCorrect = evaluation.isCorrect || evaluation.score >= 70;
      await prisma.question.update({
        where: { id: q.id },
        data: { isCorrect, aiEvaluation: evaluation },
      });
    }

    if (isCorrect) correctCount++;
  }

  const score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

  const updated = await prisma.studySession.update({
    where: { id: sessionId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      correctAnswers: correctCount,
      score,
    },
  });

  return { session: updated };
};

const getResults = async (userId, sessionId) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      questions: { orderBy: { questionNumber: 'asc' } },
    },
  });
  if (!session || session.userId !== userId) throw new ApiError(404, 'Session not found');

  return { session, questions: session.questions };
};

module.exports = { startQuiz, submitAnswer, submitQuiz, getResults };
