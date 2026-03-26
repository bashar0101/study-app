const { z } = require('zod');

const startQuiz = z.object({
  body: z.object({
    subjectId: z.string().min(1),
    topicId: z.string().optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
    questionCount: z.coerce.number().int().min(5).max(20).default(10),
  }),
});

const submitAnswer = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
  body: z.object({
    questionId: z.string().min(1),
    answer: z.string().min(1),
    timeSpentSec: z.coerce.number().int().min(0).optional(),
  }),
});

const submitQuiz = z.object({
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

module.exports = { startQuiz, submitAnswer, submitQuiz, getResults };
