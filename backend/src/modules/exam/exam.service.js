const prisma = require('../../config/prisma');
const { aiService } = require('../../services');
const ApiError = require('../../utils/apiError');

const EXAM_TYPES = ['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY'];

const startExam = async (userId, { subjectId, topicIds, difficulty, questionCount, timeLimitMin }) => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: { topics: true },
  });
  if (!subject) throw new ApiError(404, 'Subject not found');

  const topics = subject.topics.filter((t) => topicIds.includes(t.id));
  if (topics.length === 0) throw new ApiError(400, 'No valid topics selected');

  const session = await prisma.studySession.create({
    data: {
      userId,
      mode: 'EXAM',
      subjectId,
      subjectName: subject.name,
      topicName: topics.map((t) => t.name).join(', '),
      difficulty,
      totalQuestions: questionCount,
      timeLimitMin,
    },
  });

  // Generate questions across topics
  const questions = [];
  const questionsPerTopic = Math.ceil(questionCount / topics.length);
  let generated = 0;

  for (const topic of topics) {
    if (generated >= questionCount) break;
    const count = Math.min(questionsPerTopic, questionCount - generated);
    const type = EXAM_TYPES[generated % EXAM_TYPES.length];

    const aiQuestions = await aiService.generateQuestions({
      subject: subject.name,
      topic: topic.name,
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
          topicId: topic.id,
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

  // Return questions without correctAnswer
  const sanitized = questions.map(({ correctAnswer, explanation, ...q }) => q);
  return { session, questions: sanitized };
};

const getExamState = async (userId, sessionId) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        orderBy: { questionNumber: 'asc' },
        select: {
          id: true,
          questionNumber: true,
          type: true,
          difficulty: true,
          questionText: true,
          options: true,
          userAnswer: true,
          answeredAt: true,
        },
      },
    },
  });
  if (!session || session.userId !== userId) throw new ApiError(404, 'Session not found');

  // Calculate time remaining
  const elapsed = (Date.now() - new Date(session.startedAt).getTime()) / 1000;
  const timeRemainingSeconds = Math.max(0, (session.timeLimitMin || 60) * 60 - elapsed);

  return { session, questions: session.questions, timeRemainingSeconds: Math.floor(timeRemainingSeconds) };
};

const submitAnswer = async (userId, sessionId, { questionId, answer, timeSpentSec }) => {
  const session = await prisma.studySession.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== userId) throw new ApiError(404, 'Session not found');
  if (session.status !== 'IN_PROGRESS') throw new ApiError(400, 'Exam already submitted');

  await prisma.question.update({
    where: { id: questionId },
    data: { userAnswer: answer, answeredAt: new Date(), timeSpentSec },
  });

  return { saved: true };
};

const submitExam = async (userId, sessionId, answersFromBody) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: { questions: true },
  });
  if (!session || session.userId !== userId) throw new ApiError(404, 'Session not found');
  if (session.status !== 'IN_PROGRESS') throw new ApiError(400, 'Exam already submitted');

  // Save any bulk answers
  if (answersFromBody?.length) {
    for (const a of answersFromBody) {
      await prisma.question.update({
        where: { id: a.questionId },
        data: { userAnswer: a.answer, answeredAt: new Date(), timeSpentSec: a.timeSpentSec },
      });
    }
  }

  // Score
  const questions = await prisma.question.findMany({
    where: { sessionId },
    orderBy: { questionNumber: 'asc' },
  });

  let correctCount = 0;
  for (const q of questions) {
    if (!q.userAnswer) {
      await prisma.question.update({
        where: { id: q.id },
        data: { isCorrect: false, aiEvaluation: { score: 0, isCorrect: false, feedback: 'No answer provided' } },
      });
      continue;
    }

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

module.exports = { startExam, getExamState, submitAnswer, submitExam, getResults };
