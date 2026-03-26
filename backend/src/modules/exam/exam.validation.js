const { z } = require('zod');

const startExam = z.object({
  body: z.object({
    subjectId: z.string().min(1),
    topicIds: z.array(z.string()).min(1),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
    questionCount: z.coerce.number().int().min(5).max(50).default(20),
    timeLimitMin: z.coerce.number().int().min(5).max(180).default(60),
  }),
});

const getExam = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
});

const submitAnswer = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
  body: z.object({
    questionId: z.string().min(1),
    answer: z.string().min(1),
    timeSpentSec: z.coerce.number().int().min(0).optional(),
  }),
});

const submitExam = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
  body: z.object({
    answers: z.array(z.object({
      questionId: z.string(),
      answer: z.string(),
      timeSpentSec: z.coerce.number().int().min(0).optional(),
    })).optional(),
  }),
});

const getResults = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
});

module.exports = { startExam, getExam, submitAnswer, submitExam, getResults };
